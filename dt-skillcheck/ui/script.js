const skillCheck = new Vue({
    el: '.main-skillcheck',
    data: {
        active: false,
        rotation: 191,
        rotationSpeed: 1,
        isRotating: true,
        successZone: Math.floor(Math.random() * 360),
        gameActive: true,
        infoText: 'Press Space',
        infoSpanHtml: 'When the white pointer<br>lines up with the highlighted area,<br>press space!',
        defaultSpeed: 3,
        minSpeed: 1,
        maxSpeed: 10
    },
    mounted() {
        ['keydown', 'message'].forEach(event => {
            window.addEventListener(event, event === 'keydown' ? this.handleKeydown : this.onMessage);
        });
    },
    methods: {
        async post(url, data = {}) {
            const response = await fetch(`https://${GetParentResourceName()}/${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            return await response.json();
        },

        onMessage(event) {
            const { interface: ui, action, toggle, speed } = event.data;

            if (ui === 'skillcheck' && action === 'show') {
                this.active = true;
                this.rotationSpeed = Math.min(Math.max(speed || this.defaultSpeed, this.minSpeed), this.maxSpeed);
                
                this.setSuccessZone();
                this.rotate();
            }
        },

        setSuccessZone() {
            const circle = document.querySelector('.skillcheck-circle-point');
            circle.style.transform = `rotateZ(${this.successZone}deg)`;
        },

        rotate() {
            if (!this.isRotating) return;
            
            this.rotation = (this.rotation + this.rotationSpeed) % 360;
            const pointer = document.querySelector('.skillcheck-circle > span');
            pointer.style.transform = `rotateZ(${this.rotation}deg)`;

            requestAnimationFrame(this.rotate);
        },

        handleKeydown(e) {
            if (!this.gameActive || e.code !== 'Space') return;
            
            this.isRotating = false;
            this.gameActive = false;
            
            const difference = Math.abs(this.rotation - this.successZone);
            const isSuccess = difference <= 30 || difference >= 345;

            const infoText = document.querySelector('.skillcheck-info p');
            const infoSpan = document.querySelector('.skillcheck-info span');

            infoText.textContent = this.infoText;
            infoSpan.innerHTML = this.infoSpanHtml;

            this.post('skillcheckResult', [isSuccess]);

            setTimeout(() => {
                this.active = false;
                this.rotation = 191;
                this.successZone = Math.floor(Math.random() * 360);
                this.setSuccessZone();

                this.infoText = 'Press Space';
                this.infoSpanHtml = 'When the white pointer<br>lines up with the highlighted area,<br>press space!';
                infoText.textContent = this.infoText;
                infoSpan.innerHTML = this.infoSpanHtml;

                this.isRotating = true;
                this.gameActive = true;
            }, 2000);
        }
    },
});
