// Movies page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();
    
    // Initialize page functionality
    initializeHeader();
    initializeContentSliders();
    
    // Add welcome message
    showWelcomeMessage();
});

// Header scroll effect
function initializeHeader() {
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Content sliders functionality
function initializeContentSliders() {
    const sliders = document.querySelectorAll('.content-slider');
    
    sliders.forEach(slider => {
        // Add mouse wheel horizontal scrolling
        slider.addEventListener('wheel', function(e) {
            if (e.deltaY !== 0) {
                e.preventDefault();
                this.scrollLeft += e.deltaY;
            }
        });
        
        // Add touch scrolling for mobile
        let isDown = false;
        let startX;
        let scrollLeft;
        
        slider.addEventListener('mousedown', function(e) {
            isDown = true;
            startX = e.pageX - this.offsetLeft;
            scrollLeft = this.scrollLeft;
        });
        
        slider.addEventListener('mouseleave', function() {
            isDown = false;
        });
        
        slider.addEventListener('mouseup', function() {
            isDown = false;
        });
        
        slider.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - this.offsetLeft;
            const walk = (x - startX) * 2;
            this.scrollLeft = scrollLeft - walk;
        });
    });
}

// Show welcome message
function showWelcomeMessage() {
    const user = JSON.parse(sessionStorage.getItem('netflix_user'));
    if (user) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            color: #fff;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1001;
            border-left: 4px solid #e50914;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            max-width: 300px;
        `;
        
        if (user.isNewUser) {
            welcomeMessage.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 5px;">🎉 Welcome to Netflix!</div>
                <div>Hi ${user.email.split('@')[0]}, enjoy unlimited movies and TV shows!</div>
            `;
            
            // Remove the isNewUser flag after showing the message
            user.isNewUser = false;
            sessionStorage.setItem('netflix_user', JSON.stringify(user));
        } else {
            welcomeMessage.textContent = `Welcome back, ${user.email.split('@')[0]}!`;
        }
        
        document.body.appendChild(welcomeMessage);
        
        // Remove after 4 seconds for new users, 3 for returning users
        const timeout = user.isNewUser ? 5000 : 3000;
        setTimeout(() => {
            if (welcomeMessage.parentNode) {
                welcomeMessage.remove();
            }
        }, timeout);
    }
}

// Content item click handlers
document.addEventListener('click', function(e) {
    if (e.target.closest('.content-item')) {
        const contentItem = e.target.closest('.content-item');
        const title = contentItem.querySelector('h3').textContent;
        showContentModal(title);
    }
    
    if (e.target.closest('.btn-play')) {
        showPlayModal('Stranger Things');
    }
    
    if (e.target.closest('.btn-info')) {
        showInfoModal('Stranger Things');
    }
});

// Show content modal
function showContentModal(title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: #141414;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            color: #fff;
        ">
            <h2 style="margin-bottom: 20px; color: #e50914;">${title}</h2>
            <p style="margin-bottom: 20px; line-height: 1.5;">
                This is a demo Netflix clone. In a real application, this would show 
                detailed information about the selected content, including cast, 
                episodes, and playback options.
            </p>
            <button onclick="this.closest('.modal').remove()" style="
                background: #e50914;
                color: #fff;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            ">Close</button>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show play modal
function showPlayModal(title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: #000;
            padding: 40px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            text-align: center;
            color: #fff;
        ">
            <div style="
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #e50914;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                font-size: 40px;
            ">▶</div>
            <h2 style="margin-bottom: 20px;">Now Playing: ${title}</h2>
            <p style="margin-bottom: 20px; color: #ccc;">
                Demo playback started. In a real Netflix app, the video player would load here.
            </p>
            <button onclick="this.closest('.modal').remove()" style="
                background: #e50914;
                color: #fff;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                margin-right: 10px;
            ">Stop</button>
            <button onclick="this.closest('.modal').remove()" style="
                background: transparent;
                color: #fff;
                border: 1px solid #fff;
                padding: 12px 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
            ">Full Screen</button>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Show info modal
function showInfoModal(title) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: #141414;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            color: #fff;
        ">
            <h2 style="margin-bottom: 20px; color: #e50914;">${title}</h2>
            <div style="margin-bottom: 20px;">
                <strong style="color: #46d369;">98% Match</strong> • 
                <span style="color: #ccc;">2016</span> • 
                <span style="color: #ccc;">4 Seasons</span>
            </div>
            <p style="margin-bottom: 20px; line-height: 1.6;">
                When a young boy vanishes, a small town uncovers a mystery involving 
                secret experiments, terrifying supernatural forces and one strange little girl.
            </p>
            <div style="margin-bottom: 20px;">
                <strong>Starring:</strong> <span style="color: #ccc;">Winona Ryder, David Harbour, Finn Wolfhard</span>
            </div>
            <div style="margin-bottom: 20px;">
                <strong>Genres:</strong> <span style="color: #ccc;">TV Horror, TV Sci-Fi & Fantasy, TV Dramas</span>
            </div>
            <div style="text-align: center;">
                <button onclick="this.closest('.modal').remove()" style="
                    background: #e50914;
                    color: #fff;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-right: 10px;
                ">▶ Play</button>
                <button onclick="this.closest('.modal').remove()" style="
                    background: transparent;
                    color: #fff;
                    border: 1px solid #fff;
                    padding: 12px 24px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                ">+ My List</button>
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}