import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return status ok and alive message', () => {
      const result = appController.health();
      expect(result.status).toBe('ok');
      expect(result.message).toBe("I'm alive");
      expect(result.timestamp).toBeDefined();
    });
  });
});
