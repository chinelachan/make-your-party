const userName = $('#username');
const imageUser = $('#img-user')
const inputNomePerfil = $('#inputNomePerfil');
const formDescricaoPerfil = $('#form-descricao-perfil-edit');
const laneRadioOption = $('.perfil-edit-posicoes [name=lane]');
const ageInput = $('#idade-perfil-edit');
const imageInput = $('#form-imagem');
const imgShowInput = $('#img-form-imagem');
const nick = $('#nicklol-perfil-edit');
const carousel = $('#carousel');
const carouselNext = $('#carousel-next');
const likesContainer = $('#likesContainer');
const areaMensagensFull = $('#area-mensagens-full');
const chat = $('#chat');
let intervalChatUpdate = 0;

function createCarouselItem(user, active) {
    return `
<div class="carousel-item ${active ? 'active': ''}">
    <div class="card-match">
        <div class="topo-match">
            ${user.lane.name}
        </div>
        <div class="conteúdo-match">
            <span class="dados-match">
                <span class="nome-perfil-match">
                    ${user.nickName ?? user.name}
                </span><br>
                <span class="descrição-perfil-match">
                    ${user.description ?? ''}
                </span>
            </span>
            <img class="imagem-perfil-match" src="${user.avatarBase64 ?? 'img/imagem-user.png'}">
        </div>
        <div class="rodapé-match">
            <span>
                <a href="">
                    <img
                        class="botões-match-laterais"
                        />
                </a>
            </span>
            <span>
                <a onclick="likeUser(${user.id})" class="clicavel">
                    <img
                        class="botões-match-centro"
                        src="img/like.png"/>
                </a>
            </span>
            <span>
                <a 
                    href="#carouselExampleControls" 
                    role="button"
                    data-slide="prev">
                    <img class="botões-match-laterais"
                        src="img/retornar.png"/>
                </a>
            </span>
        </div>
    </div>
</div>
    `;
}

function createLikeItem(user, lastMessage, favorited) {
    let favoritedHtml = '';
    if (favorited) {
        favoritedHtml += `
        <img
                class="favorite-icon"
                src="img/favoritado.png"/>
        `;
    }
    return `
<a onclick="openChat(${user.id})" class="clicavel">
    <div class="row usuário-mensagem">
        <div class="col-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 ">
            <img class="imagem-usuário-mensagem"
                src="${user.avatarBase64 ?? 'img/imagem-user.png'}">
            ${favoritedHtml}
        </div>
        <div class="col-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
            <div class="container">
                <div class="row">
                    ${user.nickName ?? user.name}
                </div>
                <div class="row mensagem">
                    <p>
                        ${lastMessage ? lastMessage.text : ''}
                    </p>
                </div>
            </div>
        </div>
    </div>
</a>
    `;
}

function createMessagesChatToUser(user, messages) {
    let messagesHtml = '';
    for(const m of messages) {
        const isRight = m.idUserFrom !== user.id;
        messagesHtml += `
        <div class="message-block ${isRight ? 'right': ''}">
            <div class="wrapper">
                <p>
                    ${m.text}
                </p>
                
            </div>
        </div>
        `;
    }
    return messagesHtml;
}

function createChatToUser(user, messages, favorited) {
    let messagesHtml = createMessagesChatToUser(user, messages);
    let favoriteHtml = '';
    if (favorited) {
        favoriteHtml = `
            <a class="clicavel" onclick="desfavoriteUser(${user.id})">
                <img
                style="width: 40px"
                class="botões-match-laterais"
                src="img/favoritado.png"/>
            </a>
        `;        
    } else {
        favoriteHtml = `
            <a class="clicavel" onclick="favoriteUser(${user.id})">
                <img
                    style="width: 40px"
                    class="botões-match-laterais"
                    src="img/favoritar.png"/>
            </a>
        `;
    }
    return `
<div class="container">
    <div class="row cabecalho-mensagem-full">
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <img class="imagem-usuário-mensagem-full"
                src="${user.avatarBase64 ?? 'img/imagem-user.png'}">
            <span class="nome-usuário-mensagem1">${user.nickName ?? user.name}</span>
            <span>
                ${favoriteHtml}
            </span>
            <div class="área-botão-fechar">
                <a onclick="fechaCaixaMensagem()"
                    id="fecha-mensagem-full"><i
                        class="fas fa-times"></i></a>
            </div>
        </div>
    </div>
    <div id="messages-chat" class="caixa-mensagem-full">
        ${messagesHtml}
    </div>
    <div class="sendMessage">
        <form onsubmit="sendMessageTo(${user.id}, event)">
            <textarea id="message" name="message"></textarea>
        </form>
    </div>
</div>
    `;
}

