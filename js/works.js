async function fetchWorks(taskId) {
  const token = localStorage.getItem("accessToken"); // Получение токена из localStorage

  try {
    const response = await fetch(
      `http://localhost:3000/api/solution/${taskId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при получении работ:", error);
  }
}

async function viewWorks(taskId) {
  const tasks = await fetchWorks(taskId);
  console.log(tasks);
  console.log("Works:", tasks);

  if (!tasks || tasks.length === 0) {
    alert("Работ пока что нет");
    return;
  }
  const checkedWorks = tasks.filter((task) => task.mark !== null);
  const uncheckedWorks = tasks.filter((task) => task.mark === null);

  const mainContent = document.getElementById("main-content");
  for (let onetask of tasks) {
    mainContent.innerHTML = `
        <div class="works-section">
            <h2>Проверенные работы</h2>
            ${checkedWorks
              .map(
                (task) => `
                <div class="work-item">
                    <div class="work-details">
                        <h3>${task.user.fullName}</h3>
                        <p class="work-mark">Оценка: ${task.mark}</p>
                        <p class="work-comment">Комментарий: ${task.comment}</p>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
        <div class="works-section">
            <h2>Непроверенные работы</h2>
            ${uncheckedWorks
              .map(
                (task) => `
                <div class="work-item">
                    <div class="work-details">
                        <h3>${task.user.fullName}</h3>
                        <p class="work-comment">Комментарий: ${task.comment}</p>
                        <div class="form-group">
                            <label for="mark-${task.id}">Оценка</label>
                            <input type="number" id="mark-${task.id}" name="mark-${task.id}" required>
                        </div>
                        <div class="form-group">
                            <label for="comment-${task.id}">Комментарий</label>
                            <textarea id="comment-${task.id}" name="comment-${task.id}" rows="3"></textarea>
                        </div>
                        <a class="set-mark-button" href="${task.file}">Скачать работу</a>
                        <button class="set-mark-button" onclick="setMark('${task.id}')">Поставить оценку</button>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
  }
}

async function setMark(taskId) {
  const token = localStorage.getItem("accessToken"); // Получение токена из localStorage
  const mark = parseInt(document.getElementById(`mark-${taskId}`).value);
  const comment = document.getElementById(`comment-${taskId}`).value;

  if ((!mark, mark <= 1, mark > 5)) {
    alert(
      "Пожалуйста, введите оценку (оценка не должна быть меньше 2 или больше 5)"
    );
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/solution/update`, {
      method: "POST",
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        solution_id: taskId,
        mark: mark,
        comment: comment,
      }),
    });

    if (response.ok) {
      alert("Оценка установлена");
      await viewWorks(taskId); // Обновить список работ
    } else {
      alert("Ошибка при установке оценки");
    }
  } catch (error) {
    console.error("Ошибка при установке оценки:", error);
  }
}
