// Функция для рендеринга страницы
async function renderPage() {
  createBtns(); // Создаем кнопки
  fetchArticles(); // Загружаем статьи
  setupModal();
}
async function fetchArticles() {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch("http://localhost:3000/api/article/get/all", {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Не удалось загрузить статьи");
    }

    const articles = await response.json();
    displayArticles(articles);
  } catch (error) {
    console.error("Ошибка при загрузке статей:", error);
  }
}

// Функция для отображения карточек статей
function displayArticles(articles) {
  const container = document.getElementById("articles-container");
  articles.forEach((article) => {
    const articleLink = document.createElement("a");
    articleLink.href = `read.html?id=${article.id}`;
    articleLink.classList.add("card");

    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = article.title;

    const cardAuthor = document.createElement("div");
    cardAuthor.classList.add("card-author");
    cardAuthor.textContent = article.author;

    articleLink.appendChild(cardTitle);
    articleLink.appendChild(cardAuthor);
    container.appendChild(articleLink);
  });
}
// Функция для получения информации о пользователе
async function getUserInfo() {
  const token = localStorage.getItem("accessToken");

  const response = await fetch("http://localhost:3000/api/auth/getUserInfo", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка при получении данных пользователя");
  }

  return response.json(); // .json() вернет уже разобранный объект
}

// Функция для создания кнопок в зависимости от роли пользователя
async function createBtns() {
  const user = await getUserInfo();
  let htmlContent = "";

  if (user.roles === "TEACHER") {
    htmlContent += `
          <a href="teacher.html">
            <button>Вернуться на главную страницу</button>
          </a>
          <button id="create-article-btn">Создать статью</button>
        `;
  } else {
    htmlContent += `
          <a href="student.html">
            <button>Вернуться на главную страницу</button>
          </a>
        `;
  }

  const container = document.getElementById("buttons-container");
  container.innerHTML = htmlContent;

  // Добавляем обработчик для кнопки "Создать статью"
  const createArticleBtn = document.getElementById("create-article-btn");
  if (createArticleBtn) {
    createArticleBtn.addEventListener("click", showCreateArticleModal);
  }
}

// Функция для показа формы создания статьи в модальном окне
function showCreateArticleModal() {
  const modal = document.getElementById("create-article-modal");
  const closeModal = document.querySelector(".close");

  modal.style.display = "block";

  // Закрытие модального окна
  closeModal.onclick = function () {
    modal.style.display = "none";
  };

  // Обработка клика вне модального окна для закрытия
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

// Логика добавления блоков в статью
document.getElementById("add-block").addEventListener("click", () => {
  const blockType = document.getElementById("block-type").value;
  const blockContent = document.getElementById("block-content").value;

  if (!blockContent.trim()) {
    alert("Контент не может быть пустым");
    return;
  }

  const block = { type: blockType, content: blockContent };
  const blocksContainer = document.getElementById("blocks-container");
  const blockElement = document.createElement("div");
  blockElement.classList.add("block");
  blockElement.innerHTML = `
      <p><strong>Тип блока:</strong> ${getBlockTypeName(block.type)}</p>
      <p><strong>Контент:</strong> ${block.content}</p>
      <button class="remove-block">Удалить блок</button>
    `;

  blockElement.querySelector(".remove-block").addEventListener("click", () => {
    blockElement.remove();
  });

  blockElement.dataset.block = JSON.stringify(block);
  blocksContainer.appendChild(blockElement);
  document.getElementById("block-content").value = "";
});

// Функция для получения имени типа блока
function getBlockTypeName(type) {
  const blockTypes = {
    text: "Текст",
    title: "Заголовок",
    subtitle: "Подзаголовок",
    link: "Ссылка",
  };
  return blockTypes[type] || "Неизвестный тип";
}

// Обработчик отправки формы
document.getElementById("article-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const blocks = Array.from(
    document.querySelectorAll("#blocks-container .block")
  ).map((blockElement) => {
    return JSON.parse(blockElement.dataset.block);
  });

  const articleData = {
    title: document.getElementById("article-title").value, // Добавляем поле для названия
    subject: document.getElementById("article-subject").value, // Добавляем поле для темы
    content: JSON.stringify(blocks), // Преобразуем блоки в строку JSON
  };

  sendArticleData(articleData);
});

// Функция для отправки данных на сервер
async function sendArticleData(data) {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch("http://localhost:3000/api/article/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Статья успешно создана!");
      window.location.reload(); // Перезагружаем страницу после успешной отправки
    } else {
      alert("Ошибка при создании статьи");
    }
  } catch (error) {
    console.error("Ошибка:", error);
    alert("Произошла ошибка при отправке статьи");
  }
}

// Загружаем статьи при загрузке страницы
window.onload = renderPage;
