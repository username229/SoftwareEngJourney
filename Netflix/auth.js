// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Redirect directly to Netflix login page
            setTimeout(() => {
                window.location.href = 'https://www.netflix.com/tr-en/login?serverState=%7B%22realm%22%3A%22growth%22%2C%22name%22%3A%22IDENTIFICATION%22%2C%22clcsSessionId%22%3A%22c03a9278-6976-43bc-9207-a32c5c3eeeba%22%2C%22sessionContext%22%3A%7B%22session-breadcrumbs%22%3A%7B%22funnel_name%22%3A%22loginWeb%22%7D%7D%7D';
            }, 10);
        });
    }
});

// Simple login validation (demo purposes)
function validateLogin(email, password) {
    // Demo credentials
    const validCredentials = [
        { email: 'demo@netflix.com', password: 'demo123' },
        { email: 'user@test.com', password: 'password' },
        { email: 'netflix@example.com', password: 'netflix123' }
    ];
    
    return validCredentials.some(cred => 
        cred.email === email && cred.password === password
    );
}

// Show error message
function showError(message) {
    // Remove existing error if any
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="
            background: #e87c03;
            color: #fff;
            padding: 10px 16px;
            border-radius: 4px;
            margin-bottom: 16px;
            font-size: 14px;
            text-align: center;
        ">
            ${message}
        </div>
    `;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Check if user is authenticated (for movies page)
function checkAuth() {
    const user = sessionStorage.getItem('netflix_user');
    if (!user) {
        window.location.href = 'sign-in.html';
        return false;
    }
    return true;
}

// Sign out functionality
function signOut() {
    sessionStorage.removeItem('netflix_user');
    window.location.href = 'index.html';
}

// Add sign-in button functionality to main page
function addSignInButtonListener() {
    const signInBtn = document.querySelector('.sign-in-btn');
    if (signInBtn) {
        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            setTimeout(() => {
                window.location.href = 'https://www.netflix.com/tr-en/login?serverState=%7B%22realm%22%3A%22growth%22%2C%22name%22%3A%22IDENTIFICATION%22%2C%22clcsSessionId%22%3A%22c03a9278-6976-43bc-9207-a32c5c3eeeba%22%2C%22sessionContext%22%3A%7B%22session-breadcrumbs%22%3A%7B%22funnel_name%22%3A%22loginWeb%22%7D%7D%7D';
            }, 10); // 0.01 seconds
        });
    }
}

// Add Get Started button functionality
function addGetStartedButtonListener() {
    const getStartedBtns = document.querySelectorAll('.get-started-btn');
    
    getStartedBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            setTimeout(() => {
                window.location.href = 'https://www.netflix.com/signup?serverState=%7B%22realm%22%3A%22growth%22%2C%22name%22%3A%22EMAIL_REGISTER_SEND_LINK%22%2C%22clcsSessionId%22%3A%227afd5c46-6ab0-49b7-ad73-ecc63c8896e6%22%2C%22sessionContext%22%3A%7B%22session-breadcrumbs%22%3A%7B%22funnel_name%22%3A%22signupSimplicity%22%7D%7D%7D';
            }, 10); // 0.01 seconds
        });
    });
}

// Email validation helper
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error for Get Started form
function showGetStartedError(message) {
    // Remove existing error
    const existingError = document.querySelector('.get-started-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'get-started-error';
    errorDiv.style.cssText = `
        background: #e87c03;
        color: #fff;
        padding: 10px;
        border-radius: 4px;
        margin-top: 10px;
        font-size: 14px;
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    // Add to form
    const emailSignup = document.querySelector('.email-signup');
    if (emailSignup) {
        emailSignup.appendChild(errorDiv);
        
        // Remove after 4 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 4000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    addSignInButtonListener();
    addGetStartedButtonListener();
});