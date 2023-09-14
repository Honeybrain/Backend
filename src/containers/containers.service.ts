import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { Container, ContainersReplyDto } from './_utils/dto/response/container-reply.dto';
import * as Docker from 'dockerode';

@Injectable()
export class ContainersService {
  private docker = new Docker();

  private async handleContainerEvent(subject: Subject<ContainersReplyDto>) {
    const network = await this.docker.getNetwork('honeypot_network').inspect();

    const networkContainers = network.Containers;
    const containerIds = Object.keys(networkContainers);

    const containers = await this.docker.listContainers({ all: true });

    const buildContainers = containers.filter((container) => container.Names[0].startsWith('/honeypot_'));

    const containersData = buildContainers.map((container): Container => {
      const networkContainerKey = containerIds.find((key) => key.startsWith(container.Id));
      const networkContainer = networkContainerKey ? networkContainers[networkContainerKey] : undefined;

      return {
        ip: networkContainer ? networkContainer.IPv4Address.split('/')[0] : 'Not found',
        name: container.Names[0].substring(1),
        status: container.State,
      };
    });

    subject.next({ containers: containersData });
  }

  streamContainers() {
    const subject = new Subject<ContainersReplyDto>();

    const sendContainerEvent = () =>
      this.handleContainerEvent(subject).catch((err) => subject.error(`Handle docker container event error: ${err}`));

    void sendContainerEvent(); // Send initial state of containers

    this.docker
      .getEvents({})
      .then((data) => {
        data.on('data', (chunk) => {
          const event = JSON.parse(chunk.toString());
          if (event.Type === 'container') {
            sendContainerEvent();
          }
        });
        data.on('end', () => subject.unsubscribe());
      })
      .catch((err) => subject.error(`Docker get events error: ${err}`));

    return subject;
  }
}
