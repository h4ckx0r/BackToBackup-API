import { UserDto } from './main/database/models/dto/user.dto';
import { FastifyRequest } from 'fastify';

export type LoginRequestWithUser = {
  user: UserDto;
} & Omit<FastifyRequest, 'user'>;

export type LoggedInTokenPayload = {
  id: string;
  email: string;
};
export type LoggedInRequestWithUser = {
  user: LoggedInTokenPayload;
} & Omit<FastifyRequest, 'user'>;

export type RefreshTokenPayload = {
  id: string;
};
export type RefreshRequestWithUser = {
  user: RefreshTokenPayload;
} & Omit<FastifyRequest, 'user'>;

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
