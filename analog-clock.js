// ============================================
// ANALOG CLOCK - FULL FEATURED
// ============================================

class AnalogClock {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.currentTime = new Date();
        this.paused = false;
        this.pausedTime = null;
        this.speed = 1;
        this.showSeconds = true;
        this.theme = 'classic';
        this.timezone = 'local';
        this.animationId = null;
        
        this.themes = {
            classic: {
                faceColor: '#ffffff',
                numberColor: '#000000',
                hourHandColor: '#333333',
                minuteHandColor: '#555555',
                secondHandColor: '#e74c3c',
                tickColor: '#000000',
                outerRing: '#667eea',
                shadow: 'rgba(0, 0, 0, 0.2)'
            },
            dark: {
                faceColor: '#1a1a1a',
                numberColor: '#ffffff',
                hourHandColor: '#ffffff',
                minuteHandColor: '#cccccc',
                secondHandColor: '#ff6b6b',
                tickColor: '#ffffff',
                outerRing: '#333333',
                shadow: 'rgba(255, 255, 255, 0.2)'
            },
            modern: {
                faceColor: '#f8f9fa',
                numberColor: '#2c3e50',
                hourHandColor: '#3498db',
                minuteHandColor: '#2980b9',
                secondHandColor: '#e74c3c',
                tickColor: '#34495e',
                outerRing: '#3498db',
                shadow: 'rgba(52, 152, 219, 0.15)'
            },
            neon: {
                faceColor: '#0a0e27',
                numberColor: '#00ff88',
                hourHandColor: '#ff006e',
                minuteHandColor: '#00d9ff',
                secondHandColor: '#ffbe0b',
                tickColor: '#00ff88',
                outerRing: '#ff006e',
                shadow: 'rgba(0, 255, 136, 0.3)'
            }
        };
        
        this.timezoneOffsets = {
            'local': 0,
            'utc': 0,
            'est': -5,
            'pst': -8,
            'gmt': 0,
            'ist': 5.5,
            'jst': 9
        };
        
