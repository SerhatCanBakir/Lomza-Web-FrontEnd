import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './RegisterComp.css'; // CSS dosyasını buradan import edin

function RegisterComp() {
    const [RegMail, setRegMail] = useState('');
    const [RegUsername, setRegUsername] = useState('');
    const [RegPass, setRegPass] = useState('');
    const navigate = useNavigate();

    const Register = () => {
        console.log("mail:" + RegMail + "\nusername:" + RegUsername + "\npass:" + RegPass);
        fetch('http://localhost:433/register', {
            method: "POST",
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({ email: RegMail, username: RegUsername, password: RegPass })
        }).then(resp => {
            if (resp.status === 201) {
                alert("Your account has been created.");
                navigate('/');
            } else if (resp.status === 406) {
                alert('Account already exists.');
            } else {
                alert("There is a problem, but we don't know what it is. :D");
            }
        });
    };

    return (
        <div className="register-container">
            <h3>Register Page</h3>
            <input type="email" placeholder="Email" value={RegMail} onChange={e => setRegMail(e.target.value)} />
            <input type="text" placeholder="Username" value={RegUsername} onChange={e => setRegUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={RegPass} onChange={e => setRegPass(e.target.value)} />
            <button onClick={Register}>REGISTER</button>
            <Link to="/">Login</Link>
        </div>
    );
}

export default RegisterComp;
