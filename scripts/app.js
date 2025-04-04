// Initialize particles.js with a more subtle effect
particlesJS('particles-js', {
    particles: {
        number: {
            value: 40,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: ['#00ff9d', '#ff6b6b', '#1a1a2e']
        },
        shape: {
            type: ['circle', 'triangle'],
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.3,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00ff9d',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'grab'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        }
    },
    retina_detect: true
});

// App Navigation and Classic iOS Interactions
document.addEventListener('DOMContentLoaded', () => {
    const appIcons = document.querySelectorAll('.app-icon');
    const appContainers = document.querySelectorAll('.app-container');
    const backButtons = document.querySelectorAll('.back-button');

    // Update time with classic iOS format
    function updateTime() {
        const timeElement = document.querySelector('.time');
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    updateTime();
    setInterval(updateTime, 1000);

    // Classic iOS App Launch Animation
    function launchApp(appName) {
        const targetApp = document.getElementById(`${appName}-app`);
        const icon = document.querySelector(`[data-app="${appName}"]`);
        
        // Scale animation for icon
        icon.style.transform = 'scale(0.8)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 150);

        // Slide in animation for app
        appContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        targetApp.classList.add('active');
        
        // Add classic iOS launch sound
        const launchSound = new Audio('assets/sounds/launch.mp3');
        launchSound.volume = 0.5;
        launchSound.play().catch(() => {}); // Ignore errors if sound fails to play
    }

    // App Icon Click Handler
    appIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const appName = icon.getAttribute('data-app');
            launchApp(appName);
        });
    });

    // Back Button Handler with Classic iOS Animation
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentApp = button.closest('.app-container');
            currentApp.style.transform = 'translateX(100%)';
            setTimeout(() => {
                currentApp.classList.remove('active');
                currentApp.style.transform = '';
            }, 300);
        });
    });

    // Classic iOS Swipe Navigation
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const activeApp = document.querySelector('.app-container.active');
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - go back
            if (activeApp) {
                const backButton = activeApp.querySelector('.back-button');
                if (backButton) backButton.click();
            }
        }
    }

    // Initialize Cydia Package List
    function initializeCydia() {
        const packageList = document.querySelector('.package-list');
        if (packageList) {
            const packages = [
                { name: 'WinterBoard', version: '0.9.3915', description: 'Theme manager for iOS' },
                { name: 'OpenSSH', version: '6.7p1-13', description: 'Secure shell access' },
                { name: 'MobileTerminal', version: '520-2', description: 'Terminal emulator' },
                { name: 'SBSettings', version: '3.3.7', description: 'Quick settings toggles' }
            ];

            packages.forEach(pkg => {
                const packageElement = document.createElement('div');
                packageElement.className = 'package-item';
                packageElement.innerHTML = `
                    <div class="package-info">
                        <h4>${pkg.name}</h4>
                        <p>${pkg.description}</p>
                    </div>
                    <div class="package-version">${pkg.version}</div>
                `;
                packageList.appendChild(packageElement);
            });
        }
    }

    // Initialize WinterBoard Themes
    function initializeWinterBoard() {
        const themeList = document.querySelector('.theme-list');
        if (themeList) {
            const themes = [
                { name: 'Astro Boy', active: true },
                { name: 'Classic iOS', active: false },
                { name: 'Cosmic', active: false },
                { name: 'Wire Frame', active: false }
            ];

            themes.forEach(theme => {
                const themeElement = document.createElement('div');
                themeElement.className = `theme-item ${theme.active ? 'active' : ''}`;
                themeElement.innerHTML = `
                    <div class="theme-info">
                        <h4>${theme.name}</h4>
                    </div>
                    <div class="theme-toggle">
                        <div class="toggle-switch ${theme.active ? 'active' : ''}"></div>
                    </div>
                `;
                themeList.appendChild(themeElement);
            });
        }
    }

    // Initialize Settings
    function initializeSettings() {
        const settingsList = document.querySelector('.settings-list');
        if (settingsList) {
            const settings = [
                { name: 'Theme', value: 'Astro Boy' },
                { name: 'Background', value: 'Cosmic' },
                { name: 'Animations', value: 'Enabled' },
                { name: 'Sound Effects', value: 'Enabled' }
            ];

            settings.forEach(setting => {
                const settingElement = document.createElement('div');
                settingElement.className = 'setting-item';
                settingElement.innerHTML = `
                    <div class="setting-info">
                        <h4>${setting.name}</h4>
                    </div>
                    <div class="setting-value">
                        <span>${setting.value}</span>
                        <span class="chevron">›</span>
                    </div>
                `;
                settingsList.appendChild(settingElement);
            });
        }
    }

    // Initialize all components
    initializeCydia();
    initializeWinterBoard();
    initializeSettings();

    // Voice Command Integration
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
            handleVoiceCommand(command);
        };

        function handleVoiceCommand(command) {
            if (command.includes('open music')) {
                document.getElementById('music-app').classList.add('active');
            } else if (command.includes('open human')) {
                document.getElementById('human-app').classList.add('active');
            } else if (command.includes('open journey')) {
                document.getElementById('journey-app').classList.add('active');
            } else if (command.includes('open game')) {
                document.getElementById('game-app').classList.add('active');
            } else if (command.includes('go back')) {
                const activeApp = document.querySelector('.app-container.active');
                if (activeApp) {
                    activeApp.classList.remove('active');
                }
            }
        }

        // Start voice recognition
        recognition.start();
    }
}); 