import { ApiProperty } from '@nestjs/swagger';
import { PageDto } from '../../database/models/dto/page.dto';
import { UserWithRolesDto } from './userWithRoles.dto';

export class UserPageResponseDto extends PageDto<UserWithRolesDto> {
  @ApiProperty({
    type: UserWithRolesDto,
    isArray: true,
  })
  data: UserWithRolesDto[];

  @ApiProperty({
    type: Number,
  })
  pageNumber: number;

  @ApiProperty({
    type: Number,
  })
  pageSize: number;

  @ApiProperty({
    type: Number,
  })
  totalElements: number;

  @ApiProperty({
    type: Number,
  })
  totalPages: number;

  constructor(data: UserWithRolesDto[], pageNumber: number, pageSize: number, totalElements: number, totalPages: number) {
    super(data, pageNumber, pageSize, totalElements, totalPages);
    this.data = data;
    this.pageNumber = pageNumber;
    this.pageSize = pageSize;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
  }
}
