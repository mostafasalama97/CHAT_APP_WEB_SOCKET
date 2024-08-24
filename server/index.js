// import express from 'express'
// import { Server } from "socket.io"
// import path from 'path'
// import { fileURLToPath } from 'url'
// import cors from 'cors';


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const PORT = process.env.PORT || 3500
// const ADMIN = "Admin"


// const app = express();

// // Enable CORS
// app.use(cors({
//     origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5500", "http://127.0.0.1:5500"],
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type"],
//     credentials: true
// }));


// app.use(express.static(path.join(__dirname, 'public')));

// const expressServer = app.listen(PORT, () => console.log(`server is running on port ${PORT}`))

// // state ==> it is look like useState in react
// const usersState = {
//     users: [],
//     setUsers: function (newUsersArray) {
//         this.users = newUsersArray
//     }
// }



// const io = new Server(expressServer, {
//     cors: {
//         origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5500", "http://127.0.0.1:5500"],
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Content-Type"],
//         credentials: true
//     }
// })


// io.on('connection', (socket) => {
//     console.log(`user ${socket.id} is connected`)

//     // upon connection - only to user
//     socket.emit('message', buildMsg(ADMIN, 'welcome To Chat App'))


//     socket.on('enterRoom', ({ name, room }) => {
//         // leave prvious room if user in another room
//         const previousRoom = getUser(socket.id)?.room
//         if (previousRoom) {
//             socket.leave(previousRoom)
//             io.to(previousRoom).emit('message', buildMsg(ADMIN, `${getUser(socket.id).name} has left the room`)
//             )
//         }

//         // activate the user that want to join the room
//         const user = activateUser(socket.id, name, room)
//         if (previousRoom) {
//             io.to(previousRoom).emit('userList', {
//                 users: getUsersInRoom(previousRoom)
//             })
//         }

//         // join room
//         socket.join(user.room)

//         // to user who enter the room
//         socket.emit('message', buildMsg(ADMIN, 'welcome To Chat App'))
//         //to everyone else
//         socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))

//         //update user list for room
//         io.to(user.room).emit('userList', {
//             users: getUsersInRoom(user.room)
//         })

//         //update room list for everyone

//         io.emit('roomList', {
//             rooms: getAllActiveRooms()
//         })
//     })

//     // when user disconnected - to all others
//     socket.on('disconnect', () => {
//         const user = getUser(socket.id)
//         userLeaveApp(socket.id)

//         if (user) {
//             io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`))
// // update user in room
//             io.to(user.room).emit('userList', {
//                 users: getUsersInRoom(user.room)
//             })
// // update room list
//             io.emit('roomList', {
//                 rooms: getAllActiveRooms()
//             })
//         }
//     }
//     )


//     // // upon connection - to all others - not needed any more
//     // socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)} connected`)
//     // socket.on('message', (data) => {
//     //     console.log("data", data)
//     //     io.emit('message', `${socket.id.substring(0, 5)}:  ${data}`)
//     // })


//     // listen for message event
//     socket.on('message', ({name , text}) => {
//         const room = getUser(socket.id)?.room
//         if(room){
//             io.to(room).emit('message', buildMsg(name,text))

//         }
//     })

//     // listen for activity
//     socket.on('activity', (name) => {
//         const room = getUser(socket.id)?.room
//         if(room){
//         socket.broadcast.to(room).emit('activity', name)
//         }
//     })
// })

// // httpServer.listen(3500 , () => console.log("server is running on port 3500"))

// // who create message => name
// // context => text
// function buildMsg(name, text) {
//     return {
//         name,
//         text,
//         time: new Intl.DateTimeFormat('default', {
//             hour: 'numeric',
//             minute: 'numeric',
//             second: 'numeric'
//         }).format(new Date())
//     }
// }


// // user function impact on userState
// function activateUser(id, name, room) {
//     const user = {
//         id,
//         name,
//         room
//     }
//     // filter to ensure not duplicate the user in the same room
//     usersState.setUsers([...usersState.users.filter((user) => {
//         user.id !== id
//     }), user])
//     return user
// }


// // function when user leave the application
// function userLeaveApp(userId) {
//     // just one user will leave so you donot need to spread th array like what happened in activateUser
//     usersState.setUsers([usersState.users.filter((user) => {
//         user.id !== userId
//     })])
// }


// // function to get user
// function getUser(userId) {
//     return usersState.users.find((user) => user.id === userId)
// }

// function getUsersInRoom(roomId) {
//     return usersState.users.filter((user) => user.room === roomId)
// }
// function getAllActiveRooms() {
//     return Array.from(new Set(usersState.users.map(user => user.room)))
// }




import express from 'express'
import { Server } from "socket.io"
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 3500
const ADMIN = "Admin"

const app = express()

// Enable CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5500", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}))

app.use(express.static(path.join(__dirname, 'public')))

const expressServer = app.listen(PORT, () => console.log(`server is running on port ${PORT}`))

const usersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray
    }
}

const io = new Server(expressServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ["http://localhost:5500", "http://127.0.0.1:5500"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log(`user ${socket.id} is connected`)

    // upon connection - only to user
    socket.emit('message', buildMsg(ADMIN, 'Welcome to Chat App'))

    socket.on('enterRoom', ({ name, room }) => {
        const previousRoom = getUser(socket.id)?.room
        if (previousRoom) {
            socket.leave(previousRoom)
            io.to(previousRoom).emit('message', buildMsg(ADMIN, `${getUser(socket.id)?.name} has left the room`))
            io.to(previousRoom).emit('userlist', { users: getUsersInRoom(previousRoom) })
        }

        const user = activateUser(socket.id, name, room)

        socket.join(user.room)
        socket.emit('message', buildMsg(ADMIN, 'Welcome to the room'))
        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`))
        io.to(user.room).emit('userlist', { users: getUsersInRoom(user.room) })
        io.emit('roomList', { rooms: getAllActiveRooms() })
    })

    socket.on('disconnect', () => {
        const user = getUser(socket.id)
        userLeaveApp(socket.id)

        if (user) {
            io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`))
            io.to(user.room).emit('userlist', { users: getUsersInRoom(user.room) })
            io.emit('roomList', { rooms: getAllActiveRooms() })
        }
    })

    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room
        if (room) {
            io.to(room).emit('message', buildMsg(name, text))
        }
    })

    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room
        if (room) {
            socket.broadcast.to(room).emit('activity', name)
        }
    })
})


function getRandomColor() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function getUserByName(name) {
    return usersState.users.find(user => user.name === name)
}

function buildMsg(name, text) {
    const user = getUserByName(name)

    return {
        name,
        text,
        color: user?.color || 'blue',
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date()),
        color: getRandomColor()
    }
}

function activateUser(id, name, room) {
    const user = { id, name, room }
    usersState.setUsers(usersState.users.filter(user => user.id !== id).concat(user))
    return user
}

function userLeaveApp(userId) {
    usersState.setUsers(usersState.users.filter(user => user.id !== userId))
}

function getUser(userId) {
    return usersState.users.find(user => user.id === userId)
}

function getUsersInRoom(roomId) {
    return usersState.users.filter(user => user.room === roomId)
}

function getAllActiveRooms() {
    return Array.from(new Set(usersState.users.map(user => user.room)))
}
