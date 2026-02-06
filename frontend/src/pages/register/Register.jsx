import { Link } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios";
const Register = () => {


    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        name: "",
        password: "",
    });

    const [err, setErr] = useState(null);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(inputs);
    }

    const handleClick = async (e) =>{
        e.preventDefault();
        try{
            await axios.post("http://localhost:8800/backend/auth/register", inputs);
        }catch(err){
            setErr(true);
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
                    <input type="text" placeholder="Username" name="username" onChange={handleChange} />
                    <input type="text" placeholder="Email" name="email" onChange={handleChange} />
                    <input type="text" placeholder="Name" name="name" onChange={handleChange} />
                    <input type="password" placeholder="Password" name="password" onChange={handleChange} />
                    {err && <span>Something went wrong!</span>}
                    <button onClick={handleClick}>Register</button>
                </form>
            </div>
        </div>
    </div>
}
export default Register;