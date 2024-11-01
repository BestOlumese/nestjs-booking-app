import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './skipAuth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  async signin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
