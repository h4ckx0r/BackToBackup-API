import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DevicesService } from 'src/main/database/devices/devices.service';
import { FileDto } from 'src/main/device/dto/file.dto';
import { DeviceInfoDto } from '../dto/deviceInfo.dto';

@WebSocketGateway({ namespace: '/device', cors: { origin: '*' } })
export class DeviceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly deviceService: DevicesService) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
    const { refresh_token, device_id } = client.handshake.auth;

    if (!refresh_token || !device_id) {
      this.throwException(client, new Error('Missing credentials'));
      return;
    }

    this.deviceService.updateSocketIdByDeviceId(device_id as string, refresh_token as string, client.id).catch((error) => {
      this.throwException(client, error as Error);
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected ', client.id);

    this.deviceService.removeSocketIdByDeviceId(client.id).catch((error) => {
      this.throwException(client, error as Error);
    });
  }

  @SubscribeMessage('updateSystemInfo')
  handleUpdateSystemInfo(client: Socket, data: DeviceInfoDto) {
    console.log(data);
  }

  // Funciones para el socket

  throwException(client: Socket, error: Error) {
    client.emit('exception', error.message);
    client.disconnect(true);
  }

  async getListOfFiles(deviceSocketId: string, path: string) {
    const socket = await this.server.in(deviceSocketId).fetchSockets();

    return new Promise<FileDto[]>((resolve) => {
      socket[0].emit('getListOfFiles', path, (response: FileDto[]) => {
        resolve(response);
      });
    });
  }
}
