document.addEventListener("DOMContentLoaded", () => {
    // Initialize profile and other features once the DOM is fully loaded
    initializeProfile();
});

// Initial Profile Setup and Tabs
function initializeProfile() {
    setupMainTabs();
    setupNestedTabs();
    copyToClipboard();
}

// Main Tabs Switching
function setupMainTabs() {
    const tabs = document.querySelectorAll('.nav-item');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove 'active' class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Hide all tab content with fade-out effect
            contents.forEach(content => {
                content.classList.remove('active');
                content.style.animation = 'fadeOut 0.3s ease-out'; // Trigger fade-out animation
            });

            // Add fade-in effect to target content
            const target = document.getElementById(tab.dataset.tab);
            if (target) {
                target.style.animation = 'none'; // Reset animation
                target.offsetHeight; // Trigger reflow to restart the animation
                target.style.animation = 'fadeIn 0.5s ease-out'; // Apply fade-in animation
                target.classList.add('active');
            }
        });
    });
}

// Nested Tabs Switching (Settings)
function setupNestedTabs() {
    const nestedTabs = document.querySelectorAll('.nested-nav-item');
    const nestedContents = document.querySelectorAll('.nested-tab-content');

    nestedTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            nestedTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            nestedContents.forEach(content => content.classList.remove('active'));
            const target = document.getElementById(tab.dataset.tab);
            if (target) {
                target.classList.add('active');
            }
        });
    });
}



