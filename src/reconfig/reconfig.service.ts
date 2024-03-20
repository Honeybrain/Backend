import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ReConfigDto } from './_utils/dto/request/reconfig-request.dto';
import * as Docker from 'dockerode';
import { RpcException } from '@nestjs/microservices';

interface dummies {
  num_services: number;
  ip_addresses: Array<string>;
} 

interface ftps {
  ip_address: string;
  port: string;
}

interface NewConfig {
  dummy_pc: dummies;
  ftp: ftps;
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

@Injectable()
export class ReconfigureService {

  private docker = new Docker();

/*private validate_config(configJson: NewConfig) {

  if (configJson.dummy_pc.num_services = 0)
    return
}*/

public async reconfigHoneypot(Reconfig: ReConfigDto) {
  //check config
  if (!Reconfig.config) throw new RpcException('Config cannot be empty')

  //recup liste dockers
  const containers = await this.docker.listContainers({ all: true });
  const buildContainers = containers.filter((container) => container.Names[0].startsWith('/honeypot_'));

  buildContainers.forEach(element => {
    this.docker.getContainer(element.Id).stop().catch((e) => console.log(e));
  });
  
  //creer docker depuis config
  let configJson: NewConfig = JSON.parse(Reconfig.config);

  //this.validate_config(configJson);
  await delay(1000)
  var newDocker = new Docker()
  //newDocker.createContainer({Image: 'ubuntu', Cmd: ['/bin/bash'], name: 'honeypot_dummy_pc_123'}, function(err, container){container?.start({})})
  for (let i=0; i < configJson.dummy_pc.num_services; i++) {
    newDocker.run('ubuntu', ['bash', '-c', 'sleep infinity'], process.stdout, {Hostname: configJson.dummy_pc.ip_addresses[i], name:'honeypot_dummy_pc_'+i},function() {
      console.log("running new dummy pc on " + configJson.dummy_pc.ip_addresses[i]);
    });
  }
  if (configJson.ftp.ip_address != "") {
    newDocker.run('ubuntu', ['bash', '-c', 'sleep infinity'], process.stdout, {Hostname: configJson.ftp.ip_address, name:'honeypot_dummy_ftp_1 '},function() {
      console.log("running new dummy ftp on " + configJson.ftp.ip_address + " on port " + configJson.ftp.port);
    })
  }
  
  const generator = containers.filter((container)=> container.Names[0].startsWith('/generator'))
  console.log(generator)
  this.docker.getContainer(generator[0].Id).exec({Cmd: ['python3', 'generator.py'], AttachStdin: true, AttachStdout: true})

  }
}