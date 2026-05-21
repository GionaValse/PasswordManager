import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { PasswordCreateDto, PasswordResponseDto, PasswordUpdateDto } from './passwords.dto';
import { GetUser } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.types';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Passwords')
@ApiBearerAuth()
@Controller('passwords')
@UseGuards(AuthGuard)
export class PasswordsController {
  constructor(private readonly passwordsService: PasswordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new password' })
  @ApiResponse({ status: 201, type: PasswordResponseDto })
  async createOne(
    @Body() password: PasswordCreateDto,
    @GetUser() user: JwtPayload,
  ): Promise<PasswordResponseDto> {
    return this.passwordsService.createOne(password, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Returns all user passwords' })
  @ApiResponse({ status: 200, type: [PasswordResponseDto] })
  async findAll(@GetUser() user: JwtPayload): Promise<PasswordResponseDto[]> {
    return this.passwordsService.findAll(user.sub);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Returns favorite passwords only' })
  @ApiResponse({ status: 200, type: [PasswordResponseDto] })
  async findFavorites(@GetUser() user: JwtPayload): Promise<PasswordResponseDto[]> {
    return this.passwordsService.findFavorites(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns a single password via ID' })
  @ApiParam({ name: 'id', description: 'UUID della password' })
  @ApiResponse({ status: 200, type: PasswordResponseDto })
  async findOne(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
  ): Promise<PasswordResponseDto> {
    return this.passwordsService.findOne(id, user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update completely a password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated',
    type: PasswordResponseDto,
  })
  async updateOne(
    @Param('id') id: string,
    @Body() password: PasswordUpdateDto,
    @GetUser() user: JwtPayload,
  ): Promise<PasswordResponseDto> {
    return this.passwordsService.updateOne(id, user.sub, true, password);
  }

  @Patch(':id/favorite')
  @ApiOperation({ summary: 'Change the favorite state of a passowrd' })
  @ApiBody({ schema: { properties: { favorite: { type: 'boolean' } } } })
  @ApiResponse({
    status: 200,
    description: 'Favorite status changed',
    type: PasswordResponseDto,
  })
  async updateFavorite(
    @Param('id') id: string,
    @Body('favorite') favorite: boolean,
    @GetUser() user: JwtPayload,
  ): Promise<PasswordResponseDto> {
    return this.passwordsService.updateFavorite(id, user.sub, favorite);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a password' })
  @ApiResponse({
    status: 200,
    description: 'Password successfully deleted',
    type: PasswordResponseDto,
  })
  async deleteOne(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
  ): Promise<PasswordResponseDto> {
    return this.passwordsService.deleteOne(id, user.sub);
  }
}
