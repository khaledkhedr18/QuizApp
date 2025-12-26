const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([email, password]);
    const isEmailValid = checkEmail(email);

    if (isRequiredValid && isEmailValid) {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const foundUser = users.find(user => 
            user.email === email.value.trim() && user.password === password.value
        );

        if (foundUser) {
            
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            
            alert(`Welcome back, ${foundUser.username}!`);
            
            window.location.href = "../index.html"; 
        } else {
            showError(email, "Invalid email or password");
            showError(password, "Invalid email or password");
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
                checkEmail(email);
            }
            else if (input.id === 'password') {
                checkLength(password, 6, 25);
            }
        }
    });
});