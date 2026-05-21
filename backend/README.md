# 🖥️ Password Manager - Backend API

The central nervous system of the Password Manager ecosystem. Built with **NestJS** and **TypeScript**, this service acts as a secure RESTful and WebSocket API that handles business logic, real-time sync, and data persistence exclusively for the Web Frontend client.

---

## 🛠️ Key Architectural Features

- **Secure Authentication & Auth Factors:** Powered by `Passport` and `JWT` for session management. Includes built-in configuration for short-lived **OTP (One-Time Password)** tokens to enhance authentication workflows.
- **Cryptographic Safety:** Implements industry-standard password hashing using `bcrypt` to safeguard user data before storage.
- **ODM / Database Layer:** Uses **TypeORM** seamlessly configured to interface with a **MongoDB** database, proving that relational design patterns (Repositories, Data Mappers) can be effectively applied to NoSQL structures.
- **Real-time Synchronization:** Integrated with NestJS WebSockets (`socket.io`) to stream instant updates, active session changes, or structural alerts straight to the connected web app.
- **Robust Validation:** Enforces strict payload screening at the network boundary using `class-validator` and `class-transformer` to prevent malformed data insertion.
- **Interactive API Docs:** Fully documented API endpoints accessible locally via a generated **Swagger / OpenAPI** UI.

---

## 📋 Environment Configuration

The application requires specific environment variables to run. A template file is available at `.env.example`.

To get up and running instantly with the root-level Docker database, copy the example file:

```bash
cp .env.example .env
```

### Configuration Breakdown:

**Database Alignment:** Pre-configured to hook directly into the local Docker MongoDB container (`localhost:27017`) using development fallback credentials.

**Security Tokens: CRITICAL**: You must generate and assign a secure, random string to `JWT_SECRET` in your `.env` file before booting production instances.

---

## 🚀 Local Development Scripts

Ensure you are inside the `backend/` directory or executing via root npm workspace wrappers.

### 1. Boot up Infrastructure

Make sure your MongoDB container is running from the workspace root.

### 2. Execution Commands

```bash
# Development mode (Hot-reloading enabled)
npm run start:dev

# Debug mode
npm run start:debug

# Production build compilation
npm run build

# Run production build artifact
npm run start:prod
```

---

## 🧪 Testing Suite & Quality Control

The project features an exhaustive test pipeline using Jest to ensure structural integrity and intercept regressions:

```bash
# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Execute End-to-End (E2E) integration test suites
npm run test:e2e

# Generate comprehensive code coverage reports
npm run test:cov
```

---

_The automated linter (_`eslint`_) and formatting rules (_`prettier`_) are actively mapped to matching config structures across files to guarantee total codebase compliance._
