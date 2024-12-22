async function renderArticle() {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get("id"); // Пример URL: article.html?id=1234

  if (!articleId) {
    console.error("Article ID не найден");
    return;
  }

  const articleData = await fetchArticleById(articleId);
  console.log(articleData);

  if (articleData && articleData.content) {
    // Парсим content как JSON строку, если это строка
    let content = articleData.content;
    if (typeof content === "string") {
      try {
        content = JSON.parse(content); // Преобразуем строку JSON в объект
      } catch (error) {
        console.error("Ошибка при парсинге JSON:", error);
        return;
      }
    }

    // Убедимся, что content является массивом
    if (Array.isArray(content)) {
      const articleContainer = document.getElementById("article-container");

      content.forEach((block) => {
        let blockElement;

        // В зависимости от типа блока, создаем соответствующий элемент
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
            break;
          default:
            blockElement = document.createElement("div");
            blockElement.textContent = "Неизвестный блок";
        }

        // Добавляем блок на страницу
        articleContainer.appendChild(blockElement);
      });
    } else {
      console.error("Ошибка: 'content' не является массивом");
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

    const article = await response.json();

    return article;
  } catch (error) {
    console.error("Ошибка при загрузке статьи:", error);
    alert("Произошла ошибка при загрузке статьи");
    return null;
  }
}

window.onload = renderArticle();
