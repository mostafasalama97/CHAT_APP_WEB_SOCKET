// const socket = io('ws://localhost:3500')


// const activity = document.getElementById('activity')
// const msgInput = document.getElementById('messageInp')
// const nameInput = document.getElementById('name')
// const roomInput = document.getElementById('room')
// const userList = document.querySelector('.user-list')
// const roomList = document.querySelector('.room-list')
// const chatDisplay = document.querySelector('.chat-display')




// function sendMessage(e) {
//     console.log(e)
//     e.preventDefault()
//     if (msgInput.value && nameInput.value && roomInput.value) {
//         socket.emit('message', {
//             "name": nameInput.value,
//             "text": msgInput.value
//         })
//         msgInput.value = ''

//     }
//     msgInput.focus()
// }


// function enterRoom(e) {
//     e.preventDefault()
//     if (nameInput.value && roomInput.value) {
//         socket.emit('enterRoom', {
//             "name": nameInput.value,
//             "room": roomInput.value
//         })
//     }
// }
// document.getElementById("messageForm").addEventListener("submit", sendMessage)

// document.querySelector(".form-join").addEventListener("submit", enterRoom)



// // not correct => not logic
// // roomInput.addEventListener('keypress' , () => {
// //     socket.emit('activity' , roomInput.value)
// // })

// nameInput.addEventListener('keypress', () => {
//     socket.emit('activity', nameInput.value)
// })


// // listen for messages
// socket.on('message', (data) => {
//     activity.textContent = ''
//     const { name, text, time } = data
//     const li = document.createElement('li')
//     li.className = 'post'
//     if (name === nameInput.value) {
//         li.className = 'post post--left'
//     }
//     if (name !== nameInput.value && name !== 'admin') {
//         li.className = 'post post--right'
//     }
//     if (name !== 'admin') {
//         li.innerHTML = `<div class="post__header">${name === nameInput.value} ? 'post__header_user' 
//         :
//         'post__header__reply'}"
//         <span class="post__header--name">${name}</span>
//         <span class="post__header--time">${time}</span>
//         </div>
//         <div class="post__text">${text}</div>
//         `
//     } else {
//         li.innerHTML = `<div class="post__text">${text}</div>`
//     }
//     document.querySelector('.chat-display').appendChild(li)
//     chatDisplay.scrollTop = chatDisplay.scrollHeight
// })

// msgInput.addEventListener('keypress', () => {
//     socket.emit('activity', socket.id.substring(0, 5))
// })


// let activityTimer;
// socket.on('activity', (name) => {
//     activity.textContent = `${name} is typing...`
//     console.log(activity)
//     // clear after 3 secs
//     clearTimeout(activityTimer)
//     activityTimer = setTimeout(() => {
//         activity.textContent = ''
//     }, 3000)
// })

// socket.on('userlist', ({ users}) => {
//     showUsers(users)
// })

// socket.on('roomList', ({ rooms }) => {
//     showRooms(rooms)
// })

// // update room list
// function showUsers(users) {
//     userList.textContent = ''
//     if (users) {
//         userList.innerHTML = `<em>Users in ${chatRoom.value}:</em>`
//         users.forEach((user, i) => {
//             userList.textContent += ` ${user.name}`
//             if (users.length > 1 && i !== users.length - 1) {
//                 userList.textContent += ","
//             }
//         })
//     }
// }

// // update user list
// function showRooms(rooms) {
//     roomList.textContent = ''
//     if (rooms) {
//         roomList.innerHTML = '<em>Active Rooms:</em>'
//         rooms.forEach((room, i) => {
//             roomList.textContent += ` ${room}`
//             if (rooms.length > 1 && i !== rooms.length - 1) {
//                 roomList.textContent += ","
//             }
//         })
//     }
// }



const socket = io('ws://localhost:3500')

const activity = document.getElementById('activity')
const msgInput = document.getElementById('messageInp')
const nameInput = document.getElementById('name')
const roomInput = document.getElementById('room')
const userList = document.querySelector('.user-list')
const roomList = document.querySelector('.room-list')
const chatDisplay = document.querySelector('.chat-display')

function sendMessage(e) {
    e.preventDefault()
    if (msgInput.value && nameInput.value && roomInput.value) {
        socket.emit('message', {
            "name": nameInput.value,
            "text": msgInput.value
        })
        msgInput.value = ''
    }
    msgInput.focus()
}

function enterRoom(e) {
    e.preventDefault()
    if (nameInput.value && roomInput.value) {
        socket.emit('enterRoom', {
            "name": nameInput.value,
            "room": roomInput.value
        })
    }
}
document.getElementById("messageForm").addEventListener("submit", sendMessage)
document.querySelector(".form-join").addEventListener("submit", enterRoom)

nameInput.addEventListener('keypress', () => {
    socket.emit('activity', nameInput.value)
})

// Listen for messages
socket.on('message', (data) => {
    activity.textContent = ''
    const { name, text, time , color } = data
    const li = document.createElement('li')

    if (name === nameInput.value) {
        li.className = 'post post--right'
    } else if (name !== 'admin') {
        li.className = 'post post--left'
    }

    if (name !== 'admin') {
        li.innerHTML = `
            <div class="post__header" style="background-color: ${color || 'blue'};">
                <span class="post__header--name">${name}</span>
                <span class="post__header--time">${time}</span>
            </div>
            <div class="post__text">${text}</div>
        `
    } else {
        li.innerHTML = `<div class="post__text">${text}</div>`
    }

    chatDisplay.appendChild(li)
    chatDisplay.scrollTop = chatDisplay.scrollHeight
})

msgInput.addEventListener('keypress', () => {
    socket.emit('activity', socket.id.substring(0, 5))
})

let activityTimer;
socket.on('activity', (name) => {
    activity.textContent = `${name} is typing...`
    clearTimeout(activityTimer)
    activityTimer = setTimeout(() => {
        activity.textContent = ''
    }, 3000)
})

socket.on('userlist', ({ users }) => {
    showUsers(users)
})

socket.on('roomList', ({ rooms }) => {
    showRooms(rooms)
})

// Update room list
function showUsers(users) {
    userList.textContent = ''
    if (users) {
        userList.innerHTML = `<em>Users in ${roomInput.value}:</em>`
        users.forEach((user, i) => {
            userList.textContent += ` ${user.name}`
            if (users.length > 1 && i !== users.length - 1) {
                userList.textContent += ","
            }
        })
    }
}

// Update user list
function showRooms(rooms) {
    roomList.textContent = ''
    if (rooms) {
        roomList.innerHTML = '<em>Active Rooms:</em>'
        rooms.forEach((room, i) => {
            roomList.textContent += ` ${room}`
            if (rooms.length > 1 && i !== rooms.length - 1) {
                roomList.textContent += ","
            }
        })
    }
}
