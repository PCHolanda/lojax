const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const loginError = document.getElementById('loginError');

let isLoginMode = true;

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        window.location.href = 'index.html';
    }
});

function toggleMode(e) {
    if (e) e.preventDefault();
    isLoginMode = !isLoginMode;
    
    const pageSubtitle = document.getElementById('pageSubtitle');
    const toggleText = document.getElementById('toggleText');
    
    if (isLoginMode) {
        pageSubtitle.innerText = 'Acesse sua conta para continuar.';
        submitBtn.innerText = 'Entrar';
        toggleText.innerHTML = 'Não tem uma conta? <a href="#" onclick="toggleMode(event)">Cadastre-se</a>';
    } else {
        pageSubtitle.innerText = 'Crie sua conta para começar.';
        submitBtn.innerText = 'Cadastrar';
        toggleText.innerHTML = 'Já tem uma conta? <a href="#" onclick="toggleMode(event)">Faça Login</a>';
    }
    
    loginError.style.display = 'none';
}

async function handleAuth(e) {
    e.preventDefault(); // Prevents page reload
    
    // Reset state
    loginError.style.display = 'none';
    loginError.style.color = 'var(--danger)'; // Revert if previously success
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Aguarde...';
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (isLoginMode) {
        // Login Flow
        const { data, error } = await db.auth.signInWithPassword({ email, password });
        if (error) {
            showError('Erro ao fazer login: ' + error.message);
        } else {
            window.location.href = 'index.html';
        }
    } else {
        // Signup Flow
        const { data, error } = await db.auth.signUp({ email, password });
        if (error) {
            showError('Erro ao cadastrar: ' + error.message);
        } else {
            // Sucesso
            loginError.innerText = 'Cadastro realizado com sucesso! Você pode fazer login.';
            loginError.style.color = 'var(--success)';
            loginError.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerText = 'Entrar';
            
            // Trocar para modo login
            isLoginMode = true;
            toggleMode();
        }
    }
}

function showError(message) {
    loginError.innerText = message;
    loginError.style.display = 'block';
    loginError.style.color = 'var(--danger)';
    submitBtn.disabled = false;
    submitBtn.innerText = isLoginMode ? "Entrar" : "Cadastrar";
}
