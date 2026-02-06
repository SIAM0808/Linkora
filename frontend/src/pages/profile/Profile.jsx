import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  });

  const { isLoading: rIsLoading, data: relationshipData } = useQuery({
    queryKey: ["relationship", userId],
    queryFn: () => makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
      return res.data;
    })
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following)
        return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["relationship"] });
    },
  });

  const handleFollow = () => {
    mutation.mutate(relationshipData.includes(currentUser.id));
  };

  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={data.coverPic ? "/upload/" + data.coverPic : "https://placehold.co/800x300/e0e0e0/e0e0e0"} alt="" className="cover" />
            <img src={data.profilePic ? "/upload/" + data.profilePic : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href={data.facebook || "#"} target={data.facebook ? "_blank" : ""} rel="noreferrer" style={{ opacity: data.facebook ? 1 : 0.3 }}>
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href={data.instagram || "#"} target={data.instagram ? "_blank" : ""} rel="noreferrer" style={{ opacity: data.instagram ? 1 : 0.3 }}>
                  <InstagramIcon fontSize="large" />
                </a>
                <a href={data.twitter || "#"} target={data.twitter ? "_blank" : ""} rel="noreferrer" style={{ opacity: data.twitter ? 1 : 0.3 }}>
                  <TwitterIcon fontSize="large" />
                </a>
                <a href={data.linkedin || "#"} target={data.linkedin ? "_blank" : ""} rel="noreferrer" style={{ opacity: data.linkedin ? 1 : 0.3 }}>
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href={data.pinterest || "#"} target={data.pinterest ? "_blank" : ""} rel="noreferrer" style={{ opacity: data.pinterest ? 1 : 0.3 }}>
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>
                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;