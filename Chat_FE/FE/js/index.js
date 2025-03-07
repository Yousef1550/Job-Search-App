const baseURL = 'http://localhost:3000'             // backend server url
const token = `${localStorage.getItem("token")}`;   // get token from browser localStroage

let globalProfile = {};
// Common headers for all backend requests
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'accesstoken': token
};

// Establish a connection to the server with socket
const clintIo = io(baseURL, {
    auth: { accesstoken: token }    // send token in the auth object in handshake object
})



clintIo.emit('sendMessage', 'Hello from clident side')
// clintIo.on('replay', (data) => {
//     console.log(data);
// })
// clintIo.on('messageToAllClients', (data) => {
//     console.log(data);
// })
// clintIo.on('brodcastReplay', (data) => {
//     console.log(data);
// })

clintIo.on('messageRoom', (data) => {
    console.log(data);
})








// Default images links
let avatar = './avatar/Avatar-No-Background.png'
let meImage = './avatar/Avatar-No-Background.png'
let friendImage = './avatar/Avatar-No-Background.png'


// Send new  message on the chat
function sendMessage(receiverId) {
    const data = {
        body: $("#messageBody").val(),
        receiverId,
    }
    console.log({data});
    clintIo.emit('sendMessage', data)
}

// trigger when the server sends a message successfully
clintIo.on('successMessage', (data) => {
    const { chat, body } = data
    meImage = chat?.senderId.image?.secure_url || avatar
    friendImage = chat?.receiverId.image?.secure_url || avatar

    const div = document.createElement('div');

    div.className = 'me text-end p-2';
    div.dir = 'rtl';
    div.innerHTML = `
        <img class="chatImage" src="${meImage}" alt="" srcset="">
        <span class="mx-2">${body}</span>
    `;
    document.getElementById('messageList').appendChild(div);
    $(".noResult").hide()
    $("#messageBody").val('')
})


// Get the new message and sent it directly to the receiver
clintIo.on("receiveMessage", (data) => {
    const { body } = data

    const div = document.createElement('div');
    div.className = 'myFriend p-2';
    div.dir = 'ltr';
    div.innerHTML = `
    <img class="chatImage" src="${friendImage}" alt="" srcset="">
    <span class="mx-2">${body}</span>
    `;
    document.getElementById('messageList').appendChild(div);
})


// Show the chathistory if there is any
function showData(destId, chat) {
    document.getElementById("sendMessage").setAttribute("onclick", `sendMessage('${destId}')`);

    document.getElementById('messageList').innerHTML = ''
    if (chat?.messages?.length) {
        $(".noResult").hide()

        console.log({globalProfile});
        
        for (const message of chat.messages) {

            if (message.senderId?._id.toString() == globalProfile?._id?.toString()) {
                const div = document.createElement('div');
                div.className = 'me text-end p-2';
                div.dir = 'rtl';
                div.innerHTML = `
                <img class="chatImage" src="${meImage}" alt="" srcset="">
                <span class="mx-2">${message.body}</span>
                `;
                document.getElementById('messageList').appendChild(div);
            } else {

                const div = document.createElement('div');
                div.className = 'myFriend p-2';
                div.dir = 'ltr';
                div.innerHTML = `
                <img class="chatImage" src="${friendImage}" alt="" srcset="">
                <span class="mx-2">${message.body}</span>
                `;
                document.getElementById('messageList').appendChild(div);
            }

        }
    } else {
        const div = document.createElement('div');

        div.className = 'noResult text-center  p-2';
        div.dir = 'ltr';
        div.innerHTML = `
            <span class="mx-2">Say Hi to start the conversation.</span>
        `;
        document.getElementById('messageList').appendChild(div);
    }

}

//get chat conversation between 2 users and pass it to ShowData function to display it
function displayChatData(userId) {
    axios({
        method: 'get',
        url: `${baseURL}/user/get-chat-history/${userId}`,
        headers
    }).then(function (response) {
        const { chat } = response.data
        console.log({ chat });
        if (chat) {
            // handleImages
            if (chat.senderId?._id?.toString() == globalProfile?._id?.toString()) {
                meImage = chat.senderId?.image?.secure_url || avatar
                friendImage = chat.receiverId?.image?.secure_url || avatar
            } else {
                friendImage = chat.senderId?.image?.secure_url || avatar
                meImage = chat.receiverId?.image?.secure_url || avatar
            }

            showData(userId, chat)
        } else {
            showData(userId, 0)
        }

    }).catch(function (error) {
        console.log(error);
        console.log({ status: error.status });
        if (error.status == 404) {
            showData(userId, 0)
        } else {
            alert("Ops something went wrong")
        }

    });
}

// Display Friends Data
function GetFriends() {
    axios({
        method: 'get',
        url: `${baseURL}/user/listUserFriends`,
        headers
    }).then(function (response) {
        console.log({ response });
        
        const { user, friendsList } = response.data
        globalProfile = user
        document.getElementById("userName").innerHTML = `${user.username}`
        showUsersData(friendsList.friends)
    }).catch(function (error) {
        console.log(error);
    });
}

// Show friends list
function showUsersData(users = []) {
    let cartonna = ``
    for (let i = 0; i < users.length; i++) {
        cartonna += `
        <div onclick="displayChatData('${users[i]._id}')" class="chatUser my-2">
        <span class="ps-2">${users[i].username}</span>
        </div>
        `
    }
    document.getElementById('friends').innerHTML = cartonna;
}
GetFriends()




