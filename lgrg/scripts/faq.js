document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        document.getElementById('email').textContent = userEmail;
        localStorage.setItem('userEmail', email);
    }
    const emailLink = document.getElementById('email');
    emailLink.addEventListener('click', function(event) {
        event.preventDefault(); 
        const linkText = emailLink.textContent || emailLink.innerText;
        localStorage.setItem('userEmail', linkText);
        window.location.href = '/main'; 
    });
});
