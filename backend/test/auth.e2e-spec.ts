import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth & Users Flow (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  const testUser = {
    username: `e2e_user_${Date.now()}`,
    email: `e2e_${Date.now()}@example.com`,
    password: 'StrongPassword123!',
  };

  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('1. Authentication (/auth)', () => {
    it('/auth/register (POST) - should register a user and return JWT', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
          jwtToken = res.body.accessToken;
        });
    });

    it('/auth/register (POST) - should fail with duplicate user (Conflict)', () => {
      return request(app.getHttpServer()).post('/auth/register').send(testUser).expect(409);
    });

    it('/auth/login (POST) - should login and return a valid JWT', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(testUser)
        .expect(200)
        .expect((res) => {
          expect(res.body.accessToken).toBeDefined();
        });
    });
  });

  describe('2. Protected Routes (/users)', () => {
    it('/users/me (GET) - should fail without token (Unauthorized)', () => {
      return request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('/users/me (GET) - should return current user profile with valid token', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.username).toBe(testUser.username);
          expect(res.body.email).toBe(testUser.email);
          expect(res.body.id).toBeDefined();
        });
    });
  });
});
