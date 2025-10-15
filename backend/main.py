
from fastapi import FastAPI

from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager
from .database import create_tables, delete_tables
from .router import router as tasks_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await delete_tables()
    print("Base is cleared..")
    await create_tables()
    print("Base is ready..")
    yield
    print("Shutting down..")


app = FastAPI(lifespan=lifespan)
app.include_router(tasks_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_static_path = Path(__file__).resolve().parent.parent / "frontend" / "static"
app.mount("/", StaticFiles(directory=frontend_static_path, html=True), name="static")