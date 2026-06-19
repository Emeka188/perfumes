const themeToggle = document.getElementById('themeToggle');
const sendBtn = document.getElementById('sendBtn');
const copyEmail = document.getElementById('copyEmail');
const emailAddress = 'mekusofili@gmail.com';

const updateTheme = () => {
    document.body.classList.toggle('light-theme');
    themeToggle.textContent = document.body.classList.contains('light-theme') ? '☀' : '☾';
};

themeToggle?.addEventListener('click', updateTheme);

if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields before sending.');
            return;
        }

        alert(`Thanks ${name}! Your message is ready to send. Please email me at ${emailAddress} if you want direct contact.`);
    });
}

if (copyEmail) {
    copyEmail.addEventListener('click', (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(emailAddress).then(() => {
            copyEmail.textContent = 'Copied!';
            setTimeout(() => {
                copyEmail.textContent = 'Copy Email';
            }, 1800);
        });
    });
}

const directEmailLink = document.getElementById('directEmailLink');
if (directEmailLink) {
    directEmailLink.addEventListener('click', () => {
        directEmailLink.href = `mailto:${emailAddress}?subject=Front-End%20Opportunity`;
    });
}
