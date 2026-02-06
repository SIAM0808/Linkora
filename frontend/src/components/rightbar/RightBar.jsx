import "./rightBar.scss";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const DEFAULT_PFP =
  "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState([]);

  // Suggestions: users you don't follow
  const { data: suggestions } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () => makeRequest.get("/users/suggestions").then((res) => res.data),
  });

  // Latest activities: recent posts from people you follow
  const { data: activities } = useQuery({
    queryKey: ["activities"],
    queryFn: () => makeRequest.get("/users/activities").then((res) => res.data),
  });

  // Friends: users you follow
  const { data: friends } = useQuery({
    queryKey: ["friends"],
    queryFn: () => makeRequest.get("/users/friends").then((res) => res.data),
  });

  // Follow mutation for suggestions
  const followMutation = useMutation({
    mutationFn: (userId) => makeRequest.post("/relationships", { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const handleDismiss = (userId) => {
    setDismissed((prev) => [...prev, userId]);
  };

  const getActivityText = (activity) => {
    if (activity.img) return "shared a new photo";
    if (activity.desc) return "posted an update";
    return "shared a post";
  };

  return (
    <div className="rightBar">
      <div className="container">
        {/* Suggestions For You */}
        <div className="item">
          <span>Suggestions For You</span>
          {suggestions?.filter((s) => !dismissed.includes(s.id)).length === 0 && (
            <p style={{ fontSize: "13px", color: "gray" }}>No suggestions right now</p>
          )}
          {suggestions
            ?.filter((s) => !dismissed.includes(s.id))
            .map((user) => (
              <div className="user" key={user.id}>
                <div className="userInfo">
                  <img
                    src={
                      user.profilePic
                        ? "/upload/" + user.profilePic
                        : DEFAULT_PFP
                    }
                    alt=""
                  />
                  <Link
                    to={`/profile/${user.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span>{user.name}</span>
                  </Link>
                </div>
                <div className="buttons">
                  <button onClick={() => followMutation.mutate(user.id)}>
                    follow
                  </button>
                  <button onClick={() => handleDismiss(user.id)}>
                    dismiss
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Latest Activities */}
        <div className="item">
          <span>Latest Activities</span>
          {activities?.length === 0 && (
            <p style={{ fontSize: "13px", color: "gray" }}>No recent activity</p>
          )}
          {activities?.map((activity) => (
            <div className="user" key={activity.id}>
              <div className="userInfo">
                <img
                  src={
                    activity.profilePic
                      ? "/upload/" + activity.profilePic
                      : DEFAULT_PFP
                  }
                  alt=""
                />
                <p>
                  <Link
                    to={`/profile/${activity.userId}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <span>{activity.name}</span>
                  </Link>{" "}
                  {getActivityText(activity)}
                </p>
              </div>
              <span>{moment(activity.createdAt).fromNow()}</span>
            </div>
          ))}
        </div>

        {/* Friends */}
        <div className="item">
          <span>Friends</span>
          {friends?.length === 0 && (
            <p style={{ fontSize: "13px", color: "gray" }}>No friends yet</p>
          )}
          {friends?.map((friend) => (
            <div className="user" key={friend.id}>
              <div className="userInfo">
                <img
                  src={
                    friend.profilePic
                      ? "/upload/" + friend.profilePic
                      : DEFAULT_PFP
                  }
                  alt=""
                />
                <div className="online" />
                <Link
                  to={`/profile/${friend.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span>{friend.name}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;