# 💻 Password Manager - Desktop Application

A cross-platform desktop client built using **Electron**, **Electron-Vite**, **React**, and **TypeScript**. This standalone client focuses on offline autonomy and bulk data management, enabling users to import credentials via local files and secure them inside an encrypted local vault.

---

## 🛠️ Desktop Architecture & Security Features

- **Zero-Knowledge Encrypted Vault:** Implements a strict local storage vault where credentials are fully encrypted at rest. The data can only be decrypted on-the-fly using the user's master password, ensuring total cryptographic privacy.
- **Bulk JSON Data Import:** Features a dedicated file-parsing utility that allows users to instantly import records and mass-populate their password vaults by uploading a structured local `.json` file.
- **Modern Process Separation:** Architected using `electron-vite` to maintain a rigid security boundary between the **Main Process** (Node.js backend execution) and the **Renderer Process** (React UI viewport) via safe `@electron-toolkit/preload` scripts.
- **Shared Framework Core:** Consumes the monorepo's shared ecosystem layer (`shared-password-manager`) to handle unified visual themes, shared state hooks (`@tanstack/react-query`), and shared cryptographic models.

---

## 🚀 Local Development & Execution

Ensure you are inside the `electron/` directory or triggering this workspace alias from the main repository root.

### 1. Launch Development Environment

Compiles the TypeScript source files and opens the desktop application window with live Hot Module Replacement (HMR):

```bash
npm run dev
```

### 2. Native Compilation Blueprint

Compiles, optimizes, and bundles the application source code into cross-platform production distributions:

```bash
# Compilation and static code typecheck
npm run build

# Generate platform-specific production artifacts
npm run build:win    # Compiles Windows (.exe) executables
npm run build:mac    # Compiles macOS (.dmg) app bundles
npm run build:linux  # Compiles Linux binaries
```

---

## 🧪 Comprehensive Browser Testing

UI interaction, layout behaviors, and state mutations are strictly verified inside simulated browser runtime layers using **Vitest** and **Playwright**:

```bash
# Execute local unit and UI interaction tests
npm run test

# Run tests and evaluate an automated test coverage report
npm run test:cov

# Manually execute TypeScript static type-checking across processes
npm run typecheck
```

---

_Code architecture syntax is strictly checked against_ `@electron-toolkit/eslint-config-ts` _and formatted via_ `prettier` _to guarantee absolute code health._
