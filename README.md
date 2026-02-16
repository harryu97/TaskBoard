# ThinkBoard

A collaborative note-taking and task management app built with the MERN stack, featuring real-time cursor tracking via WebSockets.

## Features

- **Board Management** - Create, delete, and organize boards as project workspaces
- **Collaborative Notes** - Add, edit, and delete notes within boards
- **Board Sharing** - Invite collaborators by email with access control
- **Real-Time Cursors** - See where other users are working via live cursor tracking (WebSocket)
- **Rate Limiting** - Redis-backed request throttling to prevent abuse
- **JWT Authentication** - Secure cookie-based auth with HTTP-only tokens

## Tech Stack

### Backend
- **Express.js** - Web framework
- **MongoDB / Mongoose** - Database
- **JWT + bcrypt** - Authentication and password hashing
- **ws** - WebSocket server for real-time features
- **Helmet / CORS** - Security middleware
- **Upstash Redis** - Rate limiting

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS + daisyUI** - Styling (Dracula theme)
- **Axios** - HTTP client
- **Lucide React** - Icons
- **react-hot-toast** - Toast notifications

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Upstash Redis account (for rate limiting)

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### Installation

```bash
# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

### Development

```bash
# Start backend (with nodemon)
npm run dev --prefix backend

# Start frontend (Vite dev server)
npm run dev --prefix frontend
```

The frontend dev server proxies `/api` requests to `http://localhost:5001`.

### Production Build

```bash
# Build frontend and install all dependencies
npm run build

# Start the server (serves frontend static files)
npm start
```

## API Routes

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Login and receive JWT cookie |
| GET | `/check` | Verify current session |

### Boards (`/api/boards`) — Auth required
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new board |
| GET | `/` | Get all authorized boards |
| DELETE | `/:boardId` | Delete a board (creator only) |
| POST | `/share` | Share board with a user by email |

### Notes (`/api/notes`) — Auth required
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a note |
| GET | `/:boardId` | Get all notes in a board |
| PUT | `/:id` | Update a note |
| DELETE | `/:id` | Delete a note |

## Project Structure

```
├── backend/
│   └── src/
│       ├── config/        # DB and Redis configuration
│       ├── controllers/   # Route handlers
│       ├── middleware/     # Auth and rate limiting
│       ├── models/        # Mongoose schemas (User, Board, Note)
│       ├── routes/        # API route definitions
│       └── server.js      # Express + WebSocket server
├── frontend/
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── lib/           # Axios config and utilities
│       ├── App.jsx        # Router setup
│       └── main.jsx       # Entry point
└── package.json           # Root build/start scripts
```

## Deployment

Deployed on [Render](https://render.com) as a single web service. The backend serves the built frontend as static files in production.

**Build command:** `npm run build`
**Start command:** `npm start`
