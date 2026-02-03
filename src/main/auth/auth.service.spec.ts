import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    const mockUsersService: any = {};
    const mockJwtService: any = {};
    const mockRolesService: any = {};
    const configService: any = {};

    service = new AuthService(mockUsersService, mockJwtService, mockRolesService, configService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
