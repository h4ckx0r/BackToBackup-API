import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    const mockUsersService: any = {};
    const mockJwtService: any = {};
    const mockRolesService: any = {};

    service = new AuthService(
      mockUsersService,
      mockJwtService,
      mockRolesService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
