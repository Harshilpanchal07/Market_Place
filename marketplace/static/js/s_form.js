document.addEventListener('DOMContentLoaded', () => {
    // Initialize Stroke Animation
    const container = document.getElementById('lettersContainer');
    new StrokeAnimation(container);

    // Add event listener for form submission
    const sellerForm = document.getElementById('sellerForm');
    if (sellerForm) {
        sellerForm.addEventListener('submit', function (e) {
            const agreeTerms = document.getElementById('agree_terms');
            if (!agreeTerms.checked) {
                e.preventDefault(); // Prevent form submission
                alert('You must agree to all terms and conditions before submitting.');
            }
        });
    }
});
