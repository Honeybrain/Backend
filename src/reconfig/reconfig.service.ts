import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ReConfigDto } from './_utils/dto/request/reconfig-request.dto';
import * as Docker from 'dockerode';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class ReconfigureService {

  private docker = new Docker();


public async ReconfigHoneypot(Reconfig: ReConfigDto) {
    //check config
    if (!Reconfig.config) throw new RpcException('Config cannot be empty')
    //recup liste dockers
    const network = await this.docker.getNetwork('honeypot_network').inspect();

    const networkContainers = network.Containers;
    const containerIds = Object.keys(networkContainers);

    const containers = await this.docker.listContainers({ all: true });

    const buildContainers = containers.filter((container) => container.Names[0].startsWith('/honeypot_'));

    buildContainers.forEach(element => {
      this.docker.getContainer('fb607059a048').stop();
    });
  //creer docker depuis config
  }
}