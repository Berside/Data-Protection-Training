document.addEventListener('DOMContentLoaded', function() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
            document.getElementById('user-email').textContent = userEmail;
        }
    fetch(`/user-level?email=${encodeURIComponent(userEmail)}`)
        .then(response => response.json())
        .then(data => {
            let isAdminText = '';
            switch (String(data.level)) { 
                case '3': 
                    isAdminText = 'Администратор';
                    break;
                case '2':
                    isAdminText = 'Модератор';
                    break;
                case '1':
                    isAdminText = 'Хелпер';
                    break;
                default:
                    isAdminText = 'Нет';
            }
            document.getElementById('user-level').textContent = isAdminText;
        })
        .catch(error => console.error('Error fetching user level:', error));
});