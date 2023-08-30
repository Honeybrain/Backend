import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { DashboardReplyDto } from './_utils/dto/response/dashboard-reply.dto';

@Controller('dashboard')
@ApiTags('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @GrpcMethod('Dashboard', 'StreamDashboardInformation')
  streamDashboardInformation$(_data: unknown, _metadata: Metadata, call: ServerUnaryCall<unknown, DashboardReplyDto>) {
    return this.dashboardService.streamDashboardInformationGrpc$(call);
  }
}
