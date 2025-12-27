function startExam() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert("Wait a second! Please login first. 🐣");
        window.location.href = "../pages/login.html";
    } else {
        window.location.href = "../pages/startscreen.html";
    }
}

function viewResults() {
    window.location.href = "../pages/resultscreen.html";
}