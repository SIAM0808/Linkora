import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Search users by name or username
export const searchUsers = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const searchTerm = req.query.q;
    if (!searchTerm) return res.status(200).json([]);

    const q = `SELECT id, name, username, profilePic FROM users 
               WHERE (name LIKE ? OR username LIKE ?) AND id != ? 
               LIMIT 10`;

    const search = `%${searchTerm}%`;
    db.query(q, [search, search, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// Get suggested users (users not followed by current user)
export const getSuggestions = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT id, name, profilePic FROM users 
               WHERE id != ? 
               AND id NOT IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
               ORDER BY RAND() LIMIT 5`;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// Get latest activities (recent posts from followed users)
export const getActivities = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT p.id, p.desc, p.img, p.createdAt, u.id AS userId, u.name, u.profilePic 
               FROM posts AS p 
               JOIN users AS u ON u.id = p.userId 
               WHERE p.userId IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
               ORDER BY p.createdAt DESC LIMIT 10`;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// Get friends (users that current user follows)
export const getFriends = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `SELECT u.id, u.name, u.profilePic 
               FROM users AS u 
               JOIN relationships AS r ON u.id = r.followedUserId 
               WHERE r.followerUserId = ?`;

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePic`=?,`coverPic`=?,`facebook`=?,`instagram`=?,`twitter`=?,`linkedin`=?,`pinterest`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.website,
        req.body.profilePic,
        req.body.coverPic,
        req.body.facebook,
        req.body.instagram,
        req.body.twitter,
        req.body.linkedin,
        req.body.pinterest,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your post!");
      }
    );
  });
};

export const deleteUser = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Delete all related data in order (respecting foreign keys)
    const deleteComments = "DELETE FROM comments WHERE userId = ?";
    const deleteLikes = "DELETE FROM likes WHERE userId = ?";
    const deleteStories = "DELETE FROM stories WHERE userId = ?";
    const deletePosts = "DELETE FROM posts WHERE userId = ?";
    const deleteRelFollower = "DELETE FROM relationships WHERE followerUserId = ?";
    const deleteRelFollowed = "DELETE FROM relationships WHERE followedUserId = ?";
    const deleteUserQuery = "DELETE FROM users WHERE id = ?";

    db.query(deleteComments, [userInfo.id], (err) => {
      if (err) return res.status(500).json(err);
      db.query(deleteLikes, [userInfo.id], (err) => {
        if (err) return res.status(500).json(err);
        db.query(deleteStories, [userInfo.id], (err) => {
          if (err) return res.status(500).json(err);
          db.query(deletePosts, [userInfo.id], (err) => {
            if (err) return res.status(500).json(err);
            db.query(deleteRelFollower, [userInfo.id], (err) => {
              if (err) return res.status(500).json(err);
              db.query(deleteRelFollowed, [userInfo.id], (err) => {
                if (err) return res.status(500).json(err);
                db.query(deleteUserQuery, [userInfo.id], (err, data) => {
                  if (err) return res.status(500).json(err);
                  if (data.affectedRows > 0) {
                    return res
                      .clearCookie("access_token", {
                        secure: true,
                        sameSite: "none",
                      })
                      .status(200)
                      .json("User has been deleted.");
                  }
                  return res.status(403).json("User not found!");
                });
              });
            });
          });
        });
      });
    });
  });
};