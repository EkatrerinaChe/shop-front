document.addEventListener("DOMContentLoaded", function () {
  const scheduleLink = document.getElementById("schedule-link");
  const mainContent = document.getElementById("main-content");

  // Обработчик клика на ссылку "Расписание"
  scheduleLink.addEventListener("click", function (event) {
    event.preventDefault();
    renderSchedulePage();
  });

  function renderSchedulePage() {
    mainContent.innerHTML = `
          <h1>Расписание</h1>
          <div id="calendar"></div>
        `;

    // Инициализация FullCalendar
    const calendarEl = document.getElementById("calendar");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "timeGridWeek",
      locale: "ru",
      events: async function (fetchInfo, successCallback, failureCallback) {
        try {
          const response = await fetch("http://localhost:3000/api/schedule", {
            headers: {
              Authorization: `${localStorage.getItem("accessToken")}`,
            },
          });
          const events = await response.json();

          const formattedEvents = events.map((event) => {
            const startDate = new Date(event.date);
            const [hour, minute] = event.time.split(":");
            startDate.setHours(hour, minute);

            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 1, 45);

            return {
              title: `${event.subjectName} - ${event.groupName}`,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              description: `Преподаватель: ${event.teacherName}`,
              location: event.groupName,
            };
          });

          successCallback(formattedEvents);
        } catch (error) {
          console.error("Ошибка при загрузке событий:", error);
          failureCallback(error);
        }
      },
      eventDidMount: function (info) {
        // Создаем всплывающее описание
        const tooltip = document.createElement("div");
        tooltip.className = "event-tooltip";
        tooltip.innerHTML = `
            <strong>${info.event.title}</strong><br>
            Преподаватель: ${info.event.extendedProps.description}<br>
            Место: ${info.event.extendedProps.location}
          `;
        document.body.appendChild(tooltip);

        // Обработчик для показа и скрытия подсказки
        info.el.addEventListener("mouseenter", function () {
          const rect = info.el.getBoundingClientRect();
          tooltip.style.top = rect.top + window.scrollY + "px";
          tooltip.style.left = rect.left + window.scrollX + "px";
          tooltip.style.display = "block";
        });

        info.el.addEventListener("mouseleave", function () {
          tooltip.style.display = "none";
        });
      },
    });

    calendar.render();
  }
});
