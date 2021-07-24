var socket = io.connect('http://localhost:80');

var chatbox = document.getElementById('chat-window'),
    message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    modal = document.getElementById('modal'),
    modalcontent = document.getElementById('modalcontentp'),
    span = document.getElementsByClassName("close")[0],
    proctologo = document.getElementById("procto-logo"),
    joined = document.getElementById("joined"),
    pseudoElement = document.getElementById("pseudo"),
    clientsTotal = document.getElementById('connected');

const talkedRecently = new Set();

function sendMessage() {
    if (!message.value) {
        modal.style.display = "block";
        modalcontent.innerHTML = `Veuillez &eacute;crire un message !`
        return;
    }
    if (talkedRecently.has(handle.value)) {
        message.style.animation = "rateLimit 1s"
        return;
    };
    talkedRecently.add(handle.value);
    setTimeout(() => {
        talkedRecently.delete(handle.value);
    }, 1000);
    if (message.value.includes(`<script>`)) {
        message.value = "";
        return;
    }
    if (message.value.includes(`alert(`)) {
        message.value = "";
        return;
    }
    socket.emit('chat', {
        message: message.value,
        handle: pseudo
    });
    message.value = "";
    message.style.color = "white"
    message.style.animation = ""
}

function scrollToBottom(id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

output.addEventListener('submit', e => {
    e.preventDefault()
})

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

proctologo.onclick = function () {
    modal.style.display = "block";
    modalcontent.innerHTML = `Tu as vu mon prolapse ?`
}

btn.addEventListener('click', function () {
    sendMessage();
});

message.addEventListener('keypress', function () {
    socket.emit('typing', pseudo)
});

message.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
})

var pseudo = pseudoElement.innerHTML;
if (pseudo) {
    console.log('emit')
    socket.emit('joined', pseudo);
    socket.emit('aurevoir', pseudo);
}

if (pseudo == "") {
    socket.emit('unauthorized', null)
}

if (pseudo == "") {
    handle.innerHTML = `<p><strong>PAS DE PSEUDO AU REVOIR</strong></p>`;
}
socket.on('chat', function (data) {
    switch (data.handle) {
        case 'atomkern': {
            feedback.innerHTML = "";
            output.innerHTML += `<p><strong id="atomsrx"> ${data.handle}: </strong> ${data.message} </p>`;
            scrollToBottom('chat-window')
            break;
        }
        default: {
            feedback.innerHTML = "";
            output.innerHTML += `<p><strong> ${data.handle}: </strong> ${data.message} </p>`;
            scrollToBottom('chat-window')
            break;
        }

    }
});

socket.on('typing', function (data) {
    feedback.innerHTML = `<p><em> ${data} est en train d'&eacute;crire...<p><em>`
});

socket.on('joined', function (data) {
    joined.innerHTML += `<p><strong> ${data} a rejoint. </strong></p>`;
})

socket.on('unauthorized', function () {
    message.innerHTML = "";
})

socket.on('clients-total', function (data) {
    clientsTotal.innerHTML = `<p><strong> ${data} connectés. </strong></p>`;
})

socket.on('pasmoi', function() {
    socket.emit('aurevoire', pseudo);
});

socket.on('aurevoir', function (data) {
    joined.innerHTML += `<p><strong> ${data} est parti. </strong></p>`;
})
