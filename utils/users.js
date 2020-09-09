//This array stores all the users 
const users =[];

//join user to the chat
function userFun(id,username,room){
    const user ={id, username, room};
    users.push(user);
    console.log(users)
    return user;
}

function getCurrentUser(id){
return users.find(user =>  user.id === id )


}

//User leaves the chat
function userLeaves(id){
    // getting the index of user when he leaves
    const index = users.findIndex(user => user.id === id)
    //console.log(index)
    // This removes 1 element from the index
    if( index !== -1){
        console.log("After SPlicing")
        return users.splice(index,1)[0]
    }
  //  console.log(users)

}

//Get users from the room
function getUsers(room){
    // It returns the name of the room
    return users.filter(user => user.room = room)
    
}


module.exports = {userFun, getCurrentUser, userLeaves, getUsers}

