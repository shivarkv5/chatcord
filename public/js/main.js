// Client Side
// We can see everything local at Chrome console.
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")



// Getting UserName and room using Qs
const { username , room } = Qs.parse(location.search,{
    //To ignore ?,
    ignoreQueryPrefix:true
})
console.log({username,room});

const socket = io();// We have access to 'io()' because of the script tag in chat.html

//Emitting params to the server(Joins Chatroom)
socket.emit("params",{username,room})


socket.on('roomUsers',({room, users})=>{
    outputRoomName(room);
    outputUsers(users);
})

// Message from server
socket.on("message", (msg) => {
    console.log("Message From Server: "+msg)
    outputMessage(msg)

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


// Message submit
chatForm.addEventListener('submit',(e)=>{
    // When we submits a form it automatically submits to a file. TO stop that preven
    e.preventDefault();

    // To get text input e.target gives current element and then e.target.id gives input text field
    // get message text
    const msg = e.target.elements.msg.value;

    //When we submits form input we get messgae from text input an stored in msg
    //console.log(msg)

    //Emit msg to server
    socket.emit("chatMessage", msg)
    console.log(msg)
    

    //Clears input field
    e.target.elements.msg.value='';
    e.target.elements.msg.autofocus;

})

function outputMessage(msg) {
    //Creating a Div
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msg.userName} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.message}
    </p>`
    console.log("op ")
    console.log(msg);
    // We need to send to chat-messages div in chat.html
    // Whenever we create it shiuld add new div to chat-messages
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to the DOM
function outputRoomName(room){
    roomName.innerHTML = room;

}

// Add users lists to DOM 
function outputUsers(users){
    userList.innerHTML = `
    ${users.map((user)=>`<li>${user.username }<li>`).join('') } 
    `;
}
