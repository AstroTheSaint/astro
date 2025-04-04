class AudioPlayer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.isPlaying = false;
        this.currentTrack = null;

        this.initializePlayer();
        this.setupVisualizer();
    }

    initializePlayer() {
        this.playPauseBtn = document.querySelector('.play-pause');
        this.nextBtn = document.querySelector('.next');
        this.trackTitle = document.querySelector('.track-title');
        this.visualizer = document.querySelector('.visualizer');

        this.playPauseBtn.addEventListener('click', () => this.togglePlay());
        this.nextBtn.addEventListener('click', () => this.nextTrack());

        // Initialize with first track
        this.loadTrack('https://untitled.stream/library/project/gSWQRE1djzq3avmuMaeog');
    }

    setupVisualizer() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        this.visualizer.appendChild(canvas);

        canvas.width = this.visualizer.clientWidth;
        canvas.height = this.visualizer.clientHeight;

        const draw = () => {
            requestAnimationFrame(draw);

            this.analyser.getByteFrequencyData(this.dataArray);

            ctx.fillStyle = 'rgb(26, 26, 46)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / this.bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for(let i = 0; i < this.bufferLength; i++) {
                barHeight = this.dataArray[i] / 2;

                const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
                gradient.addColorStop(0, '#00ff9d');
                gradient.addColorStop(1, '#ff6b6b');

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();
    }

    async loadTrack(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            this.currentTrack = {
                buffer: audioBuffer,
                url: url
            };

            this.trackTitle.textContent = 'Now Playing: Track from Untitled Stream';
            this.setupAudioGraph();
        } catch (error) {
            console.error('Error loading track:', error);
            this.trackTitle.textContent = 'Error loading track';
        }
    }

    setupAudioGraph() {
        const source = this.audioContext.createBufferSource();
        source.buffer = this.currentTrack.buffer;
        source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.source = source;
    }

    togglePlay() {
        if (!this.currentTrack) return;

        if (this.isPlaying) {
            this.source.stop();
            this.playPauseBtn.textContent = '▶';
        } else {
            this.setupAudioGraph();
            this.source.start(0);
            this.playPauseBtn.textContent = '⏸';
        }

        this.isPlaying = !this.isPlaying;
    }

    nextTrack() {
        // In a real implementation, this would load the next track from a playlist
        this.togglePlay();
        this.loadTrack(this.currentTrack.url);
    }
}

// Initialize audio player when the music app is opened
document.addEventListener('DOMContentLoaded', () => {
    let audioPlayer = null;

    document.querySelector('[data-app="music"]').addEventListener('click', () => {
        if (!audioPlayer) {
            audioPlayer = new AudioPlayer();
        }
    });
}); 