import { useContext, useState } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["stories"],
    queryFn: () =>
      makeRequest.get("/stories").then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (newStory) => {
      return makeRequest.post("/stories", newStory);
    },
    onSuccess: () => {
      console.log("Story posted successfully, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
    onError: (error) => {
      console.log("Story post error:", error);
    },
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      console.log("Story upload response:", res.data);
      return res.data;
    } catch (err) {
      console.log("Story upload error:", err);
      return null;
    }
  };

  const handleAddStory = async () => {
    if (!file) return;
    console.log("Starting story upload...");
    const imgUrl = await upload();
    console.log("Image URL received:", imgUrl);
    if (imgUrl) {
      console.log("Posting story to backend:", { img: imgUrl });
      mutation.mutate({ img: imgUrl });
    } else {
      console.log("No image URL, story not posted");
    }
    setFile(null);
  };

  return (
    <div className="stories">
      {/* Current user's add story card */}
      <div className="story">
        {file ? (
          <>
            <img src={URL.createObjectURL(file)} alt="" />
            <button onClick={handleAddStory}>✓</button>
            <span>{currentUser.name}</span>
          </>
        ) : (
          <>
            <img
              src={
                currentUser.profilePic
                  ? "/upload/" + currentUser.profilePic
                  : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
              }
              alt=""
            />
            <span>{currentUser.name}</span>
            <label htmlFor="storyFile">
              <button
                onClick={() => document.getElementById("storyFile").click()}
              >
                +
              </button>
            </label>
            <input
              type="file"
              id="storyFile"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files[0]) setFile(e.target.files[0]);
              }}
            />
          </>
        )}
      </div>
      {/* Other users' stories */}
      {error
        ? ""
        : isLoading
        ? "loading"
        : data.map((story) => (
            <div className="story" key={story.id}>
              <img src={"/upload/" + story.img} alt="" />
              <span>{story.name}</span>
            </div>
          ))}
    </div>
  );
};

export default Stories;