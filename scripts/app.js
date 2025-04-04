// Initialize particles.js
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#00ff9d'
        },
        shape: {
            type: 'circle'
        },
        opacity: {
            value: 0.5,
            random: false
        },
        size: {
            value: 3,
            random: true
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#00ff9d',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
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

// App Navigation
document.addEventListener('DOMContentLoaded', () => {
    const appIcons = document.querySelectorAll('.app-icon');
    const appContainers = document.querySelectorAll('.app-container');
    const backButtons = document.querySelectorAll('.back-button');

    // Update time
    function updateTime() {
        const timeElement = document.querySelector('.time');
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    updateTime();
    setInterval(updateTime, 1000);

    // App Navigation
    appIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const appName = icon.getAttribute('data-app');
            const targetApp = document.getElementById(`${appName}-app`);
            
            appContainers.forEach(container => {
                container.classList.remove('active');
            });
            
            targetApp.classList.add('active');
        });
    });

    // Back Button Navigation
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentApp = button.closest('.app-container');
            currentApp.classList.remove('active');
        });
    });

    // Swipe Navigation
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
                activeApp.classList.remove('active');
            }
        }
    }

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