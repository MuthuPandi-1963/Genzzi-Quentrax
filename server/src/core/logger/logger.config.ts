import { randomUUID } from "crypto";
import { Params } from "nestjs-pino";
import { ENV } from "../../config/env.Config";

const isProd = ENV.NODE_ENV === "prod";

export const loggerConfig: Params = {
  pinoHttp: {
    level: isProd ? "info" : "debug",

    transport: {
      targets: [
        ...(!isProd
          ? [
              {
                target: "pino-pretty",
                options: {
                  singleLine: true,
                  colorize: true,
                },
              },
            ]
          : []),

        {
          target: "pino-loki",
          options: {
            host: "https://logs-prod-028.grafana.net", // ✅ your Grafana Cloud Loki URL
            basicAuth: {
              username: "1631470", // ✅ your Loki user ID
              password: ENV.LOKI_TOKEN, // ✅ your API token from .env
            },
            labels: {
              app: "genzzi-mail",
              service: "mail-backend",
              env: ENV.NODE_ENV,
            },
            interval: 5,
            batching: true,
          },
        },
      ],
    },

    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "req.body.password",
        "req.body.token",
      ],
      censor: "[REDACTED]",
    },

    genReqId: (req: {
      headers?: Record<string, string | string[] | undefined>;
    }): string => {
      const requestId = req.headers?.["x-request-id"];
      return typeof requestId === "string" ? requestId : randomUUID();
    },

    customProps: (req: { id?: unknown }) => ({
      context: "HTTP",
      requestId: typeof req.id === "string" ? req.id : undefined,
      service: "genzzi-mail",
    }),

    serializers: {
      req(req: { method?: unknown; url?: unknown }) {
        return {
          method: typeof req.method === "string" ? req.method : undefined,
          url: typeof req.url === "string" ? req.url : undefined,
        };
      },
      res(res: { statusCode?: unknown }) {
        return {
          statusCode:
            typeof res.statusCode === "number" ? res.statusCode : undefined,
        };
      },
    },
  },
};
