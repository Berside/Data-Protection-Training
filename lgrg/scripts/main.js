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
                    isAdminText = 'Administrator';
                    break;
                case '2':
                    isAdminText = 'Moderator';
                    break;
                case '1':
                    isAdminText = 'Helper';
                    break;
                default:ё
                    isAdminText = 'Нет';
            }
            document.getElementById('user-level').textContent = isAdminText;
            if (isAdminText === 'Helper') {
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
            if (isAdminText === 'Moderator') {
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
                            deleteIcon.alt = 'Delete a user';
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
            if (isAdminText === 'Administrator') {
                fetch('/users')
                    .then(response => response.json())
                    .then(userData => {
                        const table = document.createElement('table');
                        table.id = 'user-data-table';
                        const thead = document.createElement('thead');
                        const headerRow = document.createElement('tr');
                        ['ID', 'Email', 'Level', 'Delete', 'Change Level'].forEach(headerText => {
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
                            if (user.level !== 3) { 
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
                            if (user.level !== 3) {
                                const changeIconTd = document.createElement('td');
                                const changeIcon = document.createElement('img');
                                changeIcon.src = 'imgs/pencil.png';
                                changeIcon.alt = 'Change the user level';
                                changeIcon.classList.add('change-icon');
                                changeIconTd.appendChild(changeIcon);
                                changeIcon.onclick = function() {
                                    const newLevel = prompt("Enter a new user level");
                                    if (newLevel) {
                                        changeUserLevel(user.id, newLevel);
                                    }
                                };
                                tr.appendChild(changeIconTd);
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
        alert('You cannot delete yourself.');
        return; 
    }
    if (!confirm('Do you really want to delete this user?')) {
        return; 
    }
    fetch(`/users/${userId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (response.ok) {
            alert('The user has been successfully deleted.');
            location.reload(); 
        } else {
            throw new Error('Error when deleting a user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error when deleting a user');
    });
}

function changeUserLevel(userId, newLevel) {
    if (!confirm('Are you sure you want to change this user level?')) {
        return;
    }
    fetch('/change-user-level', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId, 
            newLevel: newLevel
        }),
    })
    .then(response => {
        if (response.ok) {
            alert('The user level has been successfully changed.');
            location.reload();
        } else {
            throw new Error(`Error when changing the user level: ${response.statusText}`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error when changing the user level: ${error.message || 'Unknown error'}`);
    });
}