fetch("../pages/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar").innerHTML = html;

        const loginBtn = document.getElementById("loginBtn");
        const signupBtn = document.getElementById("signupBtn");

        if (!loginBtn || !signupBtn) return;

        const toggleButtons = (active, inactive) => {
            active.classList.add("bg-[#e86a33]", "text-white", "border-none");
            active.classList.remove("bg-white", "text-gray-700", "border-gray-200");

            inactive.classList.add("bg-white", "text-gray-700", "border", "border-gray-200");
            inactive.classList.remove("bg-[#e86a33]", "text-white", "border-none");
        };

        loginBtn.addEventListener("click", () => {
            toggleButtons(loginBtn, signupBtn);
            // Navigate to login page
            window.location.href = "../pages/login.html";
        });

        signupBtn.addEventListener("click", () => {
            toggleButtons(signupBtn, loginBtn);
            // Navigate to signup page
            window.location.href = "../pages/register.html";
        });
    })
    .catch(console.error);
