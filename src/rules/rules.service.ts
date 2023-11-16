import { Injectable } from '@nestjs/common';
import { watch } from 'chokidar';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { GetRulesDto } from './_utils/dto/response/get-rules.dto';
import { Subject } from 'rxjs';
import { SetRulesDto } from './_utils/dto/request/set-rules.dto';
import * as Docker from 'dockerode';
import { RpcException } from '@nestjs/microservices';
import { readFile, writeFile } from 'fs/promises';
import { SetFiltersDto } from './_utils/dto/request/set-filters.dto';

@Injectable()
export class RulesService {
  private docker = new Docker();

  async getRules(): Promise<GetRulesDto> {
    try {
      const rules = await readFile('/app/honeypot/suricata.rules', 'utf-8');
      const filters = await readFile('/app/honeypot/nginx-honeypot.conf', 'utf-8');
      return { rules, filters };
    } catch (error) {
      console.error('Error reading rules file:', error);
      throw error;
    }
  }

  private async restartContainer(name: string): Promise<void> {
    try {
      const container = this.docker.getContainer(name);
      await container.restart();
      console.log('Suricata container restarted successfully');
    } catch (error) {
      console.error('Error restarting Suricata container:', error);
      throw error;
    }
  }

  async PutNewRules(setRulesDto: SetRulesDto): Promise<void> {
    if (!setRulesDto.rules) {
      throw new RpcException('Rules are required');
    }
    try {
      await writeFile('/app/honeypot/suricata.rules', setRulesDto.rules, 'utf-8');
      await this.restartContainer("suricata");
    } catch (error) {
      console.error('Error writing rules to file:', error);
      throw error;
    }
  }

  async PutNewFilters(setFiltersDto: SetFiltersDto): Promise<void> {
    if (!setFiltersDto.filters) {
      throw new RpcException('Filters are required');
    }
    try {
      await writeFile('/app/honeypot/nginx-honeypot.conf', setFiltersDto.filters, 'utf-8');
      await this.restartContainer("fail2ban");
    } catch (error) {
      console.error('Error writing rules to file:', error);
      throw error;
    }
  }
}
