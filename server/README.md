# GenZzi Server 🚀

Production-Grade Scalable Backend (NestJS + Prisma + Redis + Observability)

## 📌 Overview

GenZzi Server is a **production-grade backend architecture** built with NestJS, designed for scalability, security, observability, and high performance.
It includes enterprise-level features such as global rate limiting, structured logging, metrics monitoring, sanitization, validation, and graceful shutdown handling.

This project follows a **clean architecture with modular separation** and is suitable for real-world large-scale systems.

---

## 🏗️ Tech Stack

### Core Framework

* **NestJS v11** – Scalable Node.js framework
* **TypeScript** – Strong typing & maintainability
* **Express (v5)** – HTTP platform

### Database & Caching

* **PostgreSQL** (via Prisma ORM)
* **Redis (ioredis)** – Caching & Rate Limiting Storage

### Observability & Monitoring

* **Pino + NestJS-Pino** – Structured logging
* **Prometheus (prom-client)** – Metrics collection
* **Loki** – Log aggregation
* **Health Checks (Terminus)** – Service health monitoring

### Security & Middleware

* Helmet (Security headers)
* Compression (Response optimization)
* Cookie Parser (Signed cookies)
* CORS Configuration (Custom policy)
* Input Sanitization (XSS protection)
* Global Validation Pipe (DTO security)
* Global Exception Handling

### Rate Limiting

* @nestjs/throttler
* Redis-backed distributed throttling

---

## 📂 Project Structure

```
src/
│
├── config/             # Environment, CORS, Cookie configs
├── core/               # Core business modules (Device, Logger)
├── common/             # Shared utilities (guards, pipes, middleware, exceptions)
├── database/           # Prisma & Redis services
├── health/             # Health check endpoints
├── metrics/            # Prometheus metrics module
├── monitoring/         # Prometheus + Loki configs
└── main.ts             # Application bootstrap (production setup)
```

---

## ⚙️ Production Features Implemented

### 🔐 Security Layer

* Helmet with HSTS enabled
* Request size limiting (1MB)
* Input sanitization pipe
* DTO validation (whitelist + forbid unknown fields)
* Signed cookies support
* Trust proxy configuration (real IP handling)

### 🚦 Global Rate Limiting

* Redis-based throttler storage
* Custom global throttler guard
* Distributed protection against DDoS & abuse

### 📊 Observability

* Structured logging using Pino
* Metrics endpoint (`/metrics`) for Prometheus scraping
* Loki integration for centralized logs
* Health endpoint for uptime monitoring

### 🧹 Clean Error Handling

* Global exception filter
* Standardized API response structure
* Async handler abstraction
* Custom error messages & codes

### 🧠 Performance Optimizations

* Compression middleware
* Buffered logging
* Raw body support (for webhooks)
* Graceful shutdown hooks
* Redis caching layer ready

---

## 🔧 Environment Configuration

Create a `.env` file in the root:

```
PORT=4000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/genzzi

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password

# JWT / Cookies
JWT_SECRET=your_secret
```

---

## 🐳 Docker (Monitoring Stack)

Monitoring configs are available inside:

```
src/monitoring/
├── docker-compose.yml
├── prometheus.yml
└── loki-config.yml
```

This enables:

* Prometheus metrics scraping
* Loki log aggregation
* Full observability pipeline

---

## 📦 Installation

```bash
pnpm install
```

---

## 🚀 Running the Application

### Development

```bash
pnpm start:dev
```

### Production Build

```bash
pnpm build
pnpm start:prod
```

---

## 🧪 Testing

```bash
# Unit Tests
pnpm test

# Watch Mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E Tests
pnpm test:e2e
```

---

## 🌐 API Configuration

### Global Prefix

All routes are prefixed with:

```
/api/v1
```

Exception:

```
GET /metrics  (excluded for Prometheus scraping)
```

---

## 🛡️ Middleware & Global Pipes

| Layer           | Purpose                         |
| --------------- | ------------------------------- |
| Helmet          | Security headers                |
| Compression     | Response optimization           |
| SanitizePipe    | XSS & input cleaning            |
| ValidationPipe  | DTO validation & transformation |
| GlobalException | Centralized error handling      |
| Cookie Parser   | Signed cookie support           |

---

## 📈 Metrics & Health Endpoints

| Endpoint   | Description          |
| ---------- | -------------------- |
| `/metrics` | Prometheus metrics   |
| `/health`  | Service health check |

---

## 🧱 Database Layer

* Prisma ORM with PostgreSQL
* Centralized PrismaService
* Production-ready connection management

Run migrations:

```bash
npx prisma migrate dev
```

Generate client:

```bash
npx prisma generate
```

---

## 🔥 Logging System

* Pino-based high performance logger
* HTTP request logging via nestjs-pino
* Loki transport support
* Structured JSON logs for production observability

---

## 🚀 Scalability Readiness

This backend is designed for:

* Microservices migration
* Horizontal scaling
* Distributed rate limiting
* Cloud-native deployments (Docker/Kubernetes ready)

---

## 🧑‍💻 Scripts

| Script       | Description             |
| ------------ | ----------------------- |
| `start:dev`  | Run in watch mode       |
| `build`      | Build production bundle |
| `start:prod` | Run compiled build      |
| `lint`       | ESLint auto fix         |
| `format`     | Prettier formatting     |

---

## 📜 License

UNLICENSED (Private Project)

---

## 💡 Author Notes

This project follows enterprise backend standards including security hardening, observability, clean architecture, and production-grade middleware integration.
Suitable as a base template for large-scale SaaS, AI platforms, or high-traffic APIs.
