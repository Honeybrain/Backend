import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { ReConfigDto } from './_utils/dto/request/reconfig-request.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { ReconfigureService } from './reconfig.service'

@Controller('reconfig')
@ApiTags('ReconfigTag')

export class ReconfigureController{
    constructor(private reconfigureService: ReconfigureService){}

    @GrpcMethod('Reconfigure', 'ReconfigHoneypot')
    public async ReconfigHoneypot(ReconfigData: ReConfigDto) {
      return this.reconfigureService.ReconfigHoneypot(ReconfigData);
    }
}