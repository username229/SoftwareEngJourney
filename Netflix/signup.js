// Signup page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeSignup();
    setupFormValidation();
    setupPlanSelection();
    setupPaymentMethods();
    setupCardFormatting();
});

let currentStep = 1;
let selectedPlan = 'standard';
let signupData = {};

function initializeSignup() {
    // Get email from URL params if coming from "Get Started"
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
        document.getElementById('email').value = email;
        showMessage('Welcome! Complete your registration to start watching.', 'success');
    }
    
    // Setup form submission
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', handleSignupSubmission);
}

function setupFormValidation() {
    // Real-time password validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    confirmPassword.addEventListener('input', function() {
        if (this.value && this.value !== password.value) {
            this.setCustomValidity('Passwords do not match');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Email validation
    const email = document.getElementById('email');
    email.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value && !emailRegex.test(this.value)) {
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.setCustomValidity('');
        }
    });
}

function setupPlanSelection() {
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            planCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Store selected plan
            selectedPlan = this.dataset.plan;
        });
    });
    
    // Set default selection
    document.querySelector('[data-plan="standard"]').classList.add('selected');
}

function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            paymentOptions.forEach(o => o.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Check the radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Show/hide payment forms (currently only card form)
            const method = this.dataset.method;
            togglePaymentForm(method);
        });
    });
}

function togglePaymentForm(method) {
    const cardForm = document.getElementById('cardForm');
    
    if (method === 'card') {
        cardForm.style.display = 'block';
        makeCardFieldsRequired(true);
    } else {
        cardForm.style.display = 'none';
        makeCardFieldsRequired(false);
    }
}

function makeCardFieldsRequired(required) {
    const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
    cardFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.required = required;
        }
    });
}

function setupCardFormatting() {
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    cardNumber.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
    
    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    expiryDate.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // CVV formatting
    const cvv = document.getElementById('cvv');
    cvv.addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });
}

function nextStep(step) {
    if (validateCurrentStep()) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Update step indicator
        document.querySelectorAll('.step')[currentStep - 1].classList.remove('active');
        document.querySelectorAll('.step')[step - 1].classList.add('active');
        
        // Show next step
        document.getElementById(`step${step}`).classList.add('active');
        
        currentStep = step;
        
        // Collect data from previous step
        collectStepData(currentStep - 1);
    }
}

function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Update step indicator
    document.querySelectorAll('.step')[currentStep - 1].classList.remove('active');
    document.querySelectorAll('.step')[step - 1].classList.add('active');
    
    // Show previous step
    document.getElementById(`step${step}`).classList.add('active');
    
    currentStep = step;
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

function validateStep1() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!email || !password || !confirmPassword) {
        showMessage('Please fill in all required fields.', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long.', 'error');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

function validateStep2() {
    if (!selectedPlan) {
        showMessage('Please select a plan.', 'error');
        return false;
    }
    return true;
}

function validateStep3() {
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!agreeTerms) {
        showMessage('Please agree to the Terms of Use and Privacy Policy.', 'error');
        return false;
    }
    
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    
    if (selectedPayment === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value;
        
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
            showMessage('Please fill in all payment information.', 'error');
            return false;
        }
        
        if (cardNumber.replace(/\s/g, '').length < 13) {
            showMessage('Please enter a valid card number.', 'error');
            return false;
        }
        
        if (cvv.length < 3) {
            showMessage('Please enter a valid CVV.', 'error');
            return false;
        }
    }
    
    return true;
}

function collectStepData(step) {
    switch (step) {
        case 1:
            signupData.email = document.getElementById('email').value;
            signupData.password = document.getElementById('password').value;
            break;
        case 2:
            signupData.plan = selectedPlan;
            break;
        case 3:
            signupData.paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            if (signupData.paymentMethod === 'card') {
                signupData.cardInfo = {
                    number: document.getElementById('cardNumber').value,
                    expiry: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value,
                    name: document.getElementById('cardName').value
                };
            }
            break;
    }
}

function handleSignupSubmission(e) {
    e.preventDefault();
    
    if (validateCurrentStep()) {
        collectStepData(currentStep);
        
        // Show loading state
        const submitBtn = document.querySelector('.complete-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate account creation delay
        setTimeout(() => {
            createAccount();
        }, 2000);
    }
}

function createAccount() {
    try {
        // In a real app, this would make an API call to create the account
        // For demo purposes, we'll simulate success
        
        // Store user session
        const userData = {
            email: signupData.email,
            plan: signupData.plan,
            registrationDate: new Date().toISOString(),
            isNewUser: true
        };
        
        sessionStorage.setItem('netflix_user', JSON.stringify(userData));
        
        // Show success message
        showMessage('Account created successfully! Redirecting to Netflix...', 'success');
        
        // Redirect to official Netflix page in 0.01 seconds
        setTimeout(() => {
            window.location.href = 'https://www.netflix.com';
        }, 10);
        
    } catch (error) {
        // Reset button state
        const submitBtn = document.querySelector('.complete-btn');
        submitBtn.textContent = 'Start Membership';
        submitBtn.disabled = false;
        
        showMessage('Something went wrong. Please try again.', 'error');
    }
}

function showMessage(message, type = 'error') {
    // Remove existing messages
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    // Insert at the top of current step
    const currentStepEl = document.querySelector('.form-step.active');
    currentStepEl.insertBefore(messageDiv, currentStepEl.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
    
    // Scroll to top of form
    currentStepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}