async function submit() {
    var body = {
        name: document.getElementById('name').value.toString(),
        email: document.getElementById('email').value.toString(),
        msg: document.getElementById('msg').value.toString()
    }
    await fetch(window.location.href + 'submit', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
}