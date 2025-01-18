document.addEventListener('DOMContentLoaded', () => {
    function moveToNext(current, nextFieldId) {
        if (current.value.length === 1 && nextFieldId) {
            document.getElementById(nextFieldId).focus();
        }
    }

    function combineOtp() {
        const otp = Array.from(document.querySelectorAll('.otp-input'))
            .map(input => input.value)
            .join('');
        document.getElementById('otp-field').value = otp;
    }

    document.getElementById('otp-form').addEventListener('submit', (e) => {
        e.preventDefault();
        combineOtp();
        e.target.submit();
    });
});






