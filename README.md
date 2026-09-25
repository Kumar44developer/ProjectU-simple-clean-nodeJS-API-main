# ProjectU — Simple Clean Node.js API

> A minimal, production-minded REST API built with Express and organized around a clean, layered architecture: **routes → controllers → services → data access → in-memory store**.

<p>
  <img alt="node" src="https://img.shields.io/badge/Node.js-14%2B-339933?style=flat-square&logo=node.js&logoColor=white"/>
  <img alt="express" src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white"/>
  <img alt="type" src="https://img.shields.io/badge/type-module-blue?style=flat-square"/>
  <img alt="license" src="https://img.shields.io/badge/license-MIT-green?style=flat-square"/>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Request Validation](#request-validation)
- [Project Structure](#project-structure)
- [Docker](#docker)
- [Extending the API](#extending-the-api)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

ProjectU is a compact HTTP API that demonstrates how to keep a Node.js backend clean and testable without giving up the conveniences a real service needs. Each user resource flows through explicitly separated layers, so business rules, transport concerns, and persistence never bleed into one another.

Data is held in an in-memory array, which makes the project instantly runnable with zero external services while still exercising the full request lifecycle: validation, status mapping, structured logging, and CRUD.

---

## Architecture

The request path is strictly one-directional, which is the core idea behind the clean architecture used here.

```
Client
  |
  v
Routes (user.routes.js)        -> attach validation + map URL to handler
  |
  v
Controllers (user.controller.js) -> translate HTTP <-> domain, set status codes
  |
  v
Services (user.service.js)     -> own the business operations
  |
  v
DAO (user.dao.js)              -> encapsulate data access
  |
  v
Store (users.data.js)          -> in-memory collection
```

Each layer depends only on the one below it. Swapping the in-memory store for a database touches only the DAO layer, leaving routes, controllers, and services unchanged.

---

## Features

- **Clean layered design** with clear separation of routes, controllers, services, and data access.
- **Full CRUD** for a user resource over idiomatic REST endpoints.
- **Schema validation** on params and bodies powered by Yup through `express-yup-middleware`.
- **Security middleware**: `helmet` for safe HTTP headers and `cors` for cross-origin control.
- **Rate limiting** on the versioned API surface via `express-rate-limit`.
- **Response compression** with `compression`.
- **Structured logging** using `pino`.
- **Consistent status codes** sourced from `http-status-codes`.
- **Centralized error handling** with graceful 404 and 500 fallbacks.
- **Native ES modules** and a containerized setup through Docker.

---

## Tech Stack

| Concern | Choice |
| --- | --- |
| Runtime | Node.js (ES modules) |
| HTTP framework | Express 4 |
| Validation | Yup + express-yup-middleware |
| Security | helmet, cors |
| Resilience | express-rate-limit, compression |
| Logging | pino |
| Status codes | http-status-codes |
| Container | Docker (Node Alpine image) |

---

## Prerequisites

- **Node.js 14 or newer** (the project uses native ES modules).
- **npm** (bundled with Node.js).
- **Docker** (optional, only for the containerized run).

---

## Getting Started

Install the dependencies from the project root.

```bash
npm install
```

Start the server.

```bash
npm start
```

The API listens on port `4000` by default and prints a startup confirmation.

```bash
Server running on port 4000
```

Confirm it is alive with the health endpoint.

```bash
curl http://localhost:4000/v1/ping
```

Expected response:

```
OK
```

---

## Configuration

The server reads two optional environment variables.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | TCP port the HTTP server binds to |
| `FRONTEND_URL` | `*` | Allowed CORS origin |

Set them for the current shell before starting.

```bash
PORT=5000 FRONTEND_URL=https://example.com npm start
```

---

## API Reference

All user routes are mounted under `/v1/user`. The versioned root exposes a health check.

| Method | Path | Description | Success |
| --- | --- | --- | --- |
| GET | `/` | Service banner | 200 |
| GET | `/v1/ping` | Health check | 200 |
| GET | `/v1/user/all` | List every user | 200 or 404 when empty |
| GET | `/v1/user/:id` | Fetch one user by numeric id | 200 or 404 |
| POST | `/v1/user` | Create a user | 201 |
| PUT | `/v1/user/:id` | Update an existing user | 200 or 404 |
| DELETE | `/v1/user/:id` | Remove a user | 200 or 404 |

### Create a user

```bash
curl -X POST http://localhost:4000/v1/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Joe Doe","email":"joedoe@email.com","city":"New York","country":"USA"}'
```

```json
{
  "status": true,
  "user": {
    "id": 1,
    "name": "Joe Doe",
    "email": "joedoe@email.com",
    "city": "New York",
    "country": "USA"
  }
}
```

### Fetch a user

```bash
curl http://localhost:4000/v1/user/1
```

```json
{
  "id": 1,
  "name": "Joe Doe",
  "email": "joedoe@email.com",
  "city": "New York",
  "country": "USA"
}
```

### Update a user

```bash
curl -X PUT http://localhost:4000/v1/user/1 \
  -H "Content-Type: application/json" \
  -d '{"city":"Boston"}'
```

### Delete a user

```bash
curl -X DELETE http://localhost:4000/v1/user/1
```

```json
{
  "status": true,
  "message": "User 1 has been deleted."
}
```

---

## Request Validation

Every write and id-bearing route runs through a Yup schema before the controller executes.

| Field | Rule |
| --- | --- |
| `id` (param) | required number |
| `name` | 2 to 20 characters |
| `email` | valid email, up to 100 characters |
| `city` | 1 to 30 characters |
| `country` | 2 to 30 characters |

A payload that violates a rule is rejected with `400 Bad Request` and never reaches the service layer.

```bash
curl -X POST http://localhost:4000/v1/user \
  -H "Content-Type: application/json" \
  -d '{"name":"J","email":"not-an-email"}'
```

---

## Project Structure

```
.
|-- src
|   |-- controllers
|   |   `-- user.controller.js
|   |-- models
|   |   |-- data
|   |   |   `-- users.data.js
|   |   `-- persistence
|   |       `-- user.dao.js
|   |-- services
|   |   |-- __tests__
|   |   |   `-- user.service.test.js
|   |   `-- user.service.js
|   |-- main.routes.js
|   |-- server.js
|   |-- user.routes.js
|   `-- user.schemas.js
|-- .gitignore
|-- Dockerfile
|-- babel.config.json
|-- package.json
`-- README.md
```

---

## Docker

Build the image from the project root.

```bash
docker build -t projectu-api .
```

Run a container that maps port `4000`.

```bash
docker run -p 4000:4000 projectu-api
```

The image is based on the Node Alpine distribution, installs dependencies, and launches the server with `npm start`.

---

## Extending the API

The layered layout makes new resources straightforward to add.

1. Define the store and a DAO under `src/models`.
2. Wrap the DAO in a service under `src/services`.
3. Expose HTTP behavior in a controller under `src/controllers`.
4. Declare Yup schemas and a router, then mount the router in `src/server.js`.

Each step mirrors the existing user module, so patterns carry over directly.

---

## Troubleshooting

| Symptom | Likely cause | Resolution |
| --- | --- | --- |
| `ERR_MODULE_NOT_FOUND` on startup | A relative import is missing its `.js` extension | Native ES modules require explicit `.js` on every relative import |
| Server does not start on `4000` | Port already in use | Launch with a different `PORT` value |
| `429` responses | Rate limiter exceeded 100 requests per minute | Wait for the window to reset or adjust the limiter |
| `404` from `/v1/user/all` | The in-memory store is empty | Create at least one user first |
| Browser CORS errors | `FRONTEND_URL` does not match the caller origin | Set `FRONTEND_URL` to the requesting origin |

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
