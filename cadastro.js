//Cadastro
function FazCadastro() {

    var mensagem2 = document.getElementById('error2');

    if (document.getElementById("senha").value != document.getElementById("senha2").value) {
        event.preventDefault();
    } else {

        event.preventDefault();
        let cadastro = {
            name: document.getElementById("nome").value,
            password: document.getElementById("senha").value,
            email: document.getElementById("email").value,
            lane: lanes.top
        }
        const emailJaCadastrado = userRepository.find(u => u.email === cadastro.email).length > 0;
        if(emailJaCadastrado) {
            alert('Já existe um usuário com essa conta de email');
        } else {
            cadastro = userRepository.create(cadastro);
            alert('Cadastro realizado com sucesso.');
            location.replace('../');
        }        
    }
}

function confereSenhas() {
    var campo1 = document.getElementById('senha');
    var campo2 = document.getElementById('senha2');

    var mensagem = document.getElementById('error');
    if (document.getElementById("senha").value != document.getElementById("senha2").value) {
        mensagem.innerHTML = "As senhas não coincidem.";
        campo1.classList.add('erro');
        campo2.classList.add('erro');
    }
    else {
        mensagem.innerHTML = "";
        campo1.classList.remove('erro');
        campo2.classList.remove('erro');
    }
}