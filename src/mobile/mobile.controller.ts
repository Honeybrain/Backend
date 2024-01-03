import { Controller, UseGuards } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { WireguardConfigRequestDto } from './_utils/dto/request/wireguard-config-request.dto';
import { MobileService } from './mobile.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('mobile')
@ApiTags('Mobile')
export class MobileController {
  constructor(private readonly mobileService: MobileService) {}

  @GrpcMethod('Mobile', 'GetWireguardConfig')
  async getWireguardConfig(wireguardConfigRequest: WireguardConfigRequestDto) {
    return await this.mobileService.getWireguardConfig(wireguardConfigRequest);
  }
}
