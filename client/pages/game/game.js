const sock = io();
var myUser;
var myRole;
var players;

window.onload = () => {

    myUser = sessionStorage.getItem('user');
    myRole = JSON.parse(sessionStorage.getItem('role'));
    players= JSON.parse(sessionStorage.getItem('players'));
    _setPlayers();
    _setRole();

    //send the update!
    sock.emit("updateSocketId", myUser);
}

const _setRole = ()=>{
    document.getElementById("#user_role_card").innerHTML+="<span>"+myRole.name+"</span>";

}

const _setPlayers = ()=>{
    players.forEach(element => {
        // <div class="character" id="me">
        //    <div class="user_img"><img src="../../assets/images/avatar.jpg"></div>
        //    <div class="user_name">Marco</div>
        // </div>
        const parent = document.querySelector('#list_users_fill');
        const charac = document.createElement('div');
        charac.className = 'character';
        if (element == myUser)
            charac.id = 'me';

        const userimg = document.createElement('div');
        userimg.className = 'user_img';

        const img = document.createElement('img');
        img.src = '../../assets/images/avatar.jpg';

        const un = document.createElement('div');
        un.className = 'user_name'; 
        un.innerHTML = element;

        charac.appendChild(userimg);
        userimg.appendChild(img);
        charac.appendChild(un);

        parent.appendChild(charac);
    });
};