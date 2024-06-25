document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', validateForm);
});

function validateForm(event) {
    event.preventDefault();
    let isValid = true;

    const username = document.getElementById('Username');
    const password = document.getElementById('Password');
    const usernameValidation = document.getElementById('Username-validation');
    const passwordValidation = document.getElementById('Password-validation');
    const validationSummary = document.getElementById('validation-summary');

    usernameValidation.textContent = '';
    passwordValidation.textContent = '';
    validationSummary.textContent = '';

    if (!username.value.trim()) {
        usernameValidation.textContent = 'Пожалуйста, введите логин.';
        isValid = false;
    }

    if (!password.value.trim()) {
        passwordValidation.textContent = 'Пожалуйста, введите пароль.';
        isValid = false;
    }

    if (isValid) {
        event.target.submit();
    } else {
        validationSummary.textContent = 'Пожалуйста, исправьте ошибки ниже.';
    }
}

