document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.otp-input');
    const hiddenOtp = document.getElementById('hidden-otp');
    const countdownElement = document.getElementById('countdown');
    let remainingSeconds = parseInt(countdownElement.dataset.remainingSeconds, 10);

    // Function to move focus to the next input
    function moveToNext(current, nextId) {
        if (current.value.length === 1) {
            const nextInput = document.getElementById(nextId);
            if (nextInput) {
                nextInput.focus();
            }
        }
        combineOtp();
    }

    // Function to combine OTP values into the hidden input
    function combineOtp() {
        hiddenOtp.value = Array.from(inputs).map(input => input.value).join('');
    }

    // Countdown timer function
    function updateCountdown() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            countdownElement.textContent = "00:00";
            clearInterval(countdownInterval);
            alert("Your OTP has expired. Please request a new one.");
            sessionStorage.removeItem('otpSessionActive');
            window.location.href = '/'; // Redirect to signup
        }
    }

    // Attach event listeners to OTP inputs
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            const nextId = `otp${index + 2}`;
            moveToNext(input, nextId);
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && input.value.length === 0) {
                const prevId = `otp${index}`;
                const prevInput = document.getElementById(prevId);
                if (prevInput) {
                    prevInput.focus();
                }
            }
        });
    });

    // Start countdown
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Prevent refresh or navigation away
    window.addEventListener('beforeunload', (event) => {
        event.preventDefault();
        event.returnValue = '';
    });

    // Mark session as active
    sessionStorage.setItem('otpSessionActive', 'true');
});
