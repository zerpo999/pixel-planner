# pytest cache directory #

This directory contains data from the pytest's cache plugin,
which provides the `--lf` and `--ff` options, as well as the `cache` fixture.

**Do not** commit this to version control.

See [the docs](https://docs.pytest.org/en/stable/how-to/cache.html) for more information.

How to run Backend (Sprint 1: Bella)

1.) Create Virtual Enviornment 
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows

2.) Install Dependencies
pip install -r requirements.txt

3.) Start FastAPI Server 
uvicorn backend.app.api.main:app --reload

4.) Swagger docs for Confirmation 
http://127.0.0.1:8000/docs

**Tips**
Before running any tests make sure you're in the project root (A.K.A "Pixel Planner") 
cd pixel-planner 
pytest -q 

