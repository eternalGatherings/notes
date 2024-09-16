document.addEventListener('DOMContentLoaded', () => {
    // Get all elements with the class `js-clipboard-copy`
    const clipboardButtons = document.querySelectorAll('.js-clipboard-copy');

    clipboardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('value');
            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('Text copied to clipboard');
                // Show copied feedback
                button.querySelector('.js-clipboard-check-icon').classList.remove('d-none');
                button.querySelector('.js-clipboard-copy-icon').classList.add('d-none');
                setTimeout(() => {
                    button.querySelector('.js-clipboard-check-icon').classList.add('d-none');
                    button.querySelector('.js-clipboard-copy-icon').classList.remove('d-none');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    });
});