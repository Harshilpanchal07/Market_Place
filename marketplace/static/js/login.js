class StrokeAnimation {
    constructor(container, letters = ['A', 'N', 'K']) {
        this.container = container;
        this.letters = letters;
        this.init();
    }

    createLetter(letter, delay) {
        const wrapper = document.createElement('div');
        wrapper.className = 'letter-wrapper';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '128');
        svg.setAttribute('height', '128');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.classList.add('letter-svg');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '50');
        text.setAttribute('y', '70');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'none');
        text.setAttribute('stroke', '#10b981');
        text.setAttribute('stroke-width', '2');
        text.classList.add('stroke-text');
        text.style.fontSize = '70px';
        text.style.animationDelay = `${delay}s`;
        text.textContent = letter;

        // Add glow effect
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', `glow-${letter}`);
        
        const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
        feGaussianBlur.setAttribute('stdDeviation', '4');
        feGaussianBlur.setAttribute('result', 'coloredBlur');
        
        filter.appendChild(feGaussianBlur);
        defs.appendChild(filter);
        svg.appendChild(defs);
        
        text.style.filter = `url(#glow-${letter})`;
        
        svg.appendChild(text);
        wrapper.appendChild(svg);
        return wrapper;
    }

    init() {
        this.render();
        setInterval(() => this.render(), 6000);  // Repeat every 10 seconds
        new FallingStars();
    }

    render() {
        this.container.innerHTML = '';
        this.letters.forEach((letter, index) => {
            const letterElement = this.createLetter(letter, index * 0.9);
            this.container.appendChild(letterElement);
        });
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('lettersContainer');
    new StrokeAnimation(container);
});
