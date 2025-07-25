//                         Студенческая часть
document.addEventListener("DOMContentLoaded", function () {
  const homeworkLink = document.getElementById("homework-link");
  const gradesLink = document.getElementById("grades-link");
  const mainContent = document.getElementById("main-content");
  const token = localStorage.getItem("accessToken");
  const scheduleLink = document.getElementById("schedule-link");

  if (!token) {
    console.error("Токен не найден в localStorage");
    return;
  }

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/tasks/students", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении заданий:", error);
    }
  }

  async function renderHomeworkPage() {
    const tasks = await fetchTasks();
    console.log("Tasks:", tasks);

    if (!tasks || tasks.length === 0) {
      console.error("Задания не найдены");
      return;
    }

    const currentTasks = tasks.filter(
      (task) =>
        new Date(task.dead_line) >= new Date() &&
        task.isCurrentUserDidItWork == false
    );
    const expiredTasks = tasks.filter(
      (task) => new Date(task.dead_line) < new Date()
    );
    const doneTasks = tasks.filter(
      (task) => task.isCurrentUserDidItWork == true
    );

    mainContent.innerHTML = `
            <h1>Домашнее задание</h1>
            <div class="homework-header">
                <h1>Текущие домашние задания</h1>
            </div>
            <div class="homework-section">
                <h2>Текущие домашние задания</h2>
                ${currentTasks
                  .map(
                    (task) => `
                    <div class="homework-item">
                        <div class="homework-details">
                            <h3>${
                              task.subject ? task.subject.name : "Без предмета"
                            }</h3>
                            <p class="homework-task"><em>${task.name}</em></p>
                            <p class="homework-description">${task.desc}</p>
                            <input type="file" id="file-${
                              task.id
                            }" class="file-input" />
                            <button class="view-works-button" data-task-id="${
                              task.id
                            }">Загрузить решение</button>
                            <p class="homework-dates">
                                <span>Дата создания: ${new Date(
                                  task.createdAt
                                ).toLocaleDateString()}</span><br>
                                <span>Дата конца: ${new Date(
                                  task.dead_line
                                ).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>
            <div class="homework-section">
                  <h2>Выполненные домашние задания</h2>
                  ${doneTasks.map(
                    (task) => `
                        <div class="homework-item">
                        <div class="homework-details">
                            <h3>${
                              task.subject ? task.subject.name : "Без предмета"
                            }</h3>
                            <p class="homework-task"><em>${task.name}</em></p>
                            <p class="homework-description">${task.desc}</p>
                            <p class="homework-dates">
                                <span>Дата создания: ${new Date(
                                  task.createdAt
                                ).toLocaleDateString()}</span><br>
                                <span>Дата конца: ${new Date(
                                  task.dead_line
                                ).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                        `
                  )}
            </div>
            <div class="homework-section">
                <h2>Истёкшие домашние задания</h2>
                ${expiredTasks
                  .map(
                    (task) => `
                    <div class="homework-item">
                        <div class="homework-details">
                            <h3>${
                              task.subject ? task.subject.name : "Без предмета"
                            }</h3>
                            <p class="homework-task"><em>${task.name}</em></p>
                            <p class="homework-description">${task.desc}</p>
                            <p class="homework-dates">
                                <span>Дата создания: ${new Date(
                                  task.createdAt
                                ).toLocaleDateString()}</span><br>
                                <span>Дата конца: ${new Date(
                                  task.dead_line
                                ).toLocaleDateString()}</span>
                            </p>
                        </div>
                    </div>
                `
                  )
                  .join("")}
            </div>


        `;

    // Добавляем обработчик событий для всех кнопок "Загрузить решение"
    document.querySelectorAll(".view-works-button").forEach((button) => {
      button.addEventListener("click", async function () {
        const taskId = this.getAttribute("data-task-id");
        await downloadSolution(taskId);
      });
    });
  }

  async function fetchSolution(taskId) {
    const token = localStorage.getItem("accessToken"); // Получение токена из localStorage
    const fileInput = document.getElementById(`file-${taskId}`);
    const file = fileInput.files[0];

    if (!file) {
      alert("Пожалуйста, выберите файл для загрузки.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task_id", taskId);

    try {
      const response = await fetch(
        `http://localhost:3000/api/solution/create`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      } else {
        alert("Файл успешно загружен");
        renderHomeworkPage();
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при попытке загрузить работу:", error);
    }
  }

  async function downloadSolution(taskId) {
    const tasks = await fetchSolution(taskId);
    // Обработка данных решения
  }

  homeworkLink.addEventListener("click", async function (event) {
    event.preventDefault();
    await renderHomeworkPage();
  });

  gradesLink.addEventListener("click", async function (event) {
    event.preventDefault();

    const markedSolution = await getMarkedMySolution();

    mainContent.innerHTML = `
            <h1>Мои оценки</h1>
            <button id="view-grades-btn">Просмотреть успеваемость</button>
            <div class="grades-table" style="display:none">
            <style>

    .grades-table table {
      width: 100%;
      border-collapse: collapse; /* Убирает двойные линии между ячейками */
      margin-top: 20px;
    }

    .grades-table th, .grades-table td {
      border: 3px solid #ddd; /* Линии между ячейками */
      padding: 10px; /* Отступы внутри ячеек */
      text-align: left; /* Выравнивание текста по левому краю */
    }

    .grades-table th {
      background-color: #f0f0f0; /* Светло-серый фон для заголовков */
      color: #333; /* Темный текст для контраста */
      font-weight: bold; /* Сделать текст заголовка жирным */
    }

    .grades-table td {
      background-color: #fafafa; /* Светло-серый фон для данных */
    }

    #view-grades-btn {
      margin: 20px 0;
      padding: 10px 20px;
      background-color: #1a8edd; /* Зеленый цвет кнопки */
      color: white;
      border: none;
      cursor: pointer;
      font-size: 16px;
    }

    #view-grades-btn:hover {
      background-color: #1e6c99; /* Темно-зеленый при наведении */
    }
  </style>
      <table>
        <thead>
          <tr>
            <th>Предмет</th>
            <th>Задание</th>
            <th>Оценка</th>
            <th>Комментарий</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          ${markedSolution
            .map(
              (solution) => `
              <tr>
                <td>${
                  solution.task.subject
                    ? solution.task.subject.name
                    : "Без предмета"
                }</td>
                <td>${solution.task.name}</td>
                <td>${solution.mark}</td>
                <td>${solution.comment || "Без комментариев"}</td>
                <td>${new Date(
                  solution.task.createdAt
                ).toLocaleDateString()}</td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
            
            <p>Здесь будет отображаться список ваших оценок.</p>
            <div class="homework-section">
            ${markedSolution.map(
              (solution) => `
                    <div class="homework-item">
                        <div class="homework-details">
                            <h3>${
                              solution.task.subject
                                ? solution.task.subject.name
                                : "Без предмета"
                            }</h3>
                            <p class="homework-task"><em>${
                              solution.task.name
                            }</em></p>
                            <p class="homework-description">${
                              solution.task.desc
                            }</p>
                            <p class="homework-dates">
                                <span>Оценка: ${solution.mark}</span><br>
                                <span>Комментарий: ${
                                  solution.comment
                                    ? solution.comment
                                    : "Без комментариев"
                                }</span>
                            </p>
                        </div>
                    </div>
                `
            )}
            </div>
        `;
    document
      .getElementById("view-grades-btn")
      .addEventListener("click", function () {
        const gradesTable = document.querySelector(".grades-table");
        gradesTable.style.display =
          gradesTable.style.display === "none" ? "block" : "none";
      });
  });

  async function getMarkedMySolution() {
    const response = await fetch(`http://localhost:3000/api/tasks/marked`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    return await response.json();
  }

  renderHomeworkPage();
});
