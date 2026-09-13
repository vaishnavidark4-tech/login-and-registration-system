import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email,
                    password
                }
            );

            console.log(response.data);

            // Save JWT token
            localStorage.setItem(
                "token",
                response.data.token
            );

            alert("Login Successful");

            // Move to dashboard
            navigate("/dashboard");

        } catch(error) {
            console.log(error);
            alert("Invalid Login");
        }
    };


    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <br/>

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                <br/>

                <button type="submit">
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;