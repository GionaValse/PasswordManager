# 🌐 Password Manager - Web Frontend

A modern, highly responsive web dashboard designed for managing secure credentials. Built with **React 19**, **Vite**, and **TypeScript**, this application serves as the primary administration interface for creating users, managing secure vaults, and monitoring active account sessions.

---

## 🛠️ Advanced Technical Architecture

- **State Management & Caching:** Powered by **TanStack React Query (v5)** for robust asynchronous data fetching, automatic background re-fetching, cache synchronization, and optimistic UI updates.
- **Real-Time Synchronicity:** Integrated with `socket.io-client` to listen to backend events dynamically, keeping credentials and security states updated in real time across active browser tabs.
- **Granular Vault Management:** Implements an organized user-vault-password relational structure, allowing users to safely isolate and manage credentials inside distinct encrypted containers.
- **Session Auditing & Revocation:** Features an advanced security panel using `ua-parser-js` to inspect active client devices, locations/browsers, and issue remote session termination commands to the backend.
- **UI & Aesthetics:** Styled cleanly with a component workflow supported by `lucide-react` icons and tailored layouts that respond smoothly to varying desktop and mobile browser dimensions via `react-responsive`.

---

## 📋 Environment Configuration

The application expects specific variables to locate the backend infrastructure. You can find a template in `.env.example`.

To setup your local development workspace variables, copy the template:

```bash
cp .env.example .env
```

### Variables Configuration:

`VITE_API_URL`: Points to the main NestJS HTTP REST gateway (Default: `http://localhost:3000`).

`VITE_SOCKET_SERVER`: Target endpoint for real-time WebSockets synchronization event namespace (Default: `http://localhost:3001/events`).

---

## 🚀 Development Scripts

Make sure you are executing these commands from the `frontend/` subdirectory or targeting this workspace alias from the repository root.

### 1. Run Development Server

Launches a local Vite dev environment with Hot Module Replacement (HMR) and automatically triggers your browser:

```bash
npm run dev
```

### 2. Compilation and Build

Type-checks the entire TypeScript scope and generates optimized, minified production assets inside the `dist/` folder:

```bash
npm run build
```

### 3. Local Preview

Spins up a local static server to test the production build artifact locally before deployment:

```bash
npm run preview
```

---

## 🧪 Comprehensive Testing Suite

Quality assurance is verified locally using modern testing utilities that run tests directly within simulated or headless browser instances:

```bash
# Execute standard unit tests via Vitest
npm run test:unit

# Run advanced component and browser integration tests powered by Playwright
npm run test:browser

# Execute all tests concurrently
npm run test

# Run tests and generate a structured code coverage report
npm run test:cov
```

---

_Code styling and syntax formatting are strictly enforced locally through shared workspace configurations for_ `eslint` _and_ `prettier` _to guarantee absolute codebase uniformity._
