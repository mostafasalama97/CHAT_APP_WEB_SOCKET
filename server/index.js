import express from 'express';
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3500;
const ADMIN = "Admin";

const app = express();

app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const expressServer = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const usersState = {
    users: [],
    setUsers: function (newUsersArray) {
        this.users = newUsersArray;
    }
};

const io = new Server(expressServer, {
    cors: {
        origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
});

io.on('connection', (socket) => {
    console.log(`User ${socket.id} is connected`);

    socket.emit('message', buildMsg(ADMIN, 'Welcome to Chat App'));

    socket.on('enterRoom', ({ name, room }) => {
        const previousRoom = getUser(socket.id)?.room;
        if (previousRoom) {
            socket.leave(previousRoom);
            io.to(previousRoom).emit('message', buildMsg(ADMIN, `${getUser(socket.id)?.name} has left the room`));
            io.to(previousRoom).emit('userlist', { users: getUsersInRoom(previousRoom) });
        }

        const user = activateUser(socket.id, name, room);

        socket.join(user.room);
        socket.emit('message', buildMsg(ADMIN, 'Welcome to the room'));
        socket.broadcast.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has joined the room`));
        io.to(user.room).emit('userlist', { users: getUsersInRoom(user.room) });
        io.emit('roomList', { rooms: getAllActiveRooms() });
    });

    socket.on('disconnect', () => {
        const user = getUser(socket.id);
        userLeaveApp(socket.id);

        if (user) {
            io.to(user.room).emit('message', buildMsg(ADMIN, `${user.name} has left the room`));
            io.to(user.room).emit('userlist', { users: getUsersInRoom(user.room) });
            io.emit('roomList', { rooms: getAllActiveRooms() });
        }
    });

    socket.on('message', ({ name, text }) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            io.to(room).emit('message', buildMsg(name, text));
        }
    });

    socket.on('activity', (name) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            socket.broadcast.to(room).emit('activity', name);
        }
    });

    socket.on('file', ({ name, filePath }) => {
        const room = getUser(socket.id)?.room;
        if (room) {
            io.to(room).emit('file', { name, filePath });
        }
    });
});

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getUserByName(name) {
    return usersState.users.find(user => user.name === name);
}

function buildMsg(name, text) {
    const user = getUserByName(name);
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
    };
}

function activateUser(id, name, room) {
    const user = { id, name, room };
    usersState.setUsers(usersState.users.filter(user => user.id !== id).concat(user));
    return user;
}

function userLeaveApp(userId) {
    usersState.setUsers(usersState.users.filter(user => user.id !== userId));
}

function getUser(userId) {
    return usersState.users.find(user => user.id === userId);
}

function getUsersInRoom(roomId) {
    return usersState.users.filter(user => user.room === roomId);
}

function getAllActiveRooms() {
    return Array.from(new Set(usersState.users.map(user => user.room)));
}
