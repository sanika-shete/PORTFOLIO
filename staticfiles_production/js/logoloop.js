class LogoLoop {
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({
            speed: 100,
            direction: 'left',
            hoverSpeed: 0,
            gap: 32,
            minCopies: 2
        }, options);

        this.track = this.element.querySelector('.logoloop__track');
        this.originalList = this.element.querySelector('.logoloop__list');
        this.lists = [this.originalList];

        this.offset = 0;
        this.velocity = 0;
        this.lastTimestamp = null;
        this.isHovered = false;
        this.rafId = null;

        this.init();
    }

    init() {
        // Set CSS variables
        this.element.style.setProperty('--logoloop-gap', `${this.options.gap}px`);

        // Hover events
        this.element.addEventListener('mouseenter', () => this.isHovered = true);
        this.element.addEventListener('mouseleave', () => this.isHovered = false);

        // Resize observer
        this.resizeObserver = new ResizeObserver(() => this.updateDimensions());
        this.resizeObserver.observe(this.element);

        // Initial update
        // We need to wait for images to load if any, but since we use icons mostly, it should be fine.
        // A small delay or requestAnimationFrame helps ensure layout is done.
        requestAnimationFrame(() => this.updateDimensions());

        // Start animation
        this.animate();
    }

    updateDimensions() {
        if (!this.element || !this.originalList) return;

        const containerWidth = this.element.clientWidth;
        // Calculate width including gap
        const listRect = this.originalList.getBoundingClientRect();
        const listWidth = listRect.width;

        if (listWidth === 0) return; // Not visible or empty

        // We need enough copies to cover the screen + buffer
        // The logic is: duplicate until total width > container width + listWidth (buffer)
        const copiesNeeded = Math.ceil(containerWidth / listWidth) + 2;

        // Add copies if needed
        while (this.lists.length < copiesNeeded) {
            const clone = this.originalList.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            this.track.appendChild(clone);
            this.lists.push(clone);
        }

        this.seqSize = listWidth; // This is the size of one full sequence
    }

    animate(timestamp) {
        if (!this.lastTimestamp) this.lastTimestamp = timestamp;
        const deltaTime = Math.max(0, (timestamp - this.lastTimestamp) || 0) / 1000;
        this.lastTimestamp = timestamp;

        // Calculate target velocity
        let targetSpeed = this.options.speed;
        if (this.isHovered && this.options.hoverSpeed !== undefined) {
            targetSpeed = this.options.hoverSpeed;
        }

        // Direction
        const directionMultiplier = this.options.direction === 'left' ? 1 : -1;
        const targetVelocity = Math.abs(targetSpeed) * directionMultiplier;

        // Smooth velocity transition (simple lerp)
        const smoothTau = 0.25;
        const easingFactor = 1 - Math.exp(-deltaTime / smoothTau);
        this.velocity += (targetVelocity - this.velocity) * easingFactor;

        // Update offset
        if (this.seqSize > 0) {
            this.offset += this.velocity * deltaTime;
            // Wrap around logic
            // If moving left (positive offset), we wrap when offset >= seqSize
            // If moving right (negative offset), we wrap when offset <= 0

            this.offset = ((this.offset % this.seqSize) + this.seqSize) % this.seqSize;

            this.track.style.transform = `translate3d(${-this.offset}px, 0, 0)`;
        }

        this.rafId = requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize all .logoloop elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.logoloop').forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 100;
        const direction = el.dataset.direction || 'left';
        const hoverSpeed = el.dataset.hoverSpeed !== undefined ? parseFloat(el.dataset.hoverSpeed) : 0;

        new LogoLoop(el, { speed, direction, hoverSpeed });
    });
});
