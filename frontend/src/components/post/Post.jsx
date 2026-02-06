import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [taggedNames, setTaggedNames] = useState([]);

  const { currentUser } = useContext(AuthContext);

  // Fetch tagged user names
  useEffect(() => {
    if (post.taggedUsers) {
      const ids = post.taggedUsers.split(",").filter(Boolean);
      if (ids.length > 0) {
        Promise.all(
          ids.map((id) =>
            makeRequest.get("/users/find/" + id).then((res) => res.data)
          )
        ).then((users) => setTaggedNames(users));
      }
    }
  }, [post.taggedUsers]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["likes"] });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete("/posts/" + postId);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic ? "/upload/" + post.profilePic : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <div className="postMeta">
                <span className="date">{moment(post.createdAt).fromNow()}</span>
                {post.location && (
                  <span className="location">
                    <LocationOnIcon style={{ fontSize: 14, color: "#e74c3c" }} />
                    {post.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {taggedNames.length > 0 && (
            <div className="taggedFriends">
              <LocalOfferIcon style={{ fontSize: 14, color: "#5271ff" }} />
              <span>
                with{" "}
                {taggedNames.map((u, i) => (
                  <span key={u.id}>
                    <Link to={`/profile/${u.id}`} style={{ color: "#5271ff", textDecoration: "none" }}>
                      {u.name}
                    </Link>
                    {i < taggedNames.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            </div>
          )}
          {post.img && <img src={"/upload/" + post.img} alt="" />}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;