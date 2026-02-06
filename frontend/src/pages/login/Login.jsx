import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import "./login.scss";
const Login = () => {

    const [inputs, setInputs] = useState({
        username: "",
        password: "",
    });

    const [err, setErr] = useState(false);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(inputs);
    }

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await login(inputs);
            navigate("/")
        }catch(err){
            setErr(err.response?.data || "Connection error. Please check if the server is running.");
        }
    };
    return <div className="login">
        <div className="card">
            <div className="left">
                <h1>Linkora</h1>
                <p>Connect with friends and the world around you on Linkora.
                </p>
                <span>Haven't account?</span>
                <Link to="/register">
                    <button>Register</button>
                </Link>
            </div>
            <div className="right">
                <h1>Login</h1>
                <form>
                    <input type="text" placeholder="Username" name="username" onChange={handleChange} />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                    {err && <span>{err}</span>}
                    <button onClick={handleLogin}>Login</button>
                </form>
            </div>
        </div>
    </div>
}
export default Login;