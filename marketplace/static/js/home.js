document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const toggleBtn = document.getElementById('toggleFilterBtn');
    const filterContent = document.getElementById('filterContent');
    const profileLink = document.getElementById('profile-link');
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('message-popup');
    const closePopupButton = document.getElementById('close-popup');
    const selectedFiltersContainer = document.getElementById('selectedFilters');
    const filterOptions = document.querySelectorAll('.filter-options input[type="checkbox"]');

    // Get the user authentication status from the data attribute
    const isAuthenticated = document.body.getAttribute('data-authenticated') === 'true';

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(18, 18, 18, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = 'var(--surface-dark)';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Toggle filter content
    toggleBtn.addEventListener('click', function() {
        filterContent.classList.toggle('expanded');
        toggleBtn.textContent = filterContent.classList.contains('expanded') ? "Hide Filters" : "Show Filters";
    });

    // Handle filter selection and dynamic display
    filterOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                // Create a tag for the selected filter
                const filterTag = document.createElement('div');
                filterTag.className = 'filter-tag';
                filterTag.textContent = this.value;

                // Add a remove button to the tag
                const removeButton = document.createElement('span');
                removeButton.textContent = '×';
                removeButton.className = 'remove-filter';
                removeButton.addEventListener('click', () => {
                    filterTag.remove();
                    this.checked = false; // Uncheck the checkbox
                });

                filterTag.appendChild(removeButton);
                selectedFiltersContainer.appendChild(filterTag);
            }
        });
    });

    // Profile link click handler
    profileLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isAuthenticated) {
            // Show the popup and overlay for unauthenticated users
            overlay.style.display = 'block';
            popup.style.display = 'block';
        } else {
            // Redirect to profile if authenticated
            window.open('/profile/', '_blank');
        }
    });

    // Close the popup when the "close" button is clicked
    closePopupButton.addEventListener('click', function() {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    });

    // Close the popup when clicking outside
    overlay.addEventListener('click', function() {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    });

    // Animate product cards on scroll
    const productCards = document.querySelectorAll('.product-card');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    // Text Scramble Effect
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => (this.resolve = resolve));
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Text Scramble Example
    const phrases = ['ANK_STUDIOS.', 'MARKETPLACE.'];

    const el = document.querySelector('.text');
    const fx = new TextScramble(el);

    let counter = 0;
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 5000);
        });
        counter = (counter + 1) % phrases.length;
    };

    next();
});
