import { Controller } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { ApiTags } from '@nestjs/swagger';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('containers')
@ApiTags('Containers')
export class ContainersController {
  constructor(private readonly containersService: ContainersService) {}

  @GrpcMethod('Containers', 'StreamContainers')
  streamContainers() {
    return this.containersService.streamContainers();
  }
}
