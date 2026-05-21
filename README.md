# 🔐 Full-Stack Password Manager (Monorepo)

A secure, multi-platform Password Manager ecosystem built as an advanced web development project for the **Web3 course (Progettazione Web Avanzata)** at **SUPSI DTI**.

This project leverages a modern **monorepo architecture** using `npm workspaces` to orchestrate an entire ecosystem across Web, Desktop, and Mobile platforms, all backed by a central API and a shared code library.

---

## 📐 Architecture & Ecosystem Overview

The workspace is split into decoupled sub-projects that communicate seamlessly, maximizing code reuse through a dedicated shared layer:

- **`backend/` (NestJS):** The central RESTful API handling business logic, secure user authentication, and data persistence.
- **`frontend/` (React):** A responsive and secure web dashboard for desktop and mobile browsers.
- **`electron/` (Electron):** A dedicated desktop client wrapping the web core for a native OS experience.
- **`mobile/` (React Native):** A cross-platform mobile application delivering native performance on iOS and Android.
- **`shared/`:** A shared workspace containing common utilities, type definitions, and validation schemas used by both the backend and client applications to enforce data consistency.

---

## 🛠️ Tech Stack

- **Monorepo Tooling:** Node.js Workspaces, Concurrently, Wait-on
- **Backend:** NestJS, TypeScript
- **Database & Infrastructure:** MongoDB, Docker (Docker Compose)
- **Frontend Web & Desktop:** React 19, Electron
- **Mobile:** React Native
- **Testing & Quality:** Playwright (E2E), ESLint, Prettier

---

## 🚀 Getting Started

### Prerequisite

Ensure you have **Node.js** and **Docker / Docker Desktop** installed and running on your machine.

### 1. Installation

To install all dependencies across the entire workspace (including End-to-End testing browsers), run the global setup script from the root folder:

```bash
npm run install:all
```

### 2. Infrastructure Setup

Spin up the MongoDB database instance via Docker Compose:

```bash
npm run docker:up
```

(To shut it down later, you can use `npm run docker:down`)

### 3. Running the Applications

#### Launch Web Stack (Backend + Frontend) Combined

You can run the core web stack with a single command. It automatically starts Docker, boots the backend, waits for the health check to pass, and then launches the React frontend:

```bash
npm run start:web
```

#### Run Individual Components

Alternatively, you can start components individually in development mode using dedicated workspace aliases:

```bash
# Start Backend only
npm run start:backend

# Start Web Frontend only
npm run start:frontend

# Start Desktop Application (Electron)
npm run start:electron

# Start Mobile Application Metro Bundler
npm run start:mobile

# Launch Mobile on iOS / Android Emulators
npm run android
# or
npm run ios
```

---

## 🧪 Quality & Maintenance

The monorepo includes automated scripts to keep the entire codebase clean and tested:

- **Run Tests everywhere**: `npm run test:all`
- **Linting**: `npm run lint:all`
- **Code Formatting**: `npm run format:all`
- **Deep Clean**: If you need to purge caches and fresh-rebuild the entire environment, use the internal reset routine: `npm run rebuild`

---

## 🎓 Credits & Context

This repository is an academic project developed by Giona Valsecchi for the Advanced Web Design course at SUPSI DTI (Scuola universitaria professionale della Svizzera italiana, Dipartimento tecnologie innovative).

_Note: The initial guidelines, project constraints, and base structural template were provided by the course professors. The full functional implementation, architecture stitching, and cross-platform clients were developed as part of the course curriculum._
