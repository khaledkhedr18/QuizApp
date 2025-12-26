const form = document.getElementById("registerForm");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([username, email, password, confirmPassword]);
    
    let isFormValid = isRequiredValid;

        const isUserNameValid = checkLength(username, 4, 15);
        const isEmailValid = checkEmail(email);
        const isPasswordValid = checkLength(password, 6, 25);
        const isPasswordsMatch = checkPasswordsMatch(password, confirmPassword);

        isFormValid = isUserNameValid && isEmailValid && isPasswordValid && isPasswordsMatch;
    if (isFormValid) {
        const userData = {
            username: username.value.trim(),
            email: email.value.trim(),
            password: password.value 
        };

        const users = JSON.parse(localStorage.getItem('users')) || [];

        const userExists = users.some(user => user.email === userData.email);

        if (userExists) {
            showError(email, "This email is already registered");
        } else {
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));

            alert("Registration Successful!");
y
            setTimeout(() => {
                window.location.href = "/pages/login.html";
            }, 1000);

            form.reset();
            document.querySelectorAll(".form-group").forEach(group => {
                group.className = "form-group";
            });
        }
    }
});

function checkRequired(inputArray) {
    let isValid = true;
    inputArray.forEach(input => {
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
            isValid = false;
        } else {
            showSuccess(input);
        }
    });
    return isValid;
}

function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${formatFieldName(input)} must be at least ${min} characters`);
        return false;
    } else if (input.value.length > max) {
        showError(input, `${formatFieldName(input)} must be less than ${max} characters`);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

function checkEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input.value.trim())) {
        showSuccess(input);
        return true;
    } else {
        if(input.value.trim() === "") {
            showError(input, `Email is required`);
            return false;
        }
        showError(input, `Email is not valid`);
        return false;
    }
}

function checkPasswordsMatch(input1, input2) {
    if (input1.value.trim() === "") {
        return false; 
    }
    if (input1.value !== input2.value) {
        showError(input2, "Passwords do not match");
        return false;
    } 
    showSuccess(input2);
    return true;
}
function formatFieldName(input) {
    // FIXED: Replaces hyphens with spaces for better looking messages
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

const inputList = [username, email, password, confirmPassword];

inputList.forEach(input => {
    input.addEventListener('blur', () => {
        // 1. Check if it's empty first
        if (input.value.trim() === "") {
            showError(input, `${formatFieldName(input)} is required`);
        } 
        // 2. If it's NOT empty, run the specific check for that field
        else {
            if (input.id === 'username') {
                checkLength(username, 4, 15);
            } 
            else if (input.id === 'email') {
                checkEmail(email);
            } 
            else if (input.id === 'password') {
                checkLength(password, 6, 25);
            } 
            else if (input.id === 'confirm-password') {
                checkPasswordsMatch(password, confirmPassword);
            }
        }
    });
});