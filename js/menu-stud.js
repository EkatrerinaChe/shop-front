//                         Студенческая часть
document.addEventListener("DOMContentLoaded", function () {
  const homeworkLink = document.getElementById("homework-link");
  const gradesLink = document.getElementById("grades-link");
  const mainContent = document.getElementById("main-content");
  const token = localStorage.getItem("accessToken");

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
      (task) => new Date(task.dead_line) >= new Date()
    );
    const expiredTasks = tasks.filter(
      (task) => new Date(task.dead_line) < new Date()
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
                    <button class="view-works-button" onclick="viewWorks('${
                      task.id
                    }')">Загрузить решение</button>
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
  }

  homeworkLink.addEventListener("click", async function (event) {
    event.preventDefault();
    await renderHomeworkPage();
  });

  gradesLink.addEventListener("click", function (event) {
    event.preventDefault();
    mainContent.innerHTML = `
        <h1>Мои оценки</h1>
        <p>Здесь будет отображаться список ваших оценок.</p>
      `;
  });

  renderHomeworkPage();
});
