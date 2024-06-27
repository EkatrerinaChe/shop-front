//                         Студенческая часть
document.addEventListener('DOMContentLoaded', function() {
    const homeworkLink = document.getElementById('homework-link');
    const gradesLink = document.getElementById('grades-link');
    const mainContent = document.getElementById('main-content');

    homeworkLink.addEventListener('click', function(event) {
        event.preventDefault();
        mainContent.innerHTML = `
            <h1>Домашнее задание</h1>
            <div class="homework-section">
                <h2>Невыполненные домашние задания</h2>
                <p>Здесь будет список невыполненных домашних заданий.</p>
            </div>
            <div class="homework-section">
                <h2>Выполненные домашние задания</h2>
                <p>Здесь будет список выполненных домашних заданий.</p>
            </div>
        `;
    });

    gradesLink.addEventListener('click', function(event) {
        event.preventDefault();
        mainContent.innerHTML = `
            <h1>Мои оценки</h1>
            <p>Здесь будет отображаться список ваших оценок.</p>
        `;
    });
});
