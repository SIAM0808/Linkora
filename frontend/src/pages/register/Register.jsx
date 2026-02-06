import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios";
const Register = () => {

    const navigate = useNavigate();

    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        name: "",
        password: "",
    });

    const [err, setErr] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        // Clear error when user starts typing
        if (err) setErr(null);
    }

    const handleClick = async (e) =>{
        e.preventDefault();
        setErr(null);
        setLoading(true);
        
        try{
            const response = await axios.post("http://localhost:8800/backend/auth/register", inputs);
            setSuccess(true);
            setErr(null);
            
            // Clear the form
            setInputs({
                username: "",
                email: "",
                name: "",
                password: "",
            });
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 2000);
            
        }catch(err){
            setSuccess(false);
            // Get error message from backend response
            if (err.response && err.response.data) {
                setErr(err.response.data);
            } else {
                setErr("Something went wrong! Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    // console.log(err);

    return <div className="register">
        <div className="card">
            <div className="left">
                <h1>Hey There!</h1>
                <p>Enjoy your day at Linkora
                </p>
                <span>Have an account?</span>
                <Link to="/login"> 
                <button>Login</button>
                </Link>
            </div>
            <div className="right">
                <h1>Register</h1>
                <form>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        name="username" 
                        value={inputs.username}
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        name="email" 
                        value={inputs.email}
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    <input 
                        type="text" 
                        placeholder="Name" 
                        name="name" 
                        value={inputs.name}
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        value={inputs.password}
                        onChange={handleChange} 
                        disabled={loading}
                    />
                    {err && <span style={{color: "red", fontSize: "12px"}}>{err}</span>}
                    {success && <span style={{color: "green", fontSize: "12px"}}>Registration successful! Redirecting to login...</span>}
                    <button onClick={handleClick} disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    </div>
}
export default Register;