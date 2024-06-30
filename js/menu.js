document.addEventListener("DOMContentLoaded", async function () {
  const homeworkLink = document.getElementById("homework-link");
  const gradesLink = document.getElementById("grades-link");
  const mainContent = document.getElementById("main-content");
  const token = localStorage.getItem("accessToken"); // Получение токена из localStorage

  if (!token) {
    console.error("Токен не найден в localStorage");
    return;
  }

  homeworkLink.addEventListener("click", async function (event) {
    event.preventDefault();
    await renderHomeworkPage();
  });

  gradesLink.addEventListener("click", function (event) {
    event.preventDefault();
    mainContent.innerHTML = `
          <h1>Выставить оценки</h1>
          <p>Здесь будет отображаться интерфейс для выставления оценок.</p>
      `;
  });

  async function fetchSubjects() {
    try {
      const response = await fetch("http://localhost:3000/api/subject", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении дисциплин:", error);
    }
  }

  async function fetchGroups() {
    try {
      const response = await fetch("http://localhost:3000/api/group", {
        headers: {
          Authorization: `${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Ошибка при получении групп:", error);
    }
  }

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
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

  async function renderHomeworkForm() {
    const subjects = await fetchSubjects();
    const groups = await fetchGroups();

    console.log("Subjects:", subjects);
    console.log("Groups:", groups);

    document.getElementById("add-homework-form").innerHTML = `
          <h2>Добавить домашнее задание</h2>
          <form id="homework-form">
              <div class="form-group">
                  <label for="homework-title">Тема домашнего задания</label>
                  <input type="text" id="homework-title" name="homework-title" required>
              </div>
              <div class="form-group">
                  <label for="homework-text">Текст домашнего задания</label>
                  <textarea id="homework-text" name="homework-text" rows="5" required></textarea>
              </div>
              <div class="form-group">
                  <label for="due-date">Срок выполнения</label>
                  <input type="date" id="due-date" name="due-date" required>
              </div>
              <div class="form-group">
                  <label for="subject">Дисциплина</label>
                  <select id="subject" name="subject" required>
                      ${subjects
                        .map(
                          (subject) =>
                            `<option value="${subject.id}">${subject.name}</option>`
                        )
                        .join("")}
                  </select>
              </div>
              <div class="form-group">
                  <label for="groups">Группы</label>
                  <div class="checkbox-container">
                      ${groups
                        .map(
                          (group) => `
                          <div class="checkbox-item">
                              <input type="checkbox" id="group-${group.id}" name="groups" value="${group.id}">
                              <label for="group-${group.id}">${group.name}</label>
                          </div>
                      `
                        )
                        .join("")}
                  </div>
              </div>
              <button type="submit" class="create-homework-button">Создать домашнее задание</button>
          </form>
      `;

    document
      .getElementById("homework-form")
      .addEventListener("submit", createHomework);
  }

  async function createHomework(event) {
    event.preventDefault();

    const title = document.getElementById("homework-title").value.trim();
    const text = document.getElementById("homework-text").value.trim();
    const dueDate = document.getElementById("due-date").value;
    const subjectId = document.getElementById("subject").value;
    const groupIds = Array.from(
      document.querySelectorAll('input[name="groups"]:checked')
    ).map((cb) => cb.value);

    if (!title || !text || !dueDate || !subjectId || groupIds.length === 0) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/tasks/create", {
        method: "POST",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: title,
          desc: text,
          deadLine: dueDate,
          subject: subjectId,
          groups: groupIds,
        }),
      });

      if (response.ok) {
        alert("Домашнее задание создано");
        toggleAddHomeworkForm();
        await renderHomeworkPage();
      } else {
        alert("Ошибка при создании домашнего задания");
      }
    } catch (error) {
      console.error("Ошибка при создании домашнего задания:", error);
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
          <div class="homework-header">
              <h1>Текущие домашние задания</h1>
              <button class="add-homework-button" id="add-homework-button">Добавить домашнее задание</button>
          </div>
          <div id="add-homework-form" style="display: none; margin-top: 20px;">
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
                          }')">Посмотреть работы</button>
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
                          <button class="view-works-button" onclick="viewWorks('${
                            task.id
                          }')">Посмотреть работы</button>
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

    // Загрузить форму добавления домашнего задания
    document
      .getElementById("add-homework-button")
      .addEventListener("click", async function () {
        await renderHomeworkForm();
        toggleAddHomeworkForm();
      });
  }

  function toggleAddHomeworkForm() {
    const form = document.getElementById("add-homework-form");
    if (form.style.display === "none" || form.style.display === "") {
      form.style.display = "block";
    } else {
      form.style.display = "none";
    }
  }

  // Изначально загружаем страницу с заданиями
  await renderHomeworkPage();
});
