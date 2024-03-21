import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ReConfigDto } from './_utils/dto/request/reconfig-request.dto';
import * as Docker from 'dockerode';
import { RpcException } from '@nestjs/microservices';
import { Container, Exec } from 'dockerode';
import { promises as fs } from 'fs';
import * as yaml from 'js-yaml';
import { exec } from 'child_process';

@Injectable()
export class ReconfigureService {

  private docker = new Docker();

  private configPath = '/app/honeypot/generator/config.json';

  public async reconfigHoneypot(Reconfig: ReConfigDto) {
    //check config
    if (!Reconfig.config) throw new RpcException('Config cannot be empty')

    await this.saveConfig(Reconfig.config);

    //recup liste dockers
    const containers = await this.docker.listContainers({ all: true });
    const buildContainers = containers.filter((container) => container.Names[0].startsWith('/honeypot_'));

    await Promise.all(buildContainers.map(async element => {
      const container = await this.docker.getContainer(element.Id);
      await container.stop().catch((e) => console.log(e));
      await container.remove({force: true}).catch((e) => console.log(e));
    }));    

    const generatorContainerInfo = containers.find((container) => container.Names.some(name => name.startsWith('/generator')));
    if (!generatorContainerInfo) {
      throw new Error('Generator container not found');
    }

    const generatorContainer = await this.docker.getContainer(generatorContainerInfo.Id);
    await this.executeInContainer(generatorContainer, ["python3", "/generator.py"]);

    await this.startHoneypotServices("/app/honeypot/generator/docker-compose.yml");

    console.log('Reconfiguration completed successfully.');
  }

  private async saveConfig(config: string): Promise<void> {
    await fs.writeFile(this.configPath, config, 'utf-8');
  }

  private async executeInContainer(container: Container, command: string[]): Promise<void> {
    const exec: Exec = await container.exec({
        Cmd: command,
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
    });

    const stream = await exec.start({ Detach: false, Tty: false });

    container.modem.demuxStream(stream, process.stdout, process.stderr);

    return new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
        stream.resume(); 
    });
  }

  private async startHoneypotServices(composeFilePath: string): Promise<void> {
    try {
        // Lecture du fichier docker-compose.yml
        const fileContents = await fs.readFile(composeFilePath, 'utf8');
        const composeObject = yaml.load(fileContents) as any;
        const services = composeObject.services;

        // Filtrage des services dont le conteneur commence par "honeypot_"
        const honeypotServices = Object.keys(services).filter(serviceName => {
            const containerName = services[serviceName].container_name;
            return containerName && containerName.startsWith('honeypot_');
        });

        if (honeypotServices.length === 0) {
            console.log("No honeypot services found to start.");
            return;
        }

        console.log(honeypotServices);

        // Construction de la commande pour démarrer uniquement les services filtrés
        const command = `docker compose -f ${composeFilePath} up --force-recreate -d ${honeypotServices.join(' ')}`;

        // Exécution de la commande
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });

    } catch (e) {
        console.error(e);
    }
  }
}