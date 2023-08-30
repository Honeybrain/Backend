export class Container {
  name: string;
  status: string;
  ip: string;
}

export class ContainersReplyDto {
  containers: Container[];
}
