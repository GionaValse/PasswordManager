import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EventsService } from '../events/events.service';
import { AuthGuard } from '../auth/auth.guard';
import { UserCreateDto, UserResponseDto, UserUpdateDto } from './users.dto';
import { EventSessionDto } from '../events/events.dto';

interface MockJwtPayload {
  sub: string;
  [key: string]: any;
}

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let eventsService: jest.Mocked<Partial<EventsService>>;

  const mockUserId = 'user-uuid-123';
  const mockUser: MockJwtPayload = { sub: mockUserId };

  beforeEach(async () => {
    usersService = {
      createOne: jest.fn(),
      findOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    eventsService = {
      getUserSessions: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: EventsService, useValue: eventsService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should call usersService.createOne', async () => {
      const dto: UserCreateDto = {
        username: 'test',
        email: 't@t.com',
        password: '123',
      };
      const expectedResult = {
        id: '1',
        ...dto,
      } as any as UserResponseDto;

      usersService.createOne.mockResolvedValue(expectedResult);

      const result = await controller.createOne(dto);

      expect(usersService.createOne).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('activeSessions', () => {
    it('should call eventsService.getUserSessions with user sub', () => {
      const expectedResult = [{ id: 'session-1' }] as EventSessionDto[];
      eventsService.getUserSessions.mockReturnValue(expectedResult);

      const result = controller.activeSessions(mockUser as any);

      expect(eventsService.getUserSessions).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findMe', () => {
    it('should call usersService.findOne with user sub', async () => {
      const expectedResult = {
        id: mockUserId,
        username: 'test',
      } as UserResponseDto;
      usersService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findMe(mockUser as any);

      expect(usersService.findOne).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('updateMe', () => {
    it('should call usersService.updateOne with user sub and body', async () => {
      const dto: UserUpdateDto = { username: 'new_name' };
      const expectedResult = {
        id: mockUserId,
        ...dto,
      } as UserResponseDto;
      usersService.updateOne.mockResolvedValue(expectedResult);

      const result = await controller.updateMe(mockUser as any, dto);

      expect(usersService.updateOne).toHaveBeenCalledWith(mockUserId, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('deleteMe', () => {
    it('should call usersService.deleteOne with user sub', async () => {
      const expectedResult = { id: mockUserId } as UserResponseDto;
      usersService.deleteOne.mockResolvedValue(expectedResult);

      const result = await controller.deleteMe(mockUser as any);

      expect(usersService.deleteOne).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(expectedResult);
    });
  });
});
