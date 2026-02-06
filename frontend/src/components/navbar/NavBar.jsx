import  "./navBar.scss";
import { Link, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { useContext, useState, useRef, useEffect } from "react";
import { DarkModeContext } from "../../context/darkmodeContext";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const DEFAULT_PFP = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

const NavBar = () => {
    const { toggle, darkMode } = useContext(DarkModeContext);
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Close menu / search when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search users with debounce
    useEffect(() => {
        if (!searchText.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const res = await makeRequest.get(`/users/search?q=${searchText}`);
                setSearchResults(res.data);
                setShowResults(true);
            } catch (err) {
                console.log(err);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchText]);

    const handleResultClick = (userId) => {
        setSearchText("");
        setSearchResults([]);
        setShowResults(false);
        navigate(`/profile/${userId}`);
    };

    const handleLogout = async () => {
        try {
            await makeRequest.post("/auth/logout");
            setCurrentUser(null);
            localStorage.removeItem("user");
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone. All your posts, comments, and data will be permanently removed."
        );
        if (!confirmed) return;

        try {
            await makeRequest.delete("/users");
            setCurrentUser(null);
            localStorage.removeItem("user");
            navigate("/login");
        } catch (err) {
            console.log(err);
        }
    };

    return(
        <div className="navbar">
            <div className="left">
                <Link to="/" style={{textDecoration: "none", color: "inherit"}}>
                <span>Linkora</span>
                </Link>
                <HomeOutlinedIcon/>
                {darkMode ? (
                    <WbSunnyOutlinedIcon onClick={toggle}/>
                ) : (
                    <DarkModeOutlinedIcon onClick={toggle}/>
                )}
                <GridViewOutlinedIcon/>
                <div className="search" ref={searchRef}>
                    <SearchOutlinedIcon/>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onFocus={() => searchText.trim() && setShowResults(true)}
                    />
                    {showResults && searchResults.length > 0 && (
                        <div className="searchResults">
                            {searchResults.map((user) => (
                                <div
                                    className="searchItem"
                                    key={user.id}
                                    onClick={() => handleResultClick(user.id)}
                                >
                                    <img
                                        src={user.profilePic ? "/upload/" + user.profilePic : DEFAULT_PFP}
                                        alt=""
                                    />
                                    <div className="searchItemInfo">
                                        <span className="name">{user.name}</span>
                                        <span className="username">@{user.username}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {showResults && searchText.trim() && searchResults.length === 0 && (
                        <div className="searchResults">
                            <div className="noResults">No users found</div>
                        </div>
                    )}
                </div>
            </div>
            <div className="right"> 
                <PersonOutlinedIcon/>
                <EmailOutlinedIcon/>
                <NotificationsOutlinedIcon/>
                {currentUser && (
                    <div className="user" ref={menuRef}>
                        <img
                            src={currentUser.profilePic ? "/upload/" + currentUser.profilePic : "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"}
                            alt=""
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{ cursor: "pointer" }}
                        />
                        <span onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: "pointer" }}>{currentUser.name}</span>

                        {menuOpen && (
                            <div className="userMenu">
                                <Link to={`/profile/${currentUser.id}`} style={{ textDecoration: "none", color: "inherit" }} onClick={() => setMenuOpen(false)}>
                                    <div className="menuItem">
                                        <AccountCircleOutlinedIcon />
                                        <span>My Profile</span>
                                    </div>
                                </Link>
                                <div className="menuItem" onClick={() => { toggle(); setMenuOpen(false); }}>
                                    <SettingsOutlinedIcon />
                                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                                </div>
                                <hr />
                                <div className="menuItem" onClick={handleLogout}>
                                    <LogoutIcon />
                                    <span>Logout</span>
                                </div>
                                <div className="menuItem danger" onClick={handleDeleteAccount}>
                                    <DeleteOutlineIcon />
                                    <span>Delete Account</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default NavBar;