document.addEventListener("DOMContentLoaded", () => {
    // Initialize profile and other features once the DOM is fully loaded
    initializeProfile();
});

// Initial Profile Setup and Tabs
function initializeProfile() {
    setupMainTabs();
    setupNestedTabs();
    setupCopyToClipboard();
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

// Handle Copy to Clipboard
function setupCopyToClipboard() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const uidText = button.getAttribute('data-uid');
            copyToClipboard(uidText);
        });
    });
}

function copyToClipboard(uidText) {
    if (navigator.clipboard) {
        // Use Clipboard API (more modern and reliable)
        navigator.clipboard.writeText(uidText)
            .then(() => {
                // Show feedback message
                const feedback = document.querySelector('.copy-feedback');
                feedback.classList.add('show');
                
                // Hide feedback message after 2 seconds
                setTimeout(() => {
                    feedback.classList.remove('show');
                }, 2000);
            })
            .catch(err => {
                // Handle the error if copying fails
                console.error('Failed to copy text: ', err);
            });
    } else {
        // Fallback to older method if Clipboard API is not supported
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = uidText;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Show feedback message
        const feedback = document.querySelector('.copy-feedback');
        feedback.classList.add('show');
        
        // Hide feedback message after 2 seconds
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    }
}