        this.init();
    }
    
    init() {
        // make canvas size responsive to container and device pixel ratio
        this.resizeCanvas();
        // handle resize / orientation changes
        window.addEventListener('resize', () => {
            // small debounce
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => this.resizeCanvas(), 120);
        });
        window.addEventListener('orientationchange', () => this.resizeCanvas());

        this.setupEventListeners();
        this.drawClock();
        this.animate();
    }

    resizeCanvas() {
        try {
            const container = this.canvas.parentElement || document.body;
            // choose a square size based on container width, but limit to viewport
            const maxWidth = Math.min(container.clientWidth, window.innerWidth * 0.9);
            const size = Math.max(160, Math.min(600, maxWidth));
            this.dpr = window.devicePixelRatio || 1;
            // set CSS size
            this.canvas.style.width = size + 'px';
            this.canvas.style.height = size + 'px';
            // set backing store size
            this.canvas.width = Math.round(size * this.dpr);
            this.canvas.height = Math.round(size * this.dpr);
            // scale context so drawing uses CSS pixels
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            // redraw immediately
            this.drawClock();
        } catch (err) {
            console.warn('resizeCanvas failed', err);
        }
    }
    
    setupEventListeners() {
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.theme = e.target.value;
            this.updateTheme();
        });
        
        document.getElementById('speedControl').addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = this.speed + 'x';
        });
        
        document.getElementById('analogToggle').addEventListener('change', (e) => {
            this.canvas.style.display = e.target.checked ? 'block' : 'none';
        });
        
        document.getElementById('digitalToggle').addEventListener('change', (e) => {
            document.querySelector('.digital-display').style.display = e.target.checked ? 'block' : 'none';
        });
        
        document.getElementById('secondsToggle').addEventListener('change', (e) => {
            this.showSeconds = e.target.checked;
        });
        
        document.getElementById('timeZoneSelect').addEventListener('change', (e) => {
            this.timezone = e.target.value;
            this.updateTimezoneDisplay();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });

        // Mobile: controls toggle
        const controlsToggle = document.getElementById('controlsToggle');
        const controlsPanel = document.querySelector('.controls-panel');
        if (controlsToggle && controlsPanel) {
            // start collapsed on narrow screens
            if (window.innerWidth <= 768) {
                controlsPanel.classList.add('collapsed');
                controlsToggle.setAttribute('aria-expanded', 'false');
            }
            controlsToggle.addEventListener('click', () => {
                const collapsed = controlsPanel.classList.toggle('collapsed');
                controlsToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
            });
        }
    }
    
    updateTheme() {
        this.drawClock();
        const container = document.querySelector('.clock-container');
        const theme = this.themes[this.theme];
        container.style.backgroundColor = theme.faceColor === '#0a0e27' ? '#1a1a2e' : theme.faceColor;
    }
    
    togglePause() {
        this.paused = !this.paused;
        const btn = document.getElementById('pauseBtn');
        btn.textContent = this.paused ? 'Resume' : 'Pause';
        if (this.paused) {
            this.pausedTime = new Date(this.currentTime);
        }
    }
    
    reset() {
        this.paused = false;
        this.pausedTime = null;
        document.getElementById('pauseBtn').textContent = 'Pause';
    }
    
    updateTimezoneDisplay() {
        const tzNames = {
            'local': 'Local Time',
            'utc': 'UTC',
            'est': 'EST (UTC-5)',
            'pst': 'PST (UTC-8)',
            'gmt': 'GMT (UTC+0)',
            'ist': 'IST (UTC+5:30)',
            'jst': 'JST (UTC+9)'
        };
        document.getElementById('currentTZ').textContent = tzNames[this.timezone];
    }
    
    getDisplayTime() {
        let time;
        if (this.paused) {
            time = this.pausedTime;
        } else {
            time = new Date(this.currentTime);
        }
        
        if (this.timezone !== 'local') {
            const offset = this.timezoneOffsets[this.timezone];
            const utcTime = time.getTime() + time.getTimezoneOffset() * 60000;
            time = new Date(utcTime + offset * 3600000);
        }
        
        return time;
    }
    
    animate() {
        if (!this.paused) {
            this.currentTime = new Date(this.currentTime.getTime() + (1000 / 60) * this.speed);
        }
        
        this.drawClock();
        this.updateDigitalDisplay();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateDigitalDisplay() {
        const time = this.getDisplayTime();
        const hours = String(time.getHours()).padStart(2, '0');
        const minutes = String(time.getMinutes()).padStart(2, '0');
        const seconds = String(time.getSeconds()).padStart(2, '0');
        document.getElementById('digitalDisplay').textContent = `${hours}:${minutes}:${seconds}`;
        document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    drawClock() {
        const logicalWidth = this.canvas.width / (this.dpr || 1);
        const logicalHeight = this.canvas.height / (this.dpr || 1);
        const centerX = logicalWidth / 2;
        const centerY = logicalHeight / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        const theme = this.themes[this.theme];
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw outer ring
        this.ctx.fillStyle = theme.outerRing;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius + 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw clock face
        this.ctx.fillStyle = theme.faceColor;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw shadow
        this.ctx.shadowColor = theme.shadow;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 5;
        
        // Draw hour markers
        this.drawHourMarkers(centerX, centerY, radius, theme);
        
        // Draw numbers
        this.drawNumbers(centerX, centerY, radius, theme);
        
        // Get current time
        const time = this.getDisplayTime();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        
        // Calculate smooth angles
        const secondAngle = (seconds + milliseconds / 1000) / 60 * Math.PI * 2;
        const minuteAngle = (minutes + seconds / 60) / 60 * Math.PI * 2;
        const hourAngle = (hours % 12 + minutes / 60) / 12 * Math.PI * 2;
        
        // Draw hour hand
        this.drawHand(centerX, centerY, hourAngle, radius * 0.5, 7, theme.hourHandColor);
        
        // Draw minute hand
        this.drawHand(centerX, centerY, minuteAngle, radius * 0.7, 5, theme.minuteHandColor);
        
        // Draw second hand
        if (this.showSeconds) {
            this.drawHand(centerX, centerY, secondAngle, radius * 0.8, 2, theme.secondHandColor);
        }
        
        // Draw center dot
        this.ctx.fillStyle = theme.numberColor;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowColor = 'transparent';
    }
    
    drawHourMarkers(centerX, centerY, radius, theme) {
        this.ctx.strokeStyle = theme.tickColor;
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const isHour = i % 5 === 0;
            const length = isHour ? 15 : 8;
            
            const x1 = centerX + (radius - length) * Math.sin(angle);
            const y1 = centerY - (radius - length) * Math.cos(angle);
            const x2 = centerX + radius * Math.sin(angle);
            const y2 = centerY - radius * Math.cos(angle);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }
    
    drawNumbers(centerX, centerY, radius, theme) {
        this.ctx.fillStyle = theme.numberColor;
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        for (let i = 1; i <= 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const x = centerX + (radius - 40) * Math.cos(angle);
            const y = centerY + (radius - 40) * Math.sin(angle);
            this.ctx.fillText(i.toString(), x, y);
        }
    }
    
    drawHand(centerX, centerY, angle, length, width, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = 'round';
        
        const x = centerX + length * Math.sin(angle);
        const y = centerY - length * Math.cos(angle);
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }
}

// Initialize clock when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const clock = new AnalogClock('clockCanvas');
});
