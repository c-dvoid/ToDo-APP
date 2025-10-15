from .database import new_session, TasksOrm
from sqlalchemy import select, func, update
from .schemas import STaskAdd, STask
from typing import Optional, List

class TaskRepository:
    # -------------------------
    # Создание задачи с корректной позицией
    @classmethod
    async def add_task(cls, data: STaskAdd) -> int:
        async with new_session() as session:
            # Определяем max(position)
            max_pos_query = await session.execute(select(func.max(TasksOrm.position)))
            max_pos = max_pos_query.scalar() or 0

            task_dict = data.model_dump()
            task = TasksOrm(**task_dict, position=max_pos + 1)

            session.add(task)
            await session.commit()
            await session.refresh(task)
            return task.id

    # -------------------------
    # Получение всех задач (сортировка по позиции)
    @classmethod
    async def find_all(cls) -> List[STask]:
        async with new_session() as session:
            query = select(TasksOrm).order_by(TasksOrm.position)
            result = await session.execute(query)
            task_models = result.scalars().all()

        return [
            STask(
                id=task.id,
                name=task.name,
                description=task.description,
                position=task.position
            )
            for task in task_models
        ]

    # -------------------------
    # Получение задачи по ID
    @classmethod
    async def find_by_id(cls, task_id: int) -> Optional[STask]:
        async with new_session() as session:
            task_model = await session.get(TasksOrm, task_id)
            if not task_model:
                return None
            return STask(
                id=task_model.id,
                name=task_model.name,
                description=task_model.description,
                position=task_model.position
            )

    # -------------------------
    # Удаление задачи и пересчёт позиций
    @classmethod
    async def delete_by_id(cls, task_id: int) -> bool:
        async with new_session() as session:
            task_model = await session.get(TasksOrm, task_id)
            if not task_model:
                return False

            deleted_position = task_model.position
            await session.delete(task_model)

            # Смещаем позиции остальных задач
            await session.execute(
                update(TasksOrm)
                .where(TasksOrm.position > deleted_position)
                .values(position=TasksOrm.position - 1)
            )
            await session.commit()
            return True
