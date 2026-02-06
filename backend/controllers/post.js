import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log("getPosts - userId:", userId);

    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
    LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =?
    ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log("=== CREATING POST ===");
    console.log("Description:", req.body.desc);
    console.log("Image:", req.body.img || "(no image)");
    console.log("User ID:", userInfo.id);
    
    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`, `location`, `taggedUsers`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img || "",
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.location || "",
      req.body.taggedUsers || "",
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("Database error:", err);
        return res.status(500).json(err);
      }
      console.log("Post created successfully!");
      return res.status(200).json("Post has been created.");
    });
  });
};


export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;

    // First delete all comments related to this post
    const deleteComments = "DELETE FROM comments WHERE `postId` = ?";
    db.query(deleteComments, [postId], (err) => {
      if (err) {
        console.log("Error deleting comments:", err);
        return res.status(500).json(err);
      }

      // Then delete all likes related to this post
      const deleteLikes = "DELETE FROM likes WHERE `postId` = ?";
      db.query(deleteLikes, [postId], (err) => {
        if (err) {
          console.log("Error deleting likes:", err);
          return res.status(500).json(err);
        }

        // Finally delete the post
        const deletePostQuery = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";
        db.query(deletePostQuery, [postId, userInfo.id], (err, data) => {
          if (err) {
            console.log("Error deleting post:", err);
            return res.status(500).json(err);
          }
          if (data.affectedRows > 0) {
            return res.status(200).json("Post has been deleted.");
          }
          return res.status(403).json("You can delete only your post");
        });
      });
    });
  });
};