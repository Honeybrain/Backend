import { Inject, Injectable } from '@nestjs/common';
import { DashboardReplyDto } from './_utils/dto/response/dashboard-reply.dto';
import { Subject } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { LogsProtoService } from '../logs/_utils/interface/logs-proto.interface';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { ContainersProtoService } from '../containers/_utils/interface/containers-proto-service.interface';
import { BlacklistProtoService } from '../blacklist/_utils/interface/blacklist-proto-service.interface';

@Injectable()
export class DashboardService {
  constructor(@Inject('DASHBOARD_PACKAGE') private readonly client: ClientGrpc) {}

  private logsProtoService: LogsProtoService = this.client.getService<LogsProtoService>('Logs');
  private containersProtoService = this.client.getService<ContainersProtoService>('Containers');
  private blacklistProtoService = this.client.getService<BlacklistProtoService>('Blacklist');

  streamDashboardInformationGrpc$(call: ServerUnaryCall<unknown, DashboardReplyDto>) {
    const subject$ = new Subject<DashboardReplyDto>();

    const dashboard: DashboardReplyDto = { ips: [], logs: '', containers: [] };

    const logs$ = this.logsProtoService.StreamLogs().subscribe((logReplyDto) => {
      dashboard.logs = logReplyDto.content;
      subject$.next(dashboard);
    });

    const containers$ = this.containersProtoService.StreamContainers().subscribe((containerReplyDto) => {
      dashboard.containers = containerReplyDto.containers;
      subject$.next(dashboard);
    });

    const blacklist$ = this.blacklistProtoService.GetBlackList().subscribe((blacklistReplyDto) => {
      dashboard.ips = blacklistReplyDto.ips;
      subject$.next(dashboard);
    });

    call.on('cancelled', () => {
      logs$.unsubscribe();
      containers$.unsubscribe();
      blacklist$.unsubscribe();
    });

    return subject$;
  }
}
