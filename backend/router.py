
from fastapi import APIRouter, Depends
from .repository import TaskRepository
from typing import List, Annotated
from .schemas import STaskAdd, STask

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)

@router.post("")
async def add_task(task: STaskAdd):
    task_id = await TaskRepository.add_task(task)
    created_task = await TaskRepository.find_by_id(task_id)
    return created_task

@router.get("")
async def get_tasks() -> List[STask]:
    tasks = await TaskRepository.find_all()
    return tasks

@router.get("/{task_id}")
async def get_task_by_id(task_id: int):
    task = await TaskRepository.find_by_id(task_id)
    if task is None:
        return {"error": "Task not found"}
    return task

@router.delete("/{task_id}")
async def delete_task_by_id(task_id: int):
    success = await TaskRepository.delete_by_id(task_id)
    if not success:
        return {"error": "Task not found"}
    return {"ok": True}