var loginUsername = document.getElementById('username'),
    loginPassword = document.getElementById('password'),
    registerUsername = document.getElementById('rusername'),
    registerPassword = document.getElementById('rpassword'),
    deleteUsername = document.getElementById('dusername'),
    deletePassword = document.getElementById('dpassword'),
    loginBTN = document.getElementById('loginBTN'),
    registerBTN = document.getElementById('registerBTN'),
    deleteBTN = document.getElementById('deleteBTN'),
    registerInfo = document.getElementById('registerInfo'),
    loginInfo = document.getElementById('loginInfo');
    deleteInfo = document.getElementById('deleteInfo');

async function login(loginUsername, loginPassword) {
    await zlFetch.post('http://localhost:80/users/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                name: loginUsername,
                password: loginPassword
            }
        })
        .then(response => {
            const body = response.body;
            document.write(body)
        })
        .catch(error => {
            const body = error.body;
            loginInfo.innerHTML = body
        });
}

async function register(registerUsername, registerPassword) {
    await zlFetch.post('http://localhost:80/users/register', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                name: registerUsername,
                password: registerPassword
            }
        })
        .then(response => {
            const body = response.body;
            registerInfo.innerHTML = body
            rusername.value = "";
            rpassword.value = "";
        })
        .catch(error => {
            const body = error.body;
            registerInfo.innerHTML = body
            rusername.value = "";
            rpassword.value = "";
        });
}

async function deleteAcc(deleteUsername, deletePassword) {
    await zlFetch.delete('http://localhost:80/users/', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                name: deleteUsername,
                password: deletePassword
            }
        })
        .then(response => {
            const body = response.body;
            deleteInfo.innerHTML = body
            dusername.value = "";
            dpassword.value = "";
        })
        .catch(error => {
            const body = error.body;
            deleteInfo.innerHTML = body
            dusername.value = "";
            dpassword.value = "";
        });
}

registerBTN.addEventListener('click', function () {
    register(rusername.value, rpassword.value);
});

loginBTN.addEventListener('click', function () {
    login(username.value, password.value);
});

deleteBTN.addEventListener('click', function () {
    deleteAcc(dusername.value, dpassword.value);
});

password.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        login(username.value, password.value);
    }
})

rpassword.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        register(rusername.value, rpassword.value);
    }
})

username.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        login(username.value, password.value);
    }
})

rusername.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        register(rusername.value, rpassword.value);
    }
})

dpassword.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        deleteAcc(dusername.value, dpassword.value);
    }
})

dusername.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        deleteAcc(dusername.value, dpassword.value);
    }
})