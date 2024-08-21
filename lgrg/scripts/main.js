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
            if (isAdminText === 'Хелпер') {
                fetch('/users')
                .then(response => response.json())
                .then(userData => {
                    const table = document.createElement('table');
                    table.id = 'user-data-table';
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    ['ID', 'Email', "Level"].forEach(headerText => {
                        const th = document.createElement('th');
                        th.textContent = headerText;
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);
                    const tbody = document.createElement('tbody');
                    userData.forEach(user => {
                        const tr = document.createElement('tr');
                        Object.entries(user).forEach(([key, value]) => {
                            if (key.toLowerCase() !== 'password') {
                                const td = document.createElement('td');
                                td.textContent = value;
                                tr.appendChild(td);
                            }
                        });
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);
                    document.body.appendChild(table);
                })
                .catch(error => console.error('Error fetching user data:', error));
            }
            if (isAdminText === 'Модератор') {
                fetch('/users')
                .then(response => response.json())
                .then(userData => {
                    const table = document.createElement('table');
                    table.id = 'user-data-table';
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    ['ID', 'Email', 'Level', 'Delete'].forEach(headerText => {
                        const th = document.createElement('th');
                        th.textContent = headerText;
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);
                    const tbody = document.createElement('tbody');
                    userData.forEach(user => {
                        const tr = document.createElement('tr');
                        Object.entries(user).forEach(([key, value]) => {
                            if (key.toLowerCase() !== 'password') {
                                const td = document.createElement('td');
                                td.textContent = value;
                                tr.appendChild(td);
                            }
                        });
                        if ((user.level !== 3) &&  (user.level !== 2))  {
                            const deleteIconTd = document.createElement('td');
                            const deleteIcon = document.createElement('img');
                            deleteIcon.src = 'imgs/remove.png'; 
                            deleteIcon.alt = 'Удалить пользователя';
                            deleteIcon.classList.add('delete-icon'); 
                            deleteIconTd.appendChild(deleteIcon);
                            deleteIcon.onclick = function() {
                                deleteUser(user.id); 
                            };
                            tr.appendChild(deleteIconTd);
                        }
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);
                    document.body.appendChild(table);
                })
                .catch(error => console.error('Error fetching user data:', error));
            }
            if (isAdminText === 'Администратор') {
                fetch('/users')
                    .then(response => response.json())
                    .then(userData => {
                        const table = document.createElement('table');
                        table.id = 'user-data-table';
                        const thead = document.createElement('thead');
                        const headerRow = document.createElement('tr');
                        ['ID', 'Email', 'Level', 'Delete'].forEach(headerText => {
                            const th = document.createElement('th');
                            th.textContent = headerText;
                            headerRow.appendChild(th);
                        });
                        thead.appendChild(headerRow);
                        table.appendChild(thead);
                        const tbody = document.createElement('tbody');
                        userData.forEach(user => {
                            const tr = document.createElement('tr');
                            Object.entries(user).forEach(([key, value]) => {
                                if (key.toLowerCase() !== 'password') {
                                    const td = document.createElement('td');
                                    td.textContent = value;
                                    tr.appendChild(td);
                                }
                            });
                            if ((user.level !== 3))  {
                                const deleteIconTd = document.createElement('td');
                                const deleteIcon = document.createElement('img');
                                deleteIcon.src = 'imgs/remove.png'; 
                                deleteIcon.alt = 'Удалить пользователя';
                                deleteIcon.classList.add('delete-icon'); 
                                deleteIconTd.appendChild(deleteIcon);
                                deleteIcon.onclick = function() {
                                    deleteUser(user.id); 
                                };
                                tr.appendChild(deleteIconTd);
                            }
                            tbody.appendChild(tr);
                        });
                        table.appendChild(tbody);
                        document.body.appendChild(table);
                    })
                    .catch(error => console.error('Error fetching user data:', error));
            }
        })
        .catch(error => console.error('Error fetching user level:', error));
});

function deleteUser(userId) {
    const currentUserId = localStorage.getItem('userEmail');
    if (userId === currentUserId) {
        alert('Вы не можете удалить самого себя.');
        return; 
    }
    if (!confirm('Вы действительно хотите удалить этого пользователя?')) {
        return; 
    }
    fetch(`/users/${userId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('Пользователь успешно удален.');
            location.reload(); 
        } else {
            throw new Error('Ошибка при удалении пользователя');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при удалении пользователя');
    });
}

