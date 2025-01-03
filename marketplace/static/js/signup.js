document.addEventListener('DOMContentLoaded', function() {
    const avatarImg = document.getElementById('avatar-img');
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarOptions = document.getElementById('avatar-options');
    const profilePictureInput = document.getElementById('profile-picture');
    const avatarChoices = document.querySelectorAll('.avatar-choice');

    // Function to trigger the file input when clicking on the avatar container
    function triggerFileInput() {
        profilePictureInput.click(); // Simulate clicking the file input
    }

    // Function to update the avatar when a file is selected
    function updateAvatarFromFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarImg.src = e.target.result; // Update the profile image preview
            };
            reader.readAsDataURL(file); // Read the file as a DataURL (image)
        }
    }

    // Function to randomly select an avatar
    function selectRandomAvatar() {
        const randomIndex = Math.floor(Math.random() * avatarChoices.length);
        const randomAvatar = avatarChoices[randomIndex].querySelector('img');
        updateAvatar(randomAvatar.src);
    }

    // Function to update the selected avatar and set it in the file input
    function updateAvatar(avatarSrc) {
        avatarImg.src = avatarSrc;

        // Update the file input field with the selected avatar
        const avatarFile = new File([new Blob()], avatarSrc.split('/').pop(), { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(avatarFile);
        profilePictureInput.files = dataTransfer.files; // Set the selected file to the file input
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

