document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault(); 
        const email = document.getElementById('Email').value;
        const password = document.getElementById('Password').value;
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Email: email, Password: password})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('userEmail', email);
                window.location.href = '/main'; 
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Ошибка при входе в систему:', error));
    });
});