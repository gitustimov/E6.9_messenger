const host = 'http://' + window.location.host + '/'


const personalAccountButton = document.getElementById('personalAccountButton');
const registrationButton = document.getElementById('registrationButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const greetings = document.getElementById('greetings');
const input = document.getElementById('chat-name-input');
const startButton = document.getElementById('startButton');
const roomsBlock = document.querySelector('.rooms-block');
const chatListTitle = document.querySelector('.chat-list-title');


function redirectRoomEvent(roomName){
  location.replace(`${host}chat/${roomName}/`);
}
function redirectUserAccountEvent(username){
  location.replace(`${host}accounts/account_details/${username}/`);
}


let getCurrentUserRequest = new XMLHttpRequest();
getCurrentUserRequest.open('GET', `${host}chat/api/v1/accounts/get_user/`, false);
getCurrentUserRequest.send(null);
let currentUser = JSON.parse(getCurrentUserRequest.responseText);


if (currentUser.username) {
  greetings.innerHTML = `Привет, ${currentUser.username}!`;
  personalAccountButton.style.display = 'inline-block';
  logoutButton.style.display = 'inline-block';


  startButton.addEventListener('click', ()=> {
  if (input.value) {
    location.replace(`${host}chat/${input.value}/`);
  } else {
    alert('Введите, пожалуйста, название для чата');
  }
  });
} else {
  greetings.innerHTML = 'Привет, незнакомец!';
  registrationButton.style.display = 'inline-block';
  loginButton.style.display = 'inline-block';
  startButton.addEventListener('click', () => alert('Зарегистрируйтесь, пожалуйста'));
}


logoutButton.addEventListener('click', () => {
  let logoutRequest = new XMLHttpRequest();
  logoutRequest.open('GET', `${host}api-auth/logout/`, false);
  logoutRequest.send(null);
  setTimeout(()=>location.reload(), 50);
});
loginButton.addEventListener('click', ()=>{
  location.replace(`${host}accounts/login/`);
});
personalAccountButton.addEventListener('click', ()=> {
  location.replace(`${host}accounts/account_details/${currentUser.username}`);
});
registrationButton.addEventListener('click', ()=> {
  location.replace(`${host}accounts/signup/`);
});


input.addEventListener('input', function(){
  this.value = this.value.replace(/[^\x00-\x7F]+/ig,  '')
  this.value = this.value.replace(' ', '')
});


if (document.querySelector('.messagelist')){
    setTimeout(()=>document.querySelector('.messagelist').remove(), 3000);
}


fetch(`${host}chat/api/v1/get_public_rooms/`)
    .then(response => response.json())
    .then(data => {if(data.length === 0){chatListTitle.style.display = 'none';}data.forEach(obj => {
      roomsBlock.insertAdjacentHTML("beforeend",
          `<section class="chat-list">
                  <p class="chat-list-roomname" onclick="redirectRoomEvent(this.textContent.slice(0,-1))">${obj['name']}:</p>
                    <ul class="chat-list-users" id="${obj['name']}">
                    </ul>
                </section>`);
      obj['roomUsers'].forEach(user => {
        document.getElementById(`${obj['name']}`)
            .insertAdjacentHTML("beforeend",
                `<li class="user-name" onclick="redirectUserAccountEvent(this.textContent)">${user}</li>`);
      });})})
    .catch(ev => console.log(`Error: ${ev}`))
