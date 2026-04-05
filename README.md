# Study Planner & Task Manager

A student task management system with a responsive web interface and a command-line tool.  
Built with **FastAPI** (backend), **React + Vite** (frontend), and a Python CLI for quick task check‑offs.

---

## Features

- User registration & JWT authentication  
- Create, edit, delete tasks (title, due date, priority)  
- Mark tasks complete via web UI **or** CLI  
- Streak tracking for daily study habits  
- In‑app notifications for upcoming deadlines & streak warnings  
- Responsive design – works on desktop and mobile browsers  

---

## Tech Stack

| Layer       | Technology                         |
|-------------|-------------------------------------|
| Backend     | FastAPI, SQLAlchemy, SQLite, JWT    |
| Frontend    | React, Vite, Material‑UI / Tailwind |
| CLI         | Python, Click, Requests             |
| DevOps      | Git, GitHub Actions (CI)            |

---

## Prerequisites

- Python 3.12
- Node.js 18+  
- Git  

---

## Getting Started

### Clone the repository

```
git clone https://github.com/your-username/your-repo.git
cd your-repo
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

Run the server:

```
uvicorn app.main:app --reload
```
The API will be available at http://localhost:8000.
Interactive docs: http://localhost:8000/docs

### Frontend Setup
Open a new terminal (leave the backend running).

```
cd frontend
npm install
npm run dev
```
The frontend will run at http://localhost:5173 and proxy API requests to the backend.

### CLI Tool (Optional)
```
cd cli
pip install -e .
```
Now you can use the CLI commands (while the backend is running):

```
task-cli list          # list all tasks
task-cli done 1        # mark task with id 1 as complete
```
### Testing
Run backend tests:

```
cd backend
pytest
```
Frontend tests (if any) can be run with:

```
cd frontend
npm test
```
### Project Structure
```
.
├── backend/            # FastAPI app
│   ├── app/
│   ├── tests/
│   ├── requirements.txt
│   └── .env
├── frontend/           # React + Vite app
│   ├── src/
│   └── package.json
├── cli/                # Python CLI tool
│   └── task_cli/
├── .github/            # GitHub Actions workflows
└── README.md
```
