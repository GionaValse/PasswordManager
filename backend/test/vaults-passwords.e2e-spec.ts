import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Vaults & Passwords Flow (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let targetVaultId: string;
  let targetPasswordId: string;

  const testUser = {
    username: `flow_user_${Date.now()}`,
    email: `flow_${Date.now()}@example.com`,
    password: 'StrongPassword123!',
  };

  jest.setTimeout(30000);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    jwtToken = res.body.accessToken;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('1. Vaults (/vaults)', () => {
    it('POST /vaults - should create a new vault', () => {
      return request(app.getHttpServer())
        .post('/vaults')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'My Personal Vault',
          description: 'E2E Test Vault',
          color: '#FF0055',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe('My Personal Vault');
          expect(res.body.color).toBe('#FF0055');

          targetVaultId = res.body.id;
        });
    });

    it('GET /vaults - should list user vaults', () => {
      return request(app.getHttpServer())
        .get('/vaults')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].id).toBe(targetVaultId);
        });
    });
  });

  describe('2. Passwords (/passwords)', () => {
    it('POST /passwords - should fail if vault does not exist', () => {
      return request(app.getHttpServer())
        .post('/passwords')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          vaultId: '000000000000000000000000',
          name: 'Netflix',
          username: 'user@netflix.com',
          password: 'password123',
          favorite: false,
        })
        .expect(404);
    });

    it('POST /passwords - should create a password in the target vault', () => {
      return request(app.getHttpServer())
        .post('/passwords')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          vaultId: targetVaultId,
          name: 'GitHub',
          website: 'https://github.com',
          username: 'dev_hero',
          password: 'SuperSecretGitHubPassword!',
          favorite: true,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe('GitHub');
          expect(res.body.vaultId).toBe(targetVaultId);

          targetPasswordId = res.body.id;
        });
    });

    it('GET /passwords/favorites - should return favorite passwords', () => {
      return request(app.getHttpServer())
        .get('/passwords/favorites')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0].name).toBe('GitHub');
          expect(res.body[0].favorite).toBe(true);
        });
    });

    it('GET /vaults/:vaultId/passwords - should return passwords for a specific vault', () => {
      return request(app.getHttpServer())
        .get(`/vaults/${targetVaultId}/passwords`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(1);
          expect(res.body[0].id).toBe(targetPasswordId);
        });
    });

    it('PATCH /passwords/:id/favorite - should update favorite status', () => {
      return request(app.getHttpServer())
        .patch(`/passwords/${targetPasswordId}/favorite`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ favorite: false })
        .expect(200)
        .expect((res) => {
          expect(res.body.favorite).toBe(false);
        });
    });
  });

  describe('3. Cleanup (Deletions)', () => {
    it('DELETE /passwords/:id - should delete the password', () => {
      return request(app.getHttpServer())
        .delete(`/passwords/${targetPasswordId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('DELETE /vaults/:id - should delete the vault', () => {
      return request(app.getHttpServer())
        .delete(`/vaults/${targetVaultId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
});
