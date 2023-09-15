import { Injectable } from '@nestjs/common';
import { DashboardReplyDto } from './_utils/dto/response/dashboard-reply.dto';
import { Subject } from 'rxjs';
import { ServerUnaryCall } from '@grpc/grpc-js';
import { ContainersService } from '../containers/containers.service';
import { LogsService } from '../logs/logs.service';
import { BlacklistService } from '../blacklist/blacklist.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly containersService: ContainersService,
    private readonly logsService: LogsService,
    private readonly blacklistService: BlacklistService,
  ) {}

  streamDashboardInformationGrpc$(call: ServerUnaryCall<unknown, DashboardReplyDto>) {
    const subject$ = new Subject<DashboardReplyDto>();

    const dashboard: DashboardReplyDto = { ips: [], logs: '', containers: [] };

    const logs$ = this.logsService.streamLogs$(call).subscribe((logReplyDto) => {
      dashboard.logs = logReplyDto.content;
      subject$.next(dashboard);
    });

    const containers$ = this.containersService.streamContainers().subscribe((containerReplyDto) => {
      dashboard.containers = containerReplyDto.containers;
      subject$.next(dashboard);
    });

    const blacklist$ = this.blacklistService.getBlackList$(call).subscribe((blacklistReplyDto) => {
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
