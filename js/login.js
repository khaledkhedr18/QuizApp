const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // 1. Check if fields are empty
    const isRequiredValid = checkRequired([email, password]);
    if (!isRequiredValid) return;

    // 2. Check if email format is valid
    const isEmailValid = checkEmail(email);
    if (!isEmailValid) return;

    // 3. Database Check
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userWithThisEmail = users.find(u => u.email === email.value.trim());

    if (!userWithThisEmail) {
        showError(email, "Email doesn't exist.");
        password.value = "";
        password.parentElement.className = "form-group";
    } else if (userWithThisEmail.password !== password.value) {

        showError(password, "Wrong password.");
    } else {
        localStorage.setItem("currentUser", JSON.stringify(userWithThisEmail));
        window.location.href = "../index.html";
    }
});
function checkRequired(inputArray) {
    let isValid = true;
    inputArray.forEach(input => {
        input.parentElement.className = "form-group";
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false;
        }
    });
    return isValid;
}

function checkEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input.value.trim())) {
        return true;
    } else {
        if (input.value.trim() === "") {
            showError(input, `Email is required`);
            return false;
        }
        showError(input, `Email is not valid`);
        return false;
    }
}

function formatFieldName(input) {
    const name = input.id.replace(/-/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.className = "form-group error";
    const small = formGroup.querySelector("small");
    small.innerText = message;
}

function showSuccess(input) {
    const formGroup = input.parentElement;
    formGroup.className = "form-group success";
}

[email, password].forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
        }
        else {
            if (input.id === 'email') {
                const isFormatValid = checkEmail(email);

                if (isFormatValid) {
                    showSuccess(email);
                }
                else {
                    showError(email, "Email is not valid.");
                }
            }
        }
    });
});