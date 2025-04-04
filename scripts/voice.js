class VoiceController {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.commands = {
            'open music': () => this.openApp('music'),
            'open human': () => this.openApp('human'),
            'open journey': () => this.openApp('journey'),
            'open game': () => this.openApp('game'),
            'go back': () => this.goBack(),
            'play music': () => this.controlMusic('play'),
            'pause music': () => this.controlMusic('pause'),
            'next track': () => this.controlMusic('next'),
            'show map': () => this.showMap(),
            'hide map': () => this.hideMap(),
            'show achievements': () => this.showAchievements(),
            'hide achievements': () => this.hideAchievements()
        };

        this.initializeVoiceRecognition();
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceStatus(true);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceStatus(false);
                // Restart recognition if it was intentionally stopped
                if (this.isListening) {
                    this.recognition.start();
                }
            };

            this.recognition.onresult = (event) => {
                const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
                this.handleCommand(command);
            };

            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                this.updateVoiceStatus(false);
            };
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
        }
    }

    handleCommand(command) {
        // Check for exact matches first
        if (this.commands[command]) {
            this.commands[command]();
            return;
        }

        // Check for partial matches
        for (const [key, action] of Object.entries(this.commands)) {
            if (command.includes(key)) {
                action();
                return;
            }
        }
    }

    openApp(appName) {
        const app = document.getElementById(`${appName}-app`);
        if (app) {
            document.querySelectorAll('.app-container').forEach(container => {
                container.classList.remove('active');
            });
            app.classList.add('active');
        }
    }

    goBack() {
        const activeApp = document.querySelector('.app-container.active');
        if (activeApp) {
            activeApp.classList.remove('active');
        }
    }

    controlMusic(action) {
        const audioPlayer = window.audioPlayer;
        if (!audioPlayer) return;

        switch (action) {
            case 'play':
                if (!audioPlayer.isPlaying) {
                    audioPlayer.togglePlay();
                }
                break;
            case 'pause':
                if (audioPlayer.isPlaying) {
                    audioPlayer.togglePlay();
                }
                break;
            case 'next':
                audioPlayer.nextTrack();
                break;
        }
    }

    showMap() {
        const journeyApp = document.getElementById('journey-app');
        if (journeyApp) {
            journeyApp.classList.add('active');
            // Trigger map display logic here
        }
    }

    hideMap() {
        const journeyApp = document.getElementById('journey-app');
        if (journeyApp) {
            journeyApp.classList.remove('active');
        }
    }

    showAchievements() {
        const gameApp = document.getElementById('game-app');
        if (gameApp) {
            gameApp.classList.add('active');
            // Trigger achievements display logic here
        }
    }

    hideAchievements() {
        const gameApp = document.getElementById('game-app');
        if (gameApp) {
            gameApp.classList.remove('active');
        }
    }

    updateVoiceStatus(isListening) {
        // Add visual feedback for voice recognition status
        const statusBar = document.querySelector('.status-bar');
        if (statusBar) {
            const voiceIndicator = statusBar.querySelector('.voice-indicator') || document.createElement('div');
            voiceIndicator.className = 'voice-indicator';
            voiceIndicator.style.width = '10px';
            voiceIndicator.style.height = '10px';
            voiceIndicator.style.borderRadius = '50%';
            voiceIndicator.style.backgroundColor = isListening ? '#00ff9d' : 'transparent';
            voiceIndicator.style.marginLeft = '5px';
            
            if (!statusBar.querySelector('.voice-indicator')) {
                statusBar.querySelector('.status-icons').appendChild(voiceIndicator);
            }
        }
    }
}

// Initialize voice controller when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.voiceController = new VoiceController();
    window.voiceController.startListening();
}); 