# TaskFlow 🚀

A full-stack project management application built with React, Express.js, and Supabase. TaskFlow enables teams to manage workspaces, projects, and tasks with a role-based Kanban board system.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Role-Based Access Control](#role-based-access-control)
- [Database Schema](#database-schema)

---

## ✨ Features

### Admin
- Create and manage Workspaces
- Create and manage Projects inside Workspaces
- Create Tasks and assign them to any user
- Move tasks across Kanban columns (To Do → In Progress → In Review → Done)
- Delete tasks
- Add and delete comments on tasks

### Employee
- View assigned tasks in "My Tasks" page
- Update status of assigned tasks
- Filter tasks by status (All, To Do, In Progress, In Review, Done)
- Add comments on tasks
- View Kanban board (read-only)

### General
- JWT-based authentication via Supabase Auth
- Role-based redirect after login (Admin → Dashboard, Employee → My Tasks)
- Task detail modal with comments
- Real-time task status updates

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build Tool |
| React Router DOM | Client-side Routing |
| Axios | HTTP Client |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Express.js v4 | REST API Server |
| Node.js | Runtime |
| Supabase JS | Database & Auth Client |
| JWT (jsonwebtoken) | Token Verification |
| bcryptjs | Password Hashing |
| nodemon | Development Server |

### Database & Auth
| Technology | Purpose |
|---|---|
| Supabase | PostgreSQL Database + Auth |
| Supabase Auth | User Registration & Login |

### DevOps
| Technology | Purpose |
|---|---|
| GitHub Actions | CI/CD Pipeline |
| Git | Version Control |

---

## 📁 Project Structure

```
Taskflow/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js      # Supabase client config
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── workspaceController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   └── commentController.js
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── workspaces.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   └── comments.js
│   │   └── index.js             # Express app entry point
│   ├── .env                     # Environment variables (not committed)
│   ├── .env.example             # Example environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js         # Axios instance with auth interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   ├── components/
    │   │   └── TaskModal.jsx    # Task detail modal with comments
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx    # Workspace list (Admin only)
    │   │   ├── WorkspacePage.jsx # Project list
    │   │   ├── ProjectPage.jsx  # Kanban board
    │   │   └── MyTasks.jsx      # Assigned tasks (Employee view)
    │   ├── App.jsx              # Routes & role-based redirect
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Supabase account and project

### 1. Clone the repository

```bash
git clone https://github.com/FaishalRudro/Taskflow.git
cd Taskflow
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`
Backend runs at: `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (admin access) |
| `JWT_SECRET` | Secret key for JWT signing |

### Frontend `.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

---

## 📡 API Documentation

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user with name, email, password, role |
| POST | `/login` | No | Login and receive JWT token |
| GET | `/me` | Yes | Get current user info |
| GET | `/users` | Yes | Get all registered users |

### Workspace Routes — `/api/workspaces`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | Yes | Get all workspaces owned by current user |
| POST | `/` | Yes | Create a new workspace |
| PUT | `/:id` | Yes | Update a workspace |
| DELETE | `/:id` | Yes | Delete a workspace |
| GET | `/:id/members` | Yes | Get workspace members |
| POST | `/:id/members` | Yes | Add a member to workspace |

### Project Routes — `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/workspaces/:workspaceId/projects` | Yes | Get all projects in a workspace |
| POST | `/workspaces/:workspaceId/projects` | Yes | Create a new project |
| PUT | `/projects/:id` | Yes | Update a project |
| DELETE | `/projects/:id` | Yes | Delete a project |

### Task Routes — `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/my-tasks` | Yes | Get all tasks assigned to current user |
| GET | `/projects/:projectId/tasks` | Yes | Get all tasks in a project |
| POST | `/projects/:projectId/tasks` | Yes | Create a new task |
| PUT | `/tasks/:id` | Yes | Update a task |
| PATCH | `/tasks/:id/status` | Yes | Update task status only |
| DELETE | `/tasks/:id` | Yes | Delete a task |

### Comment Routes — `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/tasks/:taskId/comments` | Yes | Get all comments on a task |
| POST | `/tasks/:taskId/comments` | Yes | Add a comment to a task |
| DELETE | `/comments/:id` | Yes | Delete a comment |

---

## 👥 Role-Based Access Control

### Admin
- Registers with role: `admin`
- After login → redirected to **Dashboard**
- Can create Workspaces, Projects, Tasks
- Can assign tasks to any user via dropdown
- Can delete tasks and move them across columns
- Can see all tasks in Kanban board

### Employee
- Registers with role: `employee`
- After login → redirected to **My Tasks**
- Cannot create Workspaces, Projects, or Tasks
- Can view Kanban board (read-only)
- Can update status of tasks assigned to them
- Can add/delete their own comments

---

## 🗄 Database Schema

### Tables in Supabase (public schema)

#### `workspaces`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | Workspace name |
| description | TEXT | Optional description |
| owner_id | UUID | References auth.users |
| created_at | TIMESTAMP | Auto-generated |

#### `workspace_members`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| workspace_id | UUID | References workspaces |
| user_id | UUID | References auth.users |
| role | TEXT | admin or member |

#### `projects`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| name | TEXT | Project name |
| description | TEXT | Optional description |
| workspace_id | UUID | References workspaces |
| created_by | UUID | References auth.users |
| created_at | TIMESTAMP | Auto-generated |

#### `tasks`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| title | TEXT | Task title |
| description | TEXT | Optional description |
| status | TEXT | todo, in_progress, in_review, done |
| priority | TEXT | low, medium, high |
| project_id | UUID | References projects |
| assignee_id | UUID | References auth.users |
| created_by | UUID | References auth.users |
| due_date | DATE | Optional due date |
| created_at | TIMESTAMP | Auto-generated |

#### `comments`
| Column | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| content | TEXT | Comment text |
| task_id | UUID | References tasks |
| user_id | UUID | References auth.users |
| created_at | TIMESTAMP | Auto-generated |

---

## 🔄 CI/CD

GitHub Actions pipeline runs on every push to `main` or `develop`:

- ✅ Installs backend dependencies
- ✅ Checks backend starts without errors
- ✅ Installs frontend dependencies
- ✅ Builds frontend for production

---

## 👤 Author

**Faishal Rudro**
GitHub: [@FaishalRudro](https://github.com/FaishalRudro)

---

*Built as a full-stack learning project covering React, Express.js, Supabase, REST API design, and role-based access control.*