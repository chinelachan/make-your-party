//Emitir evento submit ao prescionar tecla enter
function submitOnEnter(event){
    if(event.which === 13 && !event.shiftKey){
        event.target.form.dispatchEvent(new Event("submit", {cancelable: true}));
        event.preventDefault(); // Prevents the addition of a new line in the text field (not needed in a lot of cases)
    }
}

//Gerenciar usuário logado
class Auth {
    loggedUser() {
        if(!sessionStorage.loggedIdUser)
            this.loggout();
        return userRepository.find(u => u.id == sessionStorage.loggedIdUser)[0];
    }

    loging(user) {
        sessionStorage.loggedIdUser = user.id;
    }

    loggout() {
        sessionStorage.removeItem('loggedIdUser');
        location.replace('/');
    }
}

//Simular repositório utilizando localstorage
class Repository {
    constructor(name) {
        this.name = name;
        this.index = name + 'Index';
        if (!localStorage[this.name]) {
            localStorage[this.name] = JSON.stringify([]);
        } 

        if(!localStorage[this.index]) {
            localStorage[this.index] = 0;
        }
    }

    _index() {
        return localStorage[this.index];
    }

    _incrementIndex() {
        return ++localStorage[this.index];
    }

    _save(data) {

        localStorage[this.name] = JSON.stringify(data);
    }

    _db() {
        return JSON.parse(localStorage[this.name]);
    }

    find(queryPredicate) {
        return this._db().filter(queryPredicate);
    }

    create(data) {
        data.id = this._incrementIndex();
        data.createdAt = (new Date()).toISOString();
        const db = this._db();
        db.push(data);
        this._save(db);
        return data;
    }

    update(data) {
        var indexData = this._db().findIndex((d) => d.id === data.id);
        if (indexData || indexData === 0) {
            const db = this._db();
            db[indexData] = data;
            this._save(db);
            return data;
        } else {
            throw new Error("Not find data");
        }
    }
}

const lanes = {
    'top' : { id:'top', name:'Top Laner'},
    'jungler' : { id:'jungler', name:'Jungler'},
    'mid' : { id:'mid', name:'Mid Laner'},
    'adc' : { id:'adc', name:'ADC'},
    'sup' : { id:'sup', name:'Suporte'}
};
const userRepository = new Repository('users');
const messageRepository = new Repository('messages');
const likeRepository = new Repository('likes');
const auth = new Auth();

const usersToCreate = [
    {
        name: 'Felipe Gonçalves', 
        nickName: 'brTT',
        lane: lanes.adc, 
        description: 'Maior campeão do CBLoL de todos os tempos',
        email: 'brTT@gmail.com',
        password: 'brTT'
    },
    {
        name: 'Matheus Rossini', 
        nickName: 'dyNquedo',
        lane: lanes.mid, 
        description: 'Grande estrela da KaBuM em 2018',
        email: 'dyNquedo@gmail.com',
        password: 'dyNquedo'
    },
    {
        name: 'Felipe Zhao', 
        nickName: 'Yang',
        lane: lanes.top, 
        description: 'Um dos melhores jogadores de LoL do Brasil tanto na história quanto na atualidade',
        email: 'yang@gmail.com',
        password: 'yang'
    },
    {
        name: 'Luan Cardoso', 
        nickName: 'Jockster',
        lane: lanes.sup, 
        description: 'um suporte mais agressivo do que os colegas de posição',
        email: 'jockster@gmail.com',
        password: 'jockster'
    },
    {
        name: 'Gabriel Henud', 
        nickName: 'Revolta',
        lane: lanes.jungler, 
        description: '“Roubou! É incrível! É o Revolta!”',
        email: 'revolta@gmail.com',
        password: 'revolta'
    },
];

//Iniciar aplicação com usuários cadastrados
usersToCreate.forEach(utc => {
    const user = userRepository.find(u => u.email === utc.email)[0];
    if (!user) {
        userRepository.create(utc);
    }
});






















