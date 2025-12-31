function getStart() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = "../pages/register.html";
    } else {
        window.location.href = "../pages/startscreen.html";
    }
}
