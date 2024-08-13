import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import postRoute from './routes/post.route.js';
import authRoute from './routes/auth.route.js';
import testRoute from './routes/test.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import messageRoute from './routes/message.route.js';

const app = express();

// app.use(cors({
//                 // origin: "https://localhost:5173/",
//                 origin: "*",
//                 methods: ["GET", "POST"],
//                 allowedHeaders: ['Content-Type', 'Authorization'], 
//                 credentials: true,
//                 // methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//             }));
app.use(cors({
    origin: 'http://localhost:5173', // Your React app URL  
    origin: 'https://estate-client-ym15.onrender.com', 
    credentials: true // Allow credentials
    }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/test', testRoute);
app.use('/api/posts', postRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);


app.listen(8800, () => {
    console.log('Server is running!'); 
})