function renderPerfil() {
    const user = auth.loggedUser();
    userName.html(user.name);
    inputNomePerfil.val(user.name);
    formDescricaoPerfil.val(user.description);
    ageInput.val(user.age);
    nick.val(user.nickName);
    if(user.avatarBase64) {
        imgShowInput.attr('src', user.avatarBase64);
        imageUser.attr('src', user.avatarBase64);
    }    
    for(const e of laneRadioOption) {
        if (e.id === `radio-lane-${user.lane.id}`) {
            e.checked = true;
        }
    }
}

function renderUserCarousel() {
    const user = auth.loggedUser();
    const likes = likeRepository.find(l => l.idUserFrom === user.id);
    const usersToMatch = userRepository.find(
                                u => u.id !== user.id &&
                                     u.lane.id !== user.lane.id &&
                                     !likes.some(l => l.idUserTo === u.id)
                        );
    if (usersToMatch.length > 0) {
        let carouselItems = '';
        for(let i = 0; i < usersToMatch.length; i++) {
            const userToMatch = usersToMatch[i];
            const active = i === 0;
            carouselItems += createCarouselItem(userToMatch, active);
        }
        carousel.html(carouselItems);
        carouselNext.show();
    }
    else {
        carouselNext.hide();
    }
}

function renderLikes() {
    const user = auth.loggedUser();
    const likes = likeRepository.find(l => l.idUserFrom === user.id);
    const receivedMessages = messageRepository.find(m => m.idUserTo === user.id);
    let likesHtml = '';
    likes.filter(l => l.favorited).forEach(l => {
        const userLiked = userRepository.find(u => u.id === l.idUserTo)[0];
        if (userLiked) {
            const messages = receivedMessages.filter(m => m.idUserFrom === userLiked.id);
            const lastMessage = messages[messages.length-1];
            likesHtml += createLikeItem(userLiked, lastMessage, l.favorited);
        }
    });
    likes.filter(l => !l.favorited).forEach(l => {
        const userLiked = userRepository.find(u => u.id === l.idUserTo)[0];
        if (userLiked) {
            const messages = receivedMessages.filter(m => m.idUserFrom === userLiked.id);
            const lastMessage = messages[messages.length-1];
            likesHtml += createLikeItem(userLiked, lastMessage, l.favorited);
        }
    });
    const userMessageButNotLike = receivedMessages.filter(m => !likes.some(l => m.idUserFrom === l.idUserTo));
    userMessageButNotLike.forEach(m => {
        const userMessageFrom = userRepository.find(u => u.id === m.idUserFrom)[0];
        if (userMessageFrom) {
            const messages = receivedMessages.filter(m => m.idUserFrom === userMessageFrom.id);
            const lastMessage = messages[messages.length-1];
            likesHtml += createLikeItem(userMessageFrom, lastMessage);
        }
    }); 
    if (likesHtml) {
        likesContainer.html(likesHtml);
    }
}

function criaPerfil(){
    renderPerfil();
    renderUserCarousel();    
    renderLikes();
    setInterval(renderLikes, 3000);
}

function saveProfileChanges() {
    const user = auth.loggedUser();
    user.name = inputNomePerfil.val();
    user.description = formDescricaoPerfil.val();
    user.age = ageInput.val();
    user.nickName = nick.val();
    user.avatarBase64 = imgShowInput.attr('src');
    for(const e of laneRadioOption) {
        if (e.checked) {
            user.lane = lanes[e.value];
        }
    }
    userRepository.update(user);
    criaPerfil();
    alert('Alterações Salvas');
}

