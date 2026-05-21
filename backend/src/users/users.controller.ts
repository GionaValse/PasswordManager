import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateDto, UserResponseDto, UserUpdateDto } from './users.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/auth.decorator';
import { JwtPayload } from 'src/auth/auth.types';
import { AuthGuard } from 'src/auth/auth.guard';
import { EventsService } from 'src/events/events.service';
import { EventSessionDto } from 'src/events/events.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 409, description: 'User alredy exist' })
  async createOne(@Body() user: UserCreateDto): Promise<UserResponseDto> {
    return this.usersService.createOne(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('session')
  @ApiOperation({ summary: "Returns the current user's sessions" })
  @ApiResponse({ status: 200, type: [EventSessionDto] })
  activeSessions(@GetUser() user: JwtPayload): EventSessionDto[] {
    return this.eventsService.getUserSessions(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: "Returns the current user's profile" })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findMe(@GetUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.usersService.findOne(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('me')
  @ApiOperation({ summary: "Update the current user's profile" })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async updateMe(
    @GetUser() user: JwtPayload,
    @Body() userDto: UserUpdateDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateOne(user.sub, userDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('me')
  @ApiOperation({ summary: "Delete the current user's profile" })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async deleteMe(@GetUser() user: JwtPayload): Promise<UserResponseDto> {
    return this.usersService.deleteOne(user.sub);
  }
}
