import { Test, TestingModule } from '@nestjs/testing';
import { DeviceGateway } from './device.gateway';

describe('DeviceGateway', () => {
  let controller: DeviceGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceGateway],
    }).compile();

    controller = module.get<DeviceGateway>(DeviceGateway);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