function likeUser(idUserToLike) {
    const user = auth.loggedUser();
    const like = likeRepository.find(l => l.idUserTo === idUserToLike &&
                                        l.idUserFrom === user.id)[0];
    if(!like) {
        likeRepository.create({
            idUserFrom: user.id,
            idUserTo: idUserToLike,
        });
    }
    criaPerfil();
}

function favoriteUser(idUser) {
    const user = auth.loggedUser();
    let userLiked = likeRepository.find(l => l.idUserFrom === user.id && l.idUserTo === idUser)[0];
    if (userLiked) {
        console.log('Favoritado');
        userLiked.favorited = true;
        likeRepository.update(userLiked);
    } else {
        console.log('liked e favoritado');
        likeRepository.create({
            idUserFrom: user.id,
            idUserTo: idUser,
            favorited: true
        });
    }
    renderLikes();
    openChat(idUser);
}

function desfavoriteUser(idUser) {
    const user = auth.loggedUser();
    let userLiked = likeRepository.find(l => l.idUserFrom === user.id && l.idUserTo === idUser)[0];
    if (userLiked) {
        userLiked.favorited = false;
        likeRepository.update(userLiked);
    }
    renderLikes();
    openChat(idUser);
}

function sendMessageTo(idUserTo, event) {
    const messageText = event.target.message.value;
    if (messageText) {
        const userFrom = auth.loggedUser();
        const userTo = userRepository.find(u => u.id === idUserTo)[0];
        messageRepository.create({
            idUserFrom: userFrom.id,
            idUserTo: userTo.id,
            text: messageText,
        });
        event.target.message.value = "";
        openChat(idUserTo);
    }
}

//Mostrar área do perfil
function configBotãoPerfilConfig(){

    document.getElementById('area-config-perfil').classList.toggle('area-config-on');
    document.getElementById('area-config-perfil-2').classList.toggle('area-config-on');

}

function configBotãoMatchConfig(){
    document.getElementById('area-config-perfil').classList.remove('area-config-on');
    document.getElementById('area-config-perfil-2').classList.remove('area-config-on');
}

function openChat(idUser) {
    clearInterval(intervalChatUpdate);
    const user = auth.loggedUser();
    const userToChat = userRepository.find(u => u.id === idUser)[0];
    const messages = messageRepository.find(
        m => (m.idUserFrom === user.id && m.idUserTo === userToChat.id) ||
            (m.idUserFrom === userToChat.id && m.idUserTo === user.id));
    const userLiked = likeRepository.find(l => l.idUserFrom === user.id && l.idUserTo === idUser)[0];
    const favorited = userLiked ? userLiked.favorited : false;
    chat.html(createChatToUser(userToChat, messages, favorited));
    $('#message').on('keypress', submitOnEnter);
    areaMensagensFull.show();    
    $('.caixa-mensagem-full').scrollTop($('.caixa-mensagem-full')[0].scrollHeight);
    intervalChatUpdate = setInterval(() => {
        const messages = messageRepository.find(
            m => (m.idUserFrom === user.id && m.idUserTo === userToChat.id) ||
                (m.idUserFrom === userToChat.id && m.idUserTo === user.id));
        $('#messages-chat').html(createMessagesChatToUser(userToChat, messages));
        console.log(`Chat ${userToChat.nickName} atualizado`);
    }, 1000);
}
//Caixa de mensagens full
function abreEfechaCaixaMensagem(){
    areaMensagensFull.classList.toggle('area-mensagens-full-on');
    $('#message').on('keypress', submitOnEnter);
}

function fechaCaixaMensagem(){
    areaMensagensFull.hide();
}

function updateImage(event) {
    const fileSelected = event.target.files[0];
    if(fileSelected) {
        var fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64
            $("#img-form-imagem").attr("src",srcData);

        }
        fileReader.readAsDataURL(fileSelected);
    }
}