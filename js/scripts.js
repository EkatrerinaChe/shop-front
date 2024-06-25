function submitForm() {
    const form = document.getElementById('login-form');

    // Собрать данные из формы
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    console.log(data);

    // Отправить данные на бэкэнд
    fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        // Успешный ответ от сервера
        // Сохраняем accessToken в localStorage
        localStorage.setItem('accessToken', result.acessToken);

        // Запрос на получение информации о пользователе
        return fetch('http://localhost:3000/api/auth/getUserInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': result.acessToken
            }
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }
        return response.json();
    })
    .then(userInfo => {
        console.log(userInfo);
        // Перенаправляем пользователя в зависимости от его роли
        if (userInfo.roles === "TEACHER") {
            window.location.href = '/teacher.html';
        } else {
            window.location.href = '/student.html';
        }
    })
    .catch(error => {
        // Ошибка запроса
        console.error('Error:', error);
        alert("Логин или пароль неверен");
    });
}
