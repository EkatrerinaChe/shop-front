document.addEventListener('DOMContentLoaded', async function() {
    const homeworkLink = document.getElementById('homework-link');
    const gradesLink = document.getElementById('grades-link');
    const mainContent = document.getElementById('main-content');

    homeworkLink.addEventListener('click', async function(event) {
        event.preventDefault();
        await renderHomeworkForm();
    });

    const token = localStorage.getItem('accessToken'); // Получение токена из localStorage

    if (!token) {
        console.error('Токен не найден в localStorage');
        return;
    }

    async function fetchSubjects() {
        const response = await fetch('http://localhost:3000/api/subject', {
            headers: {
                'Authorization': `${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    }

    async function fetchGroups() {
        const response = await fetch('http://localhost:3000/api/group', {
            headers: {
                'Authorization': `${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        return await response.json();
    }

    async function renderHomeworkForm() {
        const subjects = await fetchSubjects();
        const groups = await fetchGroups();

        mainContent.innerHTML = `
            <div class="homework-header">
                <h1>Текущие домашние задания</h1>
                <button class="add-homework-button" onclick="toggleAddHomeworkForm()">Добавить домашнее задание</button>
            </div>
            <div id="add-homework-form" style="display: none; margin-top: 20px;">
                <h2>Добавить домашнее задание</h2>
                <form onsubmit="return validateForm()">
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
                            ${subjects.map(subject => `<option value="${subject.id}">${subject.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="groups">Группы</label>
                        <div class="checkbox-container">
                            ${groups.map(group => `
                                <div class="checkbox-item">
                                    <input type="checkbox" id="group-${group.id}" name="groups" value="${group.id}">
                                    <label for="group-${group.id}">${group.name}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <button type="submit" class="create-homework-button">Создать домашнее задание</button>
                </form>
            </div>
            <div class="homework-section">
                <h2>Текущие домашние задания</h2>
                <div class="homework-item">
                    <div class="homework-details">
                        <h3>Физика</h3>
                        <p class="homework-task"><em>Задача про коллизию</em></p>
                        <p class="homework-description">ОПИСАНИЕ</p>
                        <button class="view-works-button">Посмотреть работы</button>
                        <p class="homework-dates">
                            <span>Дата создания: 01.06.2024</span><br>
                            <span>Дата конца: 10.06.2024</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="homework-section">
                <h2>Истёкшие домашние задания</h2>
                <p>Здесь будет список истёкших домашних заданий.</p>
            </div>
        `;
    }

    gradesLink.addEventListener('click', function(event) {
        event.preventDefault();
        mainContent.innerHTML = `
            <h1>Выставить оценки</h1>
            <p>Здесь будет отображаться интерфейс для выставления оценок.</p>
        `;
    });

    // Fetch subjects and groups on page load and log the results
    const subjects = await fetchSubjects();
    const groups = await fetchGroups();
    console.log('Subjects:', subjects);
    console.log('Groups:', groups);
});

function toggleAddHomeworkForm() {
    const form = document.getElementById('add-homework-form');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function validateForm() {
    const title = document.getElementById('homework-title').value.trim();
    const text = document.getElementById('homework-text').value.trim();
    const date = document.getElementById('due-date').value;
    const subject = document.getElementById('subject').value;
    const groups = Array.from(document.querySelectorAll('input[name="groups"]:checked')).map(cb => cb.value);

    if (!title || !text || !date || !subject || groups.length === 0) {
        alert('Пожалуйста, заполните все поля.');
        return false;
    }
    return true;
}



