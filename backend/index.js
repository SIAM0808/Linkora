import express from 'express';
const app = express();
import relationshipRoutes from './routes/relationships.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from "./routes/likes.js";
import storyRoutes from "./routes/stories.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';


// middle wares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", true);
    next();
});
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
// app.use(cors());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/backend/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log("File uploaded:", file);
  if (!file) {
    return res.status(400).json("No file uploaded");
  }
  res.status(200).json(file.filename);
});
 

app.use('/backend/users', userRoutes);
app.use('/backend/auth', authRoutes);
app.use('/backend/posts', postRoutes);
app.use('/backend/comments', commentRoutes);
app.use("/backend/likes", likeRoutes);
app.use("/backend/stories", storyRoutes);
app.use("/backend/relationships", relationshipRoutes);
app.listen(8800, () => {
    console.log("Server started on port 8800\nAPI is working");
});