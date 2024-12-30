document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');

    function switchTab(tabId) {
        // Update navigation items
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tab === tabId) {
                item.classList.add('active');
            }
        });

        // Update tab content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === tabId) {
                content.classList.add('active');
            }
        });

        // Update page title
        pageTitle.textContent = tabId.charAt(0).toUpperCase() + tabId.slice(1);
        
        // Trigger animation
        pageTitle.style.animation = 'none';
        pageTitle.offsetHeight; // Trigger reflow
        pageTitle.style.animation = 'fadeIn 0.5s ease-out';
    }

    // Add click event listeners to navigation items
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.dataset.tab;
            switchTab(tabId);
        });
    });
});