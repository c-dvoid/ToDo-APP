
# Pet TODO App

A basic ToDo App using FastAPI and vanilla JS.  
Allows you to create, read, mark tasks as completed, and delete them.

## Technologies used

- Python 3.11+
- FastAPI
- SQLAlchemy + SQLite
- HTML, CSS, JS

## Project structure

backend/ # FastAPI server
frontend/ # HTML, CSS, JS
requirements.txt

## Installation

1. Clone the repository:

```bash
git clone https://github.com/c-dvoid/ToDo-APP.git
```
====================================================

2. Create a virtual environment and install the requirements:

```bash
python -m venv venv
# Linux/macOS
source venv/bin/activate
# Windows
venv\Scripts\activate

pip install -r requirements.txt
```
==============================================================

3. Launch the server:

```bash
uvicorn backend.main:app --reload
```
==================================

## Funcionality
- Creating tasks with its own names and descriptions
- Mark tasks as acomplished ones (checkbox)
- Module windows for observing and also deleting tasks
- Automated correction of tasks' indexes