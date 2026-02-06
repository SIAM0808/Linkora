import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getStories = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log("=== FETCHING STORIES ===");
    console.log("User ID:", userInfo.id);

    // Get stories from followed users + own stories, only from the last 24 hours
    const q = `SELECT s.*, u.id AS userId, name, profilePic 
      FROM stories AS s 
      JOIN users AS u ON (u.id = s.userId)
      LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId = ?)
      WHERE (r.followerUserId = ? OR s.userId = ?)
      AND s.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      ORDER BY s.createdAt DESC`;

    db.query(q, [userInfo.id, userInfo.id, userInfo.id], (err, data) => {
      if (err) {
        console.log("Database error:", err);
        return res.status(500).json(err);
      }
      console.log("Stories found:", data.length);
      console.log("Stories data:", data);
      return res.status(200).json(data);
    });
  });
};

export const addStory = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log("=== ADDING STORY ===");
    console.log("Image:", req.body.img);
    console.log("User ID:", userInfo.id);

    const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) {
        console.log("Database error:", err);
        return res.status(500).json(err);
      }
      console.log("Story created successfully!");
      return res.status(200).json("Story has been created.");
    });
  });
};

export const deleteStory = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your story!");
    });
  });
};
