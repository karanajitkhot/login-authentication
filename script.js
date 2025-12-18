// Store users in localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const registerContainer = document.getElementById('registerContainer');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Toast notification function
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Switch between login and register forms
if (showRegisterBtn) {
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.form-container').classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });
}

if (showLoginBtn) {
    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.form-container').classList.remove('hidden');
        registerContainer.classList.add('hidden');
    });
}

// Register form submission
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (password !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            return;
        }

        if (users.some(user => user.username === username)) {
            showToast('Username already exists!', 'error');
            return;
        }

        if (users.some(user => user.email === email)) {
            showToast('Email already registered!', 'error');
            return;
        }

        // Add new user
        users.push({
            username,
            email,
            password // In a real application, this should be hashed
        });

        localStorage.setItem('users', JSON.stringify(users));
        showToast('Registration successful!', 'success');
        
        // Switch to login form
        document.querySelector('.form-container').classList.remove('hidden');
        registerContainer.classList.add('hidden');
        registerForm.reset();
    });
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showToast('Invalid username or password!', 'error');
        }
    });
}

// Dashboard functionality
if (window.location.pathname.includes('dashboard.html')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
    } else {
        document.getElementById('username').textContent = currentUser.username;
        document.getElementById('lastLogin').textContent = new Date().toLocaleString();
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
}
