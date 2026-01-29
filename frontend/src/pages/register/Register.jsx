import { Link } from "react-router-dom";
import "./register.scss";
const Register = () => {
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
                    <input type="text" placeholder="Username" />
                    <input type="text" placeholder="Email" />
                    <input type="text" placeholder="Name" />
                    <input type="password" placeholder="Password" />
                    <button>Register</button>
                </form>
            </div>
        </div>
    </div>
}
export default Register;