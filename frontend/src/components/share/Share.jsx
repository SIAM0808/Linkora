import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const DEFAULT_PFP = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const tagRef = useRef(null);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      console.log("Upload response:", res.data);
      return res.data;
    } catch (err) {
      console.log("Upload error:", err);
      return "";
    }
  };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  // Fetch friends (followed users) for tagging
  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: () => makeRequest.get("/users/friends").then((res) => res.data),
  });

  // Close tag dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (tagRef.current && !tagRef.current.contains(e.target)) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleTagFriend = (friend) => {
    if (!taggedFriends.find((f) => f.id === friend.id)) {
      setTaggedFriends((prev) => [...prev, friend]);
    }
  };

  const handleRemoveTag = (friendId) => {
    setTaggedFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    console.log("Image URL to be saved:", imgUrl);
    const taggedUserIds = taggedFriends.map((f) => f.id).join(",");
    mutation.mutate({ desc, img: imgUrl, location, taggedUsers: taggedUserIds });
    setDesc("");
    setFile(null);
    setLocation("");
    setShowLocationInput(false);
    setTaggedFriends([]);
    setShowTagDropdown(false);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={currentUser.profilePic ? "/upload/" + currentUser.profilePic : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        {/* Show location input */}
        {showLocationInput && (
          <div className="locationInput">
            <LocationOnIcon style={{ color: "#e74c3c", fontSize: 18 }} />
            <input
              type="text"
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              autoFocus
            />
            <CloseIcon
              style={{ cursor: "pointer", fontSize: 18, color: "gray" }}
              onClick={() => { setShowLocationInput(false); setLocation(""); }}
            />
          </div>
        )}

        {/* Show tagged friends chips */}
        {taggedFriends.length > 0 && (
          <div className="taggedChips">
            <LocalOfferIcon style={{ color: "#5271ff", fontSize: 16 }} />
            {taggedFriends.map((f) => (
              <div className="chip" key={f.id}>
                <span>{f.name}</span>
                <CloseIcon
                  style={{ fontSize: 14, cursor: "pointer" }}
                  onClick={() => handleRemoveTag(f.id)}
                />
              </div>
            ))}
          </div>
        )}

        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div
              className="item"
              onClick={() => setShowLocationInput(!showLocationInput)}
            >
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item" ref={tagRef} style={{ position: "relative" }}>
              <div onClick={() => setShowTagDropdown(!showTagDropdown)} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={Friend} alt="" />
                <span>Tag Friends</span>
              </div>
              {showTagDropdown && (
                <div className="tagDropdown">
                  {friends?.length === 0 && (
                    <div className="tagItem noFriends">No friends to tag</div>
                  )}
                  {friends
                    ?.filter((f) => !taggedFriends.find((t) => t.id === f.id))
                    .map((friend) => (
                      <div
                        className="tagItem"
                        key={friend.id}
                        onClick={() => handleTagFriend(friend)}
                      >
                        <img
                          src={
                            friend.profilePic
                              ? "/upload/" + friend.profilePic
                              : DEFAULT_PFP
                          }
                          alt=""
                        />
                        <span>{friend.name}</span>
                      </div>
                    ))}
                  {friends?.filter((f) => !taggedFriends.find((t) => t.id === f.id)).length === 0 && friends?.length > 0 && (
                    <div className="tagItem noFriends">All friends tagged</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;