# 📦 Password Manager - Shared Workspace Module

The structural backbone of the multi-platform frontend ecosystem. This package serves as a central, decoupled library that hosts shared business logic, state management, design systems, and automated API bindings used concurrently by the **Web**, **Desktop (Electron)**, and **Mobile (React Native)** applications.

---

## 📐 Architecture & Shared Domain Layer

By leveraging modern Node.js conditional `"exports"`, this module exposes strictly encapsulated entry points to enforce clean boundaries and eliminate deep relative import paths (`../../../../`):

- **`shared/api`:** Contains the core networking layer. It features an **automatically generated API SDK** built directly from the NestJS Swagger / OpenAPI specification, supplying fully-typed fetch routines and type-safe data schemas.
- **`shared/context` & `shared/hooks`:** Houses shared global state providers, authentication workflows, session context logic, and custom React hooks utilized across platforms to maintain behavior uniformity.
- **`shared/models`:** Defines core interface blueprints, TypeScript types, encryption/decryption models, and strict verification data models.
- **`shared/ui` & `shared/theme`:** Stores shared React presentation components (powered by `lucide-react` icons and a central CSS design theme configuration) guaranteeing visual identity consistency across Web, Mobile, and Desktop viewpoints.
- **`shared/utils`:** General helper utilities, including QR Code generators (`qrcode`) for security provisioning/2FA, and cross-platform hooks using `react-responsive`.

---

## 🤖 Automated API Generation Pipeline

To ensure absolute type synchronization between the server and clients without manual maintenance, the workspace implements an automated OpenAPI code-generation pipeline.

When endpoints, validation DTOS, or responses mutate on the NestJS backend, you can regenerate the entire frontend communication client with a single command:

```bash
# Pulls the live Swagger JSON specs from the running backend and builds a type-safe Fetch SDK
npm run api:generate

# Wipes the generated API workspace to force a clean slate rebuild
npm run api:clean
```

---

## 🚀 Development & Maintenance Scripts

Ensure you execute these routines inside the `shared/` directory context or via global npm workspace filters.

### 1. Code Purge

Safely clears compiled build outputs and local code coverage evaluation artifacts:

```bash
npm run clean
```

### 2. Static Code Analysis

Audits the shared scope using `eslint` to preserve syntactic code rules and enforce strict TypeScript type compliance:

```bash
npm run lint
```

---

## 🧪 Shared Component & Unit Testing

Because this layer fuels three application targets, keeping it robust is crucial. The workspace utilizes Vitest configured with browser simulation capabilities to validate visual hooks, state flows, and utility algorithms instantly:

```bash
# Execute unit and state-flow integration tests
npm run test

# Run tests and evaluate an automated test coverage report across components
npm run test:cov
```

---

_Peer dependency guardrails are anchored specifically around **React 19** primitives to provide full structural safety to consuming workspaces._
