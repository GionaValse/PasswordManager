process.env.WS_PORT = '3005';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { io, Socket } from 'socket.io-client';
import { AppModule } from './../src/app.module';

describe('Events Gateway (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  let device1: Socket;
  let device2: Socket;

  const testUser = {
    username: `socket_user_${Date.now()}`,
    email: `socket_${Date.now()}@example.com`,
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
    if (device1) device1.disconnect();
    if (device2) device2.disconnect();
    if (app) await app.close();
  });

  const createSocketClient = (token: string): Socket => {
    return io(`http://127.0.0.1:3005/events`, {
      auth: { token },
      autoConnect: false,
      transports: ['websocket'],
    });
  };

  describe('WebSocket Connections and Events', () => {
    it('should reject connection if token is invalid or missing', (done) => {
      const badDevice = createSocketClient('fake_or_empty_token');

      badDevice.connect();

      badDevice.on('error', (message) => {
        expect(message).toBe('unauthorized');
        badDevice.disconnect();
        done();
      });
    });

    it('should connect Device 1 and alert it when Device 2 connects', (done) => {
      device1 = createSocketClient(jwtToken);
      device2 = createSocketClient(jwtToken);

      device1.on('connect', () => {
        device2.connect();
      });

      device1.on('new_session_alert', (data) => {
        expect(data.message).toBe('A new device has signed in to your account.');
        expect(data.time).toBeDefined();
        done();
      });

      device1.connect();
    });

    it('Device 1 should request logout of Device 2 (Targeted Logout)', (done) => {
      device2.on('force_logout', (data) => {
        expect(data.message).toBe('You have logged out from another device.');
      });

      device2.on('disconnect', () => {
        done();
      });

      device1.emit('request_logout', { socketId: device2.id }, (response: any) => {
        expect(response.status).toBe('success');
      });
    });

    it('Device 1 should trigger Global Logout and disconnect everyone', (done) => {
      device2.connect();

      device2.on('connect', () => {
        let disconnectCount = 0;

        const onForceLogout = (data: any) => {
          expect(data.message).toBe('You have logged out from another device.');
        };

        device1.on('force_logout', onForceLogout);
        device2.on('force_logout', onForceLogout);

        const onDisconnect = () => {
          disconnectCount++;
          if (disconnectCount === 2) {
            done();
          }
        };

        device1.on('disconnect', onDisconnect);
        device2.on('disconnect', onDisconnect);

        device1.emit('request_global_logout', null, (response: any) => {
          expect(response.status).toBe('success');
        });
      });
    });
  });
});
