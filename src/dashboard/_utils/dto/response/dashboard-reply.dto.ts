export class ContainerDto {
  name: string;
  status: string;
  ip: string;
}

export class DashboardReplyDto {
  ips: string[];
  containers: ContainerDto[];
  logs: string;
}
