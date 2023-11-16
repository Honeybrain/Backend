import { Controller } from '@nestjs/common';
import { RulesService } from './rules.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { GetRulesDto } from './_utils/dto/response/get-rules.dto';
import { ApiTags } from '@nestjs/swagger';
import { SetRulesDto } from './_utils/dto/request/set-rules.dto';

@Controller('rules')
@ApiTags('Rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @GrpcMethod('Rules', 'GetDetectionRules')
  async GetDetectionRules(getRulesDto: GetRulesDto): Promise<GetRulesDto> {
    try {
      return await this.rulesService.getRules();
    } catch (error) {
      console.error('Error in GetDetectionRules:', error);
      throw error;
    }
  }

  @GrpcMethod('Rules', 'PutNewDetectionRules')
  async PutNewDetectionRules(setRulesDto: SetRulesDto): Promise<void> {
    try {
      await this.rulesService.PutNewRules(setRulesDto);
    } catch (error) {
      // Handle any errors that might occur
      console.error('Error in PutNewDetectionRules:', error);
      throw error;
    }
  }
}
