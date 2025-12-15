import express from 'express';
const app = express();
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from "./routes/likes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';


// middle wares
app.use(express.json());
app.use(cors());
app.use(cookieParser());
 

app.use('/backend/users', userRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/posts', postRoutes);
app.use('/backend/comments', commentRoutes);
app.use("/backend/likes", likeRoutes);
app.listen(8800, () => {
    console.log("Server started on port 8800\nAPI is working");
});