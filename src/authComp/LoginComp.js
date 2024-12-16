import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './LoginComp.css'; // CSS dosyasını import edin

function LoginComp() {
    const [LoginText, setLoginText] = useState('');
    const [LoginPassword, setLoginPasswword] = useState('');
    const navigate = useNavigate();

    const Login = () => {
        fetch('http://localhost:433/login', {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ email: LoginText, password: LoginPassword })
        }).then(resp => {
            console.log(resp);
            if (resp.status === 202) {
                return resp.json();
            } else if (resp.status === 204) {
                alert("user not found")
            } else {
                alert('wrong pass');
            }
        }).then(data => {
            console.log(data);
            if (typeof data === 'object' && data !== null) {
                document.cookie = "token=" + data.token + ';';
                document.cookie = "id=" + data.id + ";";
                document.cookie = "username=" + data.username + ";";
                navigate('/selectchat');
            }
        })
    }

    return (
        <div className="login-container">
            <h3>Login Page</h3>
            <input type="text" placeholder="Email" value={LoginText} onChange={(e) => setLoginText(e.target.value)} id="LoginText" />
            <input type="password" placeholder="Password" value={LoginPassword} onChange={e => setLoginPasswword(e.target.value)} id="LoginPass" />
            <button onClick={Login}>LOGIN</button>
            <Link to="/register">Register!</Link>
        </div>
    );
}

export default LoginComp;
