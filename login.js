const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const loginError = document.getElementById('loginError');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('admin_session') === 'true') {
        window.location.href = 'index.html';
    }
});

function handleAuth(e) {
    e.preventDefault(); // Prevents page reload
    
    // Reset state
    loginError.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Entrando...';
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Hardcoded logic for "admin" and "123"
    setTimeout(() => {
        if (email === 'admin' && password === '123') {
            localStorage.setItem('admin_session', 'true');
            window.location.href = 'index.html';
        } else {
            showError("Usuário ou senha incorretos. Use usuário 'admin' e senha '123'.");
        }
    }, 500); // 500ms delay to simulate network request
}

function showError(message) {
    loginError.innerText = message;
    loginError.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.innerText = "Entrar";
}
