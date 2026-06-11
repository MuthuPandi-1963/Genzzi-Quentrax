// src/types/express/index.d.ts
//
// Ambient declaration file — no imports allowed at the top level.
// With "module": "nodenext", any file that contains an import statement
// becomes a module, which means `declare global` is scoped to that module
// only and does NOT patch the global Express namespace.
//
// Keeping augmentations in a pure .d.ts file (no imports, no exports)
// ensures TypeScript treats it as a script — the declaration merges
// into the global Express namespace as intended.
//
// Register this file in tsconfig.json under "typeRoots" or "include":
//
//   "include": ["src/**/*", "src/types/**/*.d.ts"]
//
// ─────────────────────────────────────────────────────────────────────────────

// src/types/express.d.ts
import { DeviceInfo } from "src/core/device/device.service"; // Adjust the import path

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      deviceInfo: DeviceInfo; // Replace `DeviceInfo` with the actual return type of buildDeviceInfo()
    }
  }
}

export {}; // This makes the file a module, required for global augmentation
