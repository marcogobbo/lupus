
const writeEvent = (text) => {
    //<ul> element
    const parent = document.querySelector('#events');

    //<li> element
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
};

const onFormSubmited = (e) => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    sock.emit('message', text);
}

writeEvent('welome')

const sock = io();
sock.on('message', (text) => {
    writeEvent(text);
});

document
    .querySelector('#chat-form')
    .addEventListener('submit', onFormSubmited);

document.querySelector('#combo').addEventListener('change', (event) => {
    const chat = document.querySelector('#rps-wrapper');
    console.log(chat)
    if (event.target.value == "lupo")
        chat.style.display = 'block';
    else
        chat.style.display = 'none';
});