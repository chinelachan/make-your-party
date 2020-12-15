function realizarLogin() {
    event.preventDefault();
    const email = document.getElementById("emailLogin").value;
    const password = document.getElementById("senhaLogin").value;
    const user = userRepository.find(u => u.email === email && u.password === password)[0];
    if (user) {
        auth.loging(user);
        window.location = "logado.html";
    } else {
        alert('Email ou senha incorreta.');
    }
}