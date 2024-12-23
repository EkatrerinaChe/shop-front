async function renderArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id"); // Пример URL: article.html?id=1234

  if (!articleId) {
    console.error("Article ID не найден");
    return;
  }

  const articleData = await fetchArticleById(articleId);
  console.log(articleData);
  if (articleData) {
    const articleContainer = document.getElementById("article-container");
    if (!articleContainer) {
      console.error("Контейнер #article-container не найден в HTML.");
      return;
    }
    //console.log(articleData.article.title);
    // Заголовок статьи
    if (articleData.article.title) {
      const titleElement = document.createElement("h1");
      titleElement.textContent = articleData.article.title;
      articleContainer.appendChild(titleElement);
    } else {
      console.warn("Заголовок статьи отсутствует.");
    }
    //console.log(articleData.article.subject);
    // Предмет статьи
    if (articleData.article.subject) {
      const subjectElement = document.createElement("h2");
      subjectElement.textContent = `Предмет: ${articleData.article.subject}`;
      subjectElement.style.fontSize = "18px";
      subjectElement.style.color = "#555";
      articleContainer.appendChild(subjectElement);
    } else {
      console.warn("Предмет статьи отсутствует.");
    }
    //console.log(articleData.article.createdAt);
    // Дата создания статьи
    if (articleData.article.createdAt) {
      const dateElement = document.createElement("p");
      const formattedDate = new Date(
        articleData.article.createdAt
      ).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      dateElement.textContent = `Дата создания: ${formattedDate}`;
      dateElement.style.fontSize = "14px";
      dateElement.style.color = "#888";
      articleContainer.appendChild(dateElement);
    } else {
      console.warn("Дата создания статьи отсутствует.");
    }

    // Основное содержимое
    if (articleData.content) {
      let content = articleData.content;
      if (typeof content === "string") {
        try {
          content = JSON.parse(content); // Преобразуем строку JSON в объект
        } catch (error) {
          console.error("Ошибка при парсинге JSON:", error);
          return;
        }
      }

      if (Array.isArray(content)) {
        content.forEach((block) => {
          let blockElement;

          switch (block.type) {
            case "title":
              blockElement = document.createElement("h1");
              blockElement.textContent = block.content;
              break;
            case "subtitle":
              blockElement = document.createElement("h2");
              blockElement.textContent = block.content;
              break;
            case "text":
              blockElement = document.createElement("p");
              blockElement.textContent = block.content;
              break;
            case "link":
              blockElement = document.createElement("a");
              blockElement.href = block.content;
              blockElement.textContent = `Перейти по ссылке: ${block.content}`;
              blockElement.style.color = "#1e88e5";
              blockElement.style.textDecoration = "underline";
              break;
            default:
              blockElement = document.createElement("div");
              blockElement.textContent = "Неизвестный блок";
          }

          articleContainer.appendChild(blockElement);
        });
      } else {
        console.error("Ошибка: 'content' не является массивом");
      }
    } else {
      console.warn("Основное содержимое статьи отсутствует.");
    }
  } else {
    console.error("Ошибка: данные статьи отсутствуют");
  }
}

async function fetchArticleById(id) {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(
      `http://localhost:3000/api/article/get/one/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Не удалось загрузить статью");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при загрузке статьи:", error);
    alert("Произошла ошибка при загрузке статьи");
    return null;
  }
}

window.onload = renderArticle();
