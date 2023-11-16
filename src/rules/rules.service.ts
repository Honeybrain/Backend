import { Injectable } from '@nestjs/common';
import { watch } from 'chokidar';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { GetRulesDto } from './_utils/dto/response/get-rules.dto';
import { Subject } from 'rxjs';
import { SetRulesDto } from './_utils/dto/request/set-rules.dto';
import * as Docker from 'dockerode';
import { RpcException } from '@nestjs/microservices';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class RulesService {
  private docker = new Docker();

  async getRules(): Promise<GetRulesDto> {
    try {
      const rules = await readFile('/app/honeypot/suricata.rules', 'utf-8');
      return { rules };
    } catch (error) {
      console.error('Error reading rules file:', error);
      throw error;
    }
  }

  private async restartSuricataContainer(): Promise<void> {
    const containerNameOrId = 'suricata';

    try {
      const container = this.docker.getContainer(containerNameOrId);
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
      await this.restartSuricataContainer();
    } catch (error) {
      console.error('Error writing rules to file:', error);
      throw error;
    }
  }
}
