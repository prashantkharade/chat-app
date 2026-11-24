# Chat Service

1:1 chat backend built with Node.js, TypeScript and Express.

- **PostgreSQL** (TypeORM) – users, chats, chat members
- **Firebase Firestore** – messages, read receipts, last seen

## Flow

```
index.ts -> app.ts -> startup/route.handler.ts -> api/<module>/routes -> controller -> validator
                                                                            |
                                                                         service -> mapper -> DTO
```

## Structure

```
.vscode/launch.json            run / debug configs
scripts/create-db.js           creates the PostgreSQL database
Dockerfile
docker-compose.yml             service + PostgreSQL
src/
  index.ts                     entry point
  app.ts                       connects databases, sets up middlewares and routes, starts server
  startup/route.handler.ts     registers all routes
  api/
    base.validator.ts
    user/                      user.routes, user.controller, user.validator
    chat/                      chat.routes, chat.controller, chat.validator
  database/
    database.connector.ts      PostgreSQL connection (TypeORM DataSource)
    typeorm/
      models/                  User, Chat, ChatMember
      mappers/
      services/                UserService, ChatService
    firestore/
      firestore.connector.ts   Firebase app + Firestore
      models/
      mappers/
      services/                MessageService
  domain.types/                request models and response DTOs
  common/
    error.handling/
    handlers/response.handler.ts
  middlewares/
  logger/
```

## Data

PostgreSQL tables are created from the entities on startup.

| Table          | Columns                                   |
|----------------|-------------------------------------------|
| `users`        | `id`, `Name`, `CreatedAt`, `UpdatedAt`    |
| `chats`        | `id`, `PairKey` (unique), `CreatedAt`     |
| `chat_members` | `ChatId`, `UserId`                        |

`PairKey` is `smallerUserId_largerUserId` (e.g. `1_2`), so there can only be one chat between two users.

Firestore:

```
chats/{chatId}/messages/{messageId}   { senderId, text, createdAt, readBy: { userId: time } }
chats/{chatId}/lastSeen/{userId}      { messageId, seenAt }
```

`chatId` in Firestore is the same as `chats.id` in PostgreSQL.

## Requirements

- Node.js 20+
- PostgreSQL (local install) or Docker
- Firebase project with Firestore enabled (test mode rules)

## How to run

Copy `.env.example` to `.env` and fill in the values first.

### Local

```bash
npm install
npm run db:create     # creates DB_NAME if it does not exist
npm run dev           # watch mode
```

or a production build:

```bash
npm run build
npm start
```

### VS Code

Open the Run and Debug panel:

- **Launch Service** – builds and runs with breakpoints in the `.ts` files
- **Launch Service (watch)** – runs `npm run dev`
- **Attach** – attach to a process started with `node --inspect`

### Docker

Runs the service and its own PostgreSQL (exposed on port 5433, so it does not clash with a local one).

```bash
npm run docker:up      # docker compose up --build -d
npm run docker:logs
npm run docker:down
```

Health check: `GET http://localhost:3000/health-check`

## APIs

| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/user` | `{ "name": "Alice" }` |
| GET  | `/user/:userId` | |
| GET  | `/user/search?name=&orderBy=&order=&pageIndex=&itemsPerPage=` | |
| GET  | `/user/:userId/chats` | |
| POST | `/chat/create` | `{ "userAId": 1, "userBId": 2 }` |
| POST | `/chat/:chatId/message/send` | `{ "senderId": 1, "text": "Hello" }` |
| GET  | `/chat/:chatId/messages?limit=50` | |
| POST | `/chat/:chatId/message/:messageId/read` | `{ "userId": 2 }` |
| POST | `/chat/:chatId/lastseen` | `{ "userId": 2, "messageId": "<id>" }` |

Response:

```json
{ "Status": "success", "Message": "Chat created successfully!", "HttpCode": 201, "Data": { } }
{ "Status": "failure", "Message": "Input validation failed!", "HttpCode": 400, "Errors": [ ] }
```
