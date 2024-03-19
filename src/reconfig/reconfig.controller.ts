import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ReConfigDto } from './_utils/dto/request/reconfig-request.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { ReconfigureService } from './reconfig.service';

@Controller('reconfigure')
@ApiTags('Reconfigure')
export class ReconfigureController {
  constructor(private reconfigureService: ReconfigureService) {}

  @GrpcMethod('Reconfigure', 'ReconfigHoneypot')
  reconfigHoneypot(ReconfigData: ReConfigDto) {
    return this.reconfigureService.reconfigHoneypot(ReconfigData);
  }
}
