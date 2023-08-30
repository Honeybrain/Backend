import { Observable } from 'rxjs';
import { ContainersReplyDto } from '../dto/response/container-reply.dto';

export interface ContainersProtoService {
  StreamContainers(): Observable<ContainersReplyDto>;
}
