import { GetIdsDto } from '../dto/response/get-ids.dto';
import { SetIpDto } from '../dto/request/set-ip.dto';
import { Observable } from 'rxjs';

export interface BlacklistProtoService {
  PutBlackList(data: SetIpDto): void;
  GetBlackList(): Observable<GetIdsDto>;
  PutWhiteList(data: SetIpDto): void;
}
