let generatedCode;

function validateEmail(email) {
    if (!email.includes('@')) {
        return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    return true;
}

document.getElementById('code').addEventListener('click', function() {
    fetch('/generate-code')
        .then(response => response.json())
        .then(data => {
            generatedCode = data.code;
            document.getElementById('Unicode').value = generatedCode;
        })
        .catch(error => console.error('Error getting code:', error));
});

document.getElementById('submit').addEventListener('click', function() {
    event.preventDefault();
    const email = document.getElementById('Email').value;
    const password = document.getElementById('Password').value;
    const repeat = document.getElementById('PasswordX2').value;
    const enteredCode = document.getElementById('Unicode').value;
    if (!(validateEmail(email))) {
        alert('Please enter a valid email address.');
        return; 
    }
    if (password.length < 7) {
        alert('Password must be at least 7 characters long.');
        return; 
    }
    if (repeat != password) {
        alert('Error');
        return;
    }
    if (enteredCode !== generatedCode) {
        alert('Incorrect code entered.');
        return;
    }
    fetch('/users')
       .then(response => response.json())
       .then(data => {
            const user = data.find(userArray => {
                for (let i = 0; i < userArray.length; i++) {
                    if (userArray[i].Email === email) {
                        return true;
                    }
                }
                return false;
            });
            const userExists = data.some(user => user.Email === email);
            if (userExists) {
                alert('This email is already registered.');
                return;
            }
            if (user) {
                alert('This login and password combination is already taken.');
                return; 
            }
            const employeeData = {
                Email: email,
                Password: password,
            };
            fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            })
           .then(response => response.json())
           .then(data => {
                window.location.href = '/log';
            })
           .catch((error) => {
                console.error('Error:', error);
            });
            fetch('/users')
            .then(response => response.json())
            .then(data => {
                window.location.href = '/log';
    })
    .catch(error => console.error('Error receiving data:', error));
        })
       .catch(error => console.error('Error receiving data:', error));
    });