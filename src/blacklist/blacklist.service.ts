import { Injectable } from '@nestjs/common';
import { watch } from 'chokidar';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { GetIdsDto } from './_utils/dto/response/get-ids.dto';
import { Subject } from 'rxjs';
import { SetIpDto } from './_utils/dto/request/set-ip.dto';
import * as Docker from 'dockerode';
import { RpcException } from '@nestjs/microservices';
import { readFile, writeFile } from 'fs/promises';
import { HistoryRepository } from '../history/history.repository';
import { GetBlockCountryReply } from './_utils/dto/response/get-block-country-reply.dto';

@Injectable()
export class BlacklistService {

  constructor(
    private historyRepository: HistoryRepository,
    // ... autres dépendances ...
  ) {}
  
  private docker = new Docker();
  private previousBlockedIps: string[] = [];

  private async processFileChange(path: string, subject: Subject<GetIdsDto>) {
    readFile(path, 'utf8')
      .then((blockContent) => {
        const regex = /deny\s+((?:\d{1,3}\.){3}\d{1,3});/g;
        const matches = blockContent.match(regex) || [];

        const ips = matches
          .map((entry) => {
            const ipRegex = /((?:\d{1,3}\.){3}\d{1,3})/;
            const match = entry.match(ipRegex);
            return match ? match[1] : null;
          })
          .filter((ip) => ip !== null) as string[];

        subject.next({ ips });

        const newBlockedIps = ips.filter(ip => !this.previousBlockedIps.includes(ip));
        newBlockedIps.forEach(async (ip) => {
          await this.historyRepository.createHistoryEntry({
            date: new Date(),
            actionType: 'attack',
            description: `Attaque détectée avec blocage de l'IP ${ip}`,
          });
        });
        this.previousBlockedIps = ips;
      })
      .catch((err) => {
        console.error(`Error reading block.conf: ${err}`);
        throw new RpcException(`Error reading file: ${err}`);
      });
  }

  async getBlackListUnary(): Promise<GetIdsDto> {
    const filePath = '/app/honeypot/block.conf';
    try {
      const blockContent = await readFile(filePath, 'utf8');
      const regex = /deny\s+((?:\d{1,3}\.){3}\d{1,3});/g;
      const matches = blockContent.match(regex) || [];

      const ips = matches.map((entry) => {
        const ipRegex = /((?:\d{1,3}\.){3}\d{1,3})/;
        const match = entry.match(ipRegex);
        return match ? match[1] : null;
      }).filter((ip) => ip !== null) as string[];

      return { ips };
    } catch (err) {
      throw new RpcException(`Error reading block.conf: ${err}`);
    }
  }

  getBlackList$(call: ServerUnaryCall<unknown, GetIdsDto>) {
    const subject = new Subject<GetIdsDto>();

    const watcher = watch('/app/honeypot/block.conf', { persistent: true });

    watcher
      .on('add', (path) => this.processFileChange(path, subject))
      .on('change', (path) => this.processFileChange(path, subject))
      .on('error', (error) => console.log(`Watcher error: ${error}`));

    call.on('cancelled', () => watcher.close());

    return subject;
  }

  async putBlackList(setIdDto: SetIpDto) {
    if (!setIdDto.ip) throw new RpcException('IP address is required');

    // Define the command
    const cmd = `fail2ban-client set nginx-honeypot banip ${setIdDto.ip}`;
    const cmd2 = `fail2ban-client set iptables-honeypot banip ${setIdDto.ip}`;

    const execNginx = await this.docker
      .getContainer('fail2ban')
      .exec({ Cmd: cmd.split(' '), AttachStdout: true, AttachStderr: true })
      .catch((err) => {
        throw new RpcException(`Failed to execute nginx-honeypot banip: ${err}`);
      });

    await execNginx.start({}).catch((err) => {
      throw new RpcException(`FFailed to start execution nginx: ${err}`);
    });

    const execIpTables = await this.docker
      .getContainer('fail2ban')
      .exec({ Cmd: cmd2.split(' '), AttachStdout: true, AttachStderr: true })
      .catch((err) => {
        throw new RpcException(`Failed to execute iptables-honeypot banip: ${err}`);
      });

    await execIpTables.start({}).catch((err) => {
      throw new RpcException(`FFailed to start execution iptables: ${err}`);
    });
  }
  
  private async restartContainer(name: string): Promise<void> {
    try {
      const container = this.docker.getContainer(name);
      await container.restart();
      console.log('Fail2Ban container restarted successfully');
    } catch (error) {
      console.error('Error restarting Fail2Ban container:', error);
      throw error;
    }
  }

  async blockCountry(countryCode: string) {
    if (!countryCode) throw new RpcException('countryCode is required');
    const filePath = "/app/honeypot/geohostsdeny.conf";

    try {
      const blockConf = await readFile(filePath, 'utf8');
      
      const lines = blockConf.split('\n');
      const countryListIndex = lines.findIndex(line => line.trim().startsWith('country_list ='));
      if (countryListIndex !== -1) {
        const countryListParts = lines[countryListIndex].split('=');
        const existingCountries = countryListParts[1].trim().split("|").filter(Boolean);
        if (!existingCountries.includes(countryCode)) {
          existingCountries.push(countryCode);
        }
        lines[countryListIndex] = `country_list = ${existingCountries.join("|")}`;
      }

      await writeFile(filePath, lines.join('\n'), 'utf8');
      await this.restartContainer("suricata");

    } catch (err) {
      throw new RpcException(`Error while updating the file: ${err}`);
    }
  }

  async getBlockedCountries(): Promise<GetBlockCountryReply> {
    const filePath = "/app/honeypot/geohostsdeny.conf";
  
    try {
        const blockConf = await readFile(filePath, 'utf8');
        const lines = blockConf.split('\n');
        const countryListIndex = lines.findIndex(line => line.trim().startsWith('country_list ='));
  
        if (countryListIndex !== -1) {
            const countryListParts = lines[countryListIndex].split('=');
            const existingCountries = countryListParts[1].trim().split("|").filter(Boolean);
            return { countries: existingCountries }; // Retourne la liste des pays
        }
  
        // Si la liste des pays n'est pas trouvée, retourne un objet avec une liste vide
        return { countries: [] };
    } catch (err) {
        console.error(`Error while reading the file: ${err}`);
        throw new RpcException(`Error while reading the file: ${err}`);
    }
  }

  async putWhiteList(setIdDto: SetIpDto) {
    if (!setIdDto.ip) throw new RpcException('IP address is required');

    // Define the commands
    const cmdUnbanNginx = `fail2ban-client set nginx-honeypot unbanip ${setIdDto.ip}`;
    const cmdUnbanIptables = `fail2ban-client set iptables-honeypot unbanip ${setIdDto.ip}`;

    const filePath = '/app/honeypot/block.conf';

    const blockConf = await readFile(filePath, 'utf8').catch((err) => {
      throw new RpcException(`Failed to read block.conf file: ${err}`);
    });

    // Remove the line containing the IP address
    const newData = blockConf.replace(new RegExp(`deny ${setIdDto.ip};\n`, 'g'), '');

    // Write the updated content back to the file
    await writeFile(filePath, newData).catch((err) => {
      throw new RpcException(`Failed to write block.conf file: ${err}`);
    });

    const execNginx = await this.docker
      .getContainer('fail2ban')
      .exec({ Cmd: cmdUnbanNginx.split(' '), AttachStdout: true, AttachStderr: true })
      .catch((err) => {
        throw new RpcException(`Failed to execute unbanip nginx-honeypot: ${err}`);
      });

    await execNginx.start({}).catch((err) => {
      throw new RpcException(`Failed to start execution nginx: ${err}`);
    });

    const execIpTables = await this.docker
      .getContainer('fail2ban')
      .exec({ Cmd: cmdUnbanIptables.split(' '), AttachStdout: true, AttachStderr: true })
      .catch((err) => {
        throw new RpcException(`Failed to execute unbanip iptables-honeypot: ${err}`);
      });

    await execIpTables.start({});
  }
}
