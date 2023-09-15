import { DashboardReplyDto } from '../dto/response/dashboard-reply.dto';
import { Observable } from 'rxjs';

export interface DashboardProtoService {
  StreamDashboardInformation(): Observable<DashboardReplyDto>;
}
