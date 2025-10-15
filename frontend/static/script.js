document.addEventListener("DOMContentLoaded", async () => {
    const taskBox = document.querySelector(".task__box");
    const showFormBtn = document.getElementById("showFormBtn");
    const API_URL = "http://127.0.0.1:8000/tasks";

    // -------------------------
    // Создаём элемент задачи
    function createTaskItem(task) {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task__box_item");

        taskItem.dataset.id = task.id; // для удаления
        taskItem.innerHTML = `
            <div class="task__id">${task.position}</div>
            <div class="task__name-container" style="flex:1; cursor:pointer;">
                <div class="task__name" title="${task.name}">${task.name}</div>
            </div>
            <input type="checkbox" class="task__done" ${task.completed ? "checked" : ""}>
        `;

        const checkbox = taskItem.querySelector(".task__done");
        const nameContainer = taskItem.querySelector(".task__name-container");

        // Чекбокс и completed
        checkbox.addEventListener("change", () => {
            taskItem.classList.toggle("completed");
        });
        if (checkbox.checked) taskItem.classList.add("completed");

        // Клик по имени открывает модалку просмотра
        nameContainer.addEventListener("click", () => {
            openTaskModal(task);
        });

        return taskItem;
    }

    // -------------------------
    // Модальное окно просмотра задачи с кнопкой Delete
    function openTaskModal(task) {
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add("modal__overlay");

        const modal = document.createElement("div");
        modal.classList.add("modal");

        modal.innerHTML = `
            <button class="modal__close-btn">&times;</button>
            <h1>Task Details</h1>
            <p><strong>Name:</strong> ${task.name}</p>
            <p><strong>Description:</strong> ${task.description || "No description"}</p>
            <button class="modal__delete-btn">Delete Task</button>
        `;

        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        // Закрытие модалки
        modal.querySelector(".modal__close-btn").addEventListener("click", () => {
            document.body.removeChild(modalOverlay);
        });

        // Удаление задачи
        modal.querySelector(".modal__delete-btn").addEventListener("click", async () => {
            try {
                const response = await fetch(`${API_URL}/${task.id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Error deleting task");

                // Удаляем элемент из DOM
                const taskItem = taskBox.querySelector(`.task__box_item[data-id='${task.id}']`);
                if (taskItem) taskBox.removeChild(taskItem);

                // Обновляем индексы оставшихся задач
                const remainingTasks = taskBox.querySelectorAll(".task__box_item");
                remainingTasks.forEach((el, idx) => {
                    el.querySelector(".task__id").textContent = idx + 1;
                });

                document.body.removeChild(modalOverlay);
            } catch (err) {
                console.error(err);
                alert("Failed to delete task.");
            }
        });
    }

    // -------------------------
    // Загрузка существующих задач
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        tasks.forEach(task => {
            const taskItem = createTaskItem(task);
            taskBox.appendChild(taskItem);
        });
    } catch (err) {
        console.error("Error fetching tasks:", err);
    }

    // -------------------------
    // Создание новой задачи через модалку
    showFormBtn.addEventListener("click", () => {
        const modalOverlay = document.createElement("div");
        modalOverlay.classList.add("modal__overlay");

        const modal = document.createElement("div");
        modal.classList.add("modal");

        modal.innerHTML = `
            <button class="modal__close-btn">&times;</button>
            <h1>Create a task:</h1>
            <form id="taskForm">
                <input type="text" name="name" id="taskName" placeholder="Task name" required>
                <input type="text" name="description" id="taskDesc" placeholder="Task description">
                <div class="modal__buttons">
                    <button type="submit">Save task</button>
                    <button type="button" id="cancelModal">Cancel</button>
                </div>
            </form>
        `;

        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        // Закрытие модалки крестиком
        modal.querySelector(".modal__close-btn").addEventListener("click", () => {
            document.body.removeChild(modalOverlay);
        });

        // Закрытие кнопкой Cancel
        modal.querySelector("#cancelModal").addEventListener("click", () => {
            document.body.removeChild(modalOverlay);
        });

        // Сохранение новой задачи
        modal.querySelector("#taskForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const taskData = {
                name: formData.get("name"),
                description: formData.get("description")
            };

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(taskData)
                });

                if (!response.ok) throw new Error("Error creating task");

                const createdTask = await response.json();
                const taskItem = createTaskItem(createdTask);
                taskBox.appendChild(taskItem);

                document.body.removeChild(modalOverlay);
            } catch (err) {
                console.error(err);
                alert("Error creating task");
            }
        });
    });
});
