let isLoginMode = true;

const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submitBtn');
const loginError = document.getElementById('loginError');
const toggleText = document.getElementById('toggleText');
const pageSubtitle = document.getElementById('pageSubtitle');

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        window.location.href = 'index.html';
    }
});

function toggleMode(e) {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    loginError.style.display = 'none';
    
    if (isLoginMode) {
        pageSubtitle.innerText = "Acesse sua conta para continuar.";
        submitBtn.innerText = "Entrar";
        toggleText.innerHTML = `Não tem uma conta? <a href="#" onclick="toggleMode(event)">Cadastre-se</a>`;
    } else {
        pageSubtitle.innerText = "Crie uma nova conta grátis.";
        submitBtn.innerText = "Criar Conta";
        toggleText.innerHTML = `Já possui uma conta? <a href="#" onclick="toggleMode(event)">Voltar ao Login</a>`;
    }
}

async function handleAuth(e) {
    e.preventDefault(); // Prevents page reload
    
    // Reset state
    loginError.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processando...';
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    if (isLoginMode) {
        // Handle Sign In
        const { data, error } = await db.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            showError("Credenciais inválidas. Verifique seu e-mail e senha.");
        } else {
            // Success
            window.location.href = 'index.html';
        }
    } else {
        // Handle Sign Up
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) {
            showError("Erro ao criar conta: " + error.message);
        } else {
            // Success Sign Up
            // Depending on Supabase settings, sign up may require email confirmation.
            // If auto-confirm is enabled, they will be logged in automatically.
            alert("Conta criada com sucesso! Você já pode usar o EstoquePro.");
            window.location.href = 'index.html';
        }
    }
}

function showError(message) {
    loginError.innerText = message;
    loginError.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.innerText = isLoginMode ? "Entrar" : "Criar Conta";
}
