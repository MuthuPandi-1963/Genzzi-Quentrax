import { Logger } from "@nestjs/common";
import { EnvConfig, exportDefaults } from "../common/interfaces/env.type";

type envKeys = keyof EnvConfig;

export const ENV = new Proxy(exportDefaults, {
  get(target, prop: string) {
    if (!(prop in target)) {
      Logger.warn(`ENV key "${prop}" is not defined in defaults`);
      return undefined;
    }

    const key = prop as envKeys;
    const defaultValue = target[key];
    const rawEnvValue = process.env[key];
    const isFromEnv = rawEnvValue !== undefined;

    // Decide final value
    const valueStr = isFromEnv ? rawEnvValue : defaultValue;

    // 🔍 SOURCE LOG (THIS IS WHAT YOU WANT)
    const source = isFromEnv ? ".env file" : "exportDefaults (fallback)";

    // Number handling
    if (typeof defaultValue === "number") {
      const numValue = Number(valueStr);
      if (isNaN(numValue)) {
        Logger.warn(
          `ENV.${prop} is not a valid number in ${source}, using default: ${defaultValue}`,
        );
        return defaultValue;
      }

      Logger.debug(`ENV.${prop}  (loaded from ${source})`);
      return numValue;
    }

    // Boolean handling (VERY IMPORTANT for MAIL_SECURE)
    if (typeof defaultValue === "boolean") {
      const boolValue = valueStr === "true" || valueStr === true;

      Logger.debug(`ENV.${prop}  (loaded from ${source})`);
      return boolValue;
    }

    // String handling
    Logger.debug(`ENV.${prop} (loaded from ${source})`);
    return valueStr;
  },
});
