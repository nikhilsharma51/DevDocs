

export const currentUser = {
  name: "Rohan S.",
  initials: "RS",
  role: "Admin",
};

export const stats = [
  { label: "Total docs", value: 38 },
  { label: "Team members", value: 6 },
  { label: "AI queries today", value: 14 },
];

export const categories = [
  "All",
  "Architecture",
  "API",
  "Deployment",
  "Troubleshooting",
  "Setup",
];

// add/replace myDocs in src/data/mockData.js

export const myDocs = [
  {
    id: 1,
    title: "Backend deployment guide",
    updatedAt: "2h ago",
    author: "Rohan S.",
    tags: ["Deployment"],
    isRecent: true,
    content: `## Prerequisites
Make sure you have Node.js 18+ and npm installed before starting.

## Steps
- Clone the repository from GitHub
- Copy \`.env.example\` to \`.env\` and fill in your values
- Run \`npm install\` to install dependencies

## Start the server
\`\`\`
npm run dev
\`\`\`
The server starts on port 5000 by default.

## Environment variables
| Variable | Description |
|---|---|
| PORT | Server port (default 5000) |
| MONGO_URI | Your MongoDB connection string |
| JWT_SECRET | Secret key for auth tokens |
`
  },
  {
    id: 2,
    title: "Auth service overview",
    updatedAt: "Yesterday",
    author: "Rohan S.",
    tags: ["Architecture", "API"],
    isRecent: false,
    content: `## Overview
The auth service handles all authentication using JWT tokens stored in HTTP-only cookies.

## Flow
1. User submits login form
2. Backend validates credentials against the database
3. JWT token is signed and returned
4. All protected routes check the token on every request

## Key files
- \`/services/auth.js\` — core logic
- \`/middleware/requireAuth.js\` — route protection
- \`/routes/auth.js\` — login and register endpoints

## Token expiry
Tokens expire after **24 hours**. Refresh logic is not yet implemented.
`
  },
  {
    id: 3,
    title: "Payment API endpoints",
    updatedAt: "3d ago",
    author: "Rohan S.",
    tags: ["API"],
    isRecent: false,
    content: `## Base URL
All payment endpoints are prefixed with \`/api/payments\`.

## Endpoints

### POST /api/payments/create
Creates a new payment intent.

\`\`\`json
{
  "amount": 2000,
  "currency": "usd",
  "userId": "abc123"
}
\`\`\`

### GET /api/payments/:id
Returns payment details by ID.

### POST /api/payments/webhook
Stripe webhook handler. Do not call this manually.

## Notes
- All amounts are in the smallest currency unit (paise for INR, cents for USD)
- Requires \`x-api-key\` header on all requests
`
  },
  {
    id: 4,
    title: "Staging env setup",
    updatedAt: "5d ago",
    author: "Rohan S.",
    tags: ["Troubleshooting"],
    isRecent: false,
    content: `## Accessing staging
The staging environment runs at \`https://staging.devdocs.app\`.

## Running locally
\`\`\`
NODE_ENV=staging npm run dev
\`\`\`

## Common issues

### Port already in use
\`\`\`
lsof -i :5000
kill -9 <PID>
\`\`\`

### Database connection fails
Check that your \`.env\` has the correct \`MONGO_URI\` for staging. The staging DB is separate from production.

### Hot reload not working
Delete \`node_modules/.cache\` and restart the dev server.
`
  },
  {
    id: 5,
    title: "Database schema v2",
    updatedAt: "1w ago",
    author: "Rohan S.",
    tags: ["Architecture"],
    isRecent: false,
    content: `## Overview
Version 2 of the schema introduces soft deletes and better indexing.

## Collections

### users
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| email | String | Unique, indexed |
| role | String | admin / developer / viewer |
| createdAt | Date | Auto-set |

### documents
| Field | Type | Notes |
|---|---|---|
| _id | ObjectId | Primary key |
| title | String | Indexed for search |
| content | String | Markdown text |
| authorId | ObjectId | Ref: users |
| tags | Array | String array |
| deletedAt | Date | Null if not deleted |
`
  },
  {
    id: 6,
    title: "Redis caching strategy",
    updatedAt: "1w ago",
    author: "Rohan S.",
    tags: ["Architecture", "Setup"],
    isRecent: false,
    content: `## Why Redis
We use Redis to cache frequent database reads and reduce query load.

## What we cache
- User session data (TTL: 1 hour)
- Document metadata (TTL: 5 minutes)
- Search results (TTL: 2 minutes)

## Setup
\`\`\`
npm install redis
\`\`\`

Add to your \`.env\`:
\`\`\`
REDIS_URL=redis://localhost:6379
\`\`\`

## Cache invalidation
Documents are invalidated from cache whenever they are updated or deleted.
`
  },
  {
    id: 7,
    title: "CI/CD pipeline setup",
    updatedAt: "2w ago",
    author: "Rohan S.",
    tags: ["Deployment", "Setup"],
    isRecent: false,
    content: `## Overview
We use GitHub Actions for CI and Railway for deployment.

## Pipeline stages
1. **Lint** — ESLint runs on every push
2. **Test** — Jest runs the test suite
3. **Build** — Vite builds the frontend
4. **Deploy** — Railway auto-deploys on merge to main

## GitHub Actions file
The config lives at \`.github/workflows/deploy.yml\`.

## Environment secrets
Add these to your GitHub repo secrets:
- \`RAILWAY_TOKEN\`
- \`SUPABASE_URL\`
- \`SUPABASE_ANON_KEY\`
`
  },
  {
    id: 8,
    title: "Error handling guide",
    updatedAt: "2w ago",
    author: "Rohan S.",
    tags: ["Troubleshooting"],
    isRecent: false,
    content: `## Principles
All errors should be caught, logged, and returned in a consistent format.

## Standard error response
\`\`\`json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Document not found"
  }
}
\`\`\`

## Error codes
| Code | HTTP Status | Meaning |
|---|---|---|
| NOT_FOUND | 404 | Resource does not exist |
| UNAUTHORIZED | 401 | Not logged in |
| FORBIDDEN | 403 | Logged in but no permission |
| VALIDATION_ERROR | 400 | Bad input data |

## Global error handler
All unhandled errors are caught by \`/middleware/errorHandler.js\` which logs them and sends the standard response.
`
  },
]
export const allDocs = [...myDocs]

export const aiMessages = [
  { id: 1, from: "user", text: "How do I run the backend locally?" },
  {
    id: 2,
    from: "ai",
    text: "Run npm install, copy .env.example to .env, then run npm run dev. Found in: Staging env setup.",
  },
  { id: 3, from: "user", text: "Where is auth implemented?" },
  {
    id: 4,
    from: "ai",
    text: "Auth is in /services/auth using JWT. See: Auth service overview.",
  },
];

export const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "A → Z",        value: "alpha"  },
]

export const tagColors = {
  Deployment: { bg: "bg-teal-50", text: "text-teal-800" },
  Architecture: { bg: "bg-purple-50", text: "text-purple-800" },
  API: { bg: "bg-blue-50", text: "text-blue-800" },
  Troubleshooting: { bg: "bg-amber-50", text: "text-amber-800" },
  Setup: { bg: "bg-green-50", text: "text-green-800" },
};
