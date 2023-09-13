import { Observable } from 'rxjs';
import { LogReplyDto } from '../dto/response/log-reply.dto';

export interface LogsProtoService {
  StreamLogs(): Observable<LogReplyDto>;
}
