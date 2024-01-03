import { Injectable } from '@nestjs/common';
import { WireguardConfigRequestDto } from './_utils/dto/request/wireguard-config-request.dto';
import { WireguardConfigResponseDto } from './_utils/dto/response/wireguard-config-request.dto';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MobileService {
  async getWireguardConfig(wireguardConfigRequestDto: WireguardConfigRequestDto): Promise<WireguardConfigResponseDto> {
    try {
      const pngBuffer = await readFile('/app/honeypot/peer1.png');
      const base64Image = pngBuffer.toString('base64');
      return { base64Image: base64Image };
    } catch (error) {
      console.error('Error reading wireguard config file:', error);
      throw error;
    }
  }
}
