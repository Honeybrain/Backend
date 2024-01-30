import { Controller } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { GetIdsDto } from './_utils/dto/response/get-ids.dto';
import { ApiTags } from '@nestjs/swagger';
import { SetIpDto } from './_utils/dto/request/set-ip.dto';
import { BlockCountryRequestDto } from './_utils/dto/request/block-country-request.dto';
import { GetBlockCountryReply } from './_utils/dto/response/get-block-country-reply.dto';

@Controller('blacklist')
@ApiTags('Blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) {}

  @GrpcMethod('Blacklist', 'GetBlackListUnary')
  getBlackListUnary() {
    return this.blacklistService.getBlackListUnary();
  }

  @GrpcMethod('Blacklist', 'GetBlackList')
  getBlacklist$(_data: unknown, _metadata: unknown, call: ServerUnaryCall<unknown, GetIdsDto>) {
    return this.blacklistService.getBlackList$(call);
  }

  @GrpcMethod('Blacklist', 'PutBlackList')
  PutBlackList(setIdDto: SetIpDto) {
    return this.blacklistService.putBlackList(setIdDto);
  }

  @GrpcMethod('Blacklist', 'BlockCountry')
  BlockCountry(blockCountryRequestDto: BlockCountryRequestDto) {
    return this.blacklistService.blockCountry(blockCountryRequestDto.countryCode);
  }

  @GrpcMethod('Blacklist', 'UnblockCountry')
  UnblockCountry(blockCountryRequestDto: BlockCountryRequestDto) {
    return this.blacklistService.unblockCountry(blockCountryRequestDto.countryCode);
  }

  @GrpcMethod('Blacklist', 'GetBlockCountry')
  getBlockCountry(_data: unknown, _metadata: unknown, call: ServerUnaryCall<unknown, GetBlockCountryReply>) {
    return this.blacklistService.getBlockedCountries();
  }
  

  @GrpcMethod('Blacklist', 'PutWhiteList')
  PutWhiteList(setIdDto: SetIpDto) {
    return this.blacklistService.putWhiteList(setIdDto);
  }
}
