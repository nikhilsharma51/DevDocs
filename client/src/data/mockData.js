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

export const myDocs = [
  {
    id: 1,
    title: "Backend deployment guide",
    updatedAt: "2h ago",
    author: "Rohan S.",
    tags: ["Deployment"],
    isRecent: true,
  },
  {
    id: 2,
    title: "Auth service overview",
    updatedAt: "Yesterday",
    author: "Rohan S.",
    tags: ["Architecture", "API"],
    isRecent: false,
  },
  {
    id: 3,
    title: "Payment API endpoints",
    updatedAt: "3d ago",
    author: "Rohan S.",
    tags: ["API"],
    isRecent: false,
  },
  {
    id: 4,
    title: "Staging env setup",
    updatedAt: "5d ago",
    author: "Rohan S.",
    tags: ["Troubleshooting"],
    isRecent: false,
  },
  {
    id: 5,
    title: "Database schema v2",
    updatedAt: "1w ago",
    author: "Rohan S.",
    tags: ["Architecture"],
    isRecent: false,
  },
  {
    id: 6,
    title: "Redis caching strategy",
    updatedAt: "1w ago",
    author: "Rohan S.",
    tags: ["Architecture", "Setup"],
    isRecent: false,
  },
  {
    id: 7,
    title: "CI/CD pipeline setup",
    updatedAt: "2w ago",
    author: "Rohan S.",
    tags: ["Deployment", "Setup"],
    isRecent: false,
  },
  {
    id: 8,
    title: "Error handling guide",
    updatedAt: "2w ago",
    author: "Rohan S.",
    tags: ["Troubleshooting"],
    isRecent: false,
  },
];

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
