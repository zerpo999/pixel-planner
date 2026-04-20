# Pixel Planner – Study Planner & Task Manager

A student task management system with a responsive pixel‑art web interface.  
Built with **FastAPI** (backend), **React + Vite** (frontend), deployed on **Google Cloud Run** (backend) and **Firebase Hosting** (frontend).

---

## Features

- User registration & JWT authentication  
- Create, edit, delete tasks (title, due date, priority, category, color)  
- Mark tasks complete via web UI  
- Streak tracking (updates when a task is completed)  
- Dashboard shows due today, this week, overdue tasks (completed tasks remain visible with strikethrough)  
- Calendar view and weekly planner  
- Pixel‑art theme with light/dark mode toggle  
- **Future:** CLI tool for quick check‑offs (`task-cli done <id>`)

---

## Tech Stack

| Layer       | Technology                                                                 |
|-------------|----------------------------------------------------------------------------|
| Backend     | FastAPI, SQLAlchemy, SQLite, JWT, bcrypt                                  |
| Frontend    | React, Vite, TypeScript, Tailwind CSS, pixel‑art theme                    |
| Deployment  | Frontend → Firebase Hosting, Backend → Google Cloud Run                   |
| CI / Tests  | GitHub Actions, pytest (backend), Vitest / Playwright (frontend)          |

---

## Prerequisites

- Python 3.12  
- Node.js 18+  
- Git  

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/pixel-planner.git
cd pixel-planner
```
### Backend Setup
```
cd backend
python -m venv venv
py 3.12 -venv venv #if you just recently installed python 3.12 and have a different version installed

# Activate (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Activate (macOS/Linux)
source venv/bin/activate

pip install -r requirements.txt
```
Create a .env file in the backend/ folder
```
SECRET_KEY=your-strong-random-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

Run the server:

```
uvicorn app.main:app --reload
```
The API will be available at http://localhost:8000.
Interactive docs: http://localhost:8000/docs

### Frontend Setup
Open a new terminal (leave the backend running).

```
npm install
npm run dev
```
The frontend will run at http://localhost:5173 and proxy API requests to the backend.

### Testing
Run backend tests:

```
cd backend
pytest tests/ -v
```
Frontend tests (if any) can be run with:

```
npm test
```
## Deployment
### Frontend (Firebase Hosting)
1. Install Firebase CLI (`npm install -g firebase-tools`)
2. Login: (`firebase login`)
3. Initialize: (`firebase init hosting`) (public directory = (`dist`), single-page app = yes)
4. Build: (`npm run build`)
5. Deploy: (`firebase deploy --only hosting`)

Your frontend is live at (`https://pixel-planner-se.web.app`)

### Backend (Google Cloud Run)
1. Enable required APIs (Cloud Run, Cloud Build, Artifact Registry) in the Google Cloud Console.
2. From the backend folder, deploy with environment variables:
```
gcloud run deploy pixel-planner-backend \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --update-env-vars SECRET_KEY=your-actual-key,ALGORITHM=HS256,ACCESS_TOKEN_EXPIRE_MINUTES=10080
```
3. After deployment, copy the Cloud Run URL and update (`API_BASE`) in (`frontend/src/services/api.ts`).
4. Rebuild and redeploy the frontend.

Note: SQLite on Cloud Run is ephemeral – data resets on container restart. For persistent storage, switch to Cloud SQL (PostgreSQL) later.

## Environment Variables
| Variable                     | Default               |
|------------------------------|-----------------------|
| SECRET_KEY                   | (generate securely)   |
| ALGORITHM                    | (HS256)               |
| ACCESS_TOKEN_EXPIRE_MINUTES  | 10080 (7 days)        |

## Project Structure
```
.
├── backend/            # FastAPI app
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── .env
├── frontend/           # React + Vite app at root level
│   ├── src/
│   └── package.json
├── cli/                # Python CLI tool, future implementation
├── .github/            # GitHub Actions workflows
└── README.md
```
