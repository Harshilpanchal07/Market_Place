document.addEventListener('DOMContentLoaded', function() {
    const avatarImg = document.getElementById('avatar-img');
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarOptions = document.getElementById('avatar-options');
    const profilePictureInput = document.getElementById('profile-picture');
    const avatarChoices = document.querySelectorAll('.avatar-choice');

    // Function to randomly select an avatar
    function selectRandomAvatar() {
        const randomIndex = Math.floor(Math.random() * avatarChoices.length);
        const randomAvatar = avatarChoices[randomIndex].querySelector('img');
        updateAvatar(randomAvatar.src);
    }

    // Function to update the selected avatar
    function updateAvatar(avatarSrc) {
        avatarImg.src = avatarSrc;
        profilePictureInput.value = avatarSrc.split('/').pop();  // Ensure this value is set
        console.log('Profile Picture Value:', profilePictureInput.value);  // Check this in the console
        hideAvatarOptions();
    }
    
    // Function to show avatar options
    function showAvatarOptions() {
        avatarOptions.style.display = 'flex';
    }

    // Function to hide avatar options
    function hideAvatarOptions() {
        avatarOptions.style.display = 'none';
    }

    // Event listener for avatar container click
    avatarContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        showAvatarOptions();
    });

    // Event listeners for avatar choices
    avatarChoices.forEach(choice => {
        choice.addEventListener('click', function(e) {
            e.stopPropagation();
            const avatarSrc = this.querySelector('img').src;
            updateAvatar(avatarSrc);
        });
    });

    // Hide avatar options when clicking outside
    document.addEventListener('click', function(e) {
        if (!avatarOptions.contains(e.target) && e.target !== avatarContainer) {
            hideAvatarOptions();
        }
    });

    // Initially hide avatar options
    hideAvatarOptions();

    // Randomly select an avatar on page load
    selectRandomAvatar();
});

