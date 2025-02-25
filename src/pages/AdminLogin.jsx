import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.css"; // Create a new CSS file for admin styles


const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("https://qr-menu-backend-wc4q.onrender.com/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            console.log(data.token);
            navigate("/admin");
        } else {
            setError(data.message);
        }
    };

    return (
        <div className="admin-login-container">
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin} className="admin-login-form">
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default AdminLogin;
