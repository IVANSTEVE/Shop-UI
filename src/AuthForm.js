import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onHide, setUser }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation des champs
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Tous les champs sont requis");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            const response = await fetch('http://localhost:8090/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'inscription");
            }

            const user = await response.json();
            setUser(user); // Mettre à jour l'utilisateur dans le parent
            onHide(); // Ferme le formulaire
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validation des champs
        if (!formData.email || !formData.password) {
            setError("Email et mot de passe sont requis");
            return;
        }

        try {
            const response = await fetch('http://localhost:8090/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la connexion");
            }

            const data = await response.json();

            // Stockez le token JWT si fourni
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            setUser(data.user); // Mettre à jour l'utilisateur dans le parent
            onHide(); // Ferme le formulaire
        } catch (err) {
            setError(err.message);
        }
    };


    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError(null); // Réinitialiser les erreurs en changeant de mode
    };

    return (
        <div className="auth-form-container">
            <div className="formWrapper">
                <div className="card">
                    <div className="card-header">
                        <div
                            className={`form-header ${isLoginMode ? 'active' : ''}`}
                            onClick={() => setIsLoginMode(true)}
                        >
                            Se connecter
                        </div>
                        <div
                            className={`form-header ${!isLoginMode ? 'active' : ''}`}
                            onClick={() => setIsLoginMode(false)}
                        >
                            S'inscrire
                        </div>
                    </div>
                    <div className="card-body">
                        {error && <div className="error-message">{error}</div>}
                        {isLoginMode ? (
                            <form id="loginForm" onSubmit={handleLogin}>
                                <input type="text" name="email" className="form-control" placeholder="Email" onChange={handleChange}/>
                                <input type="password" name="password" className="form-control" placeholder="Mot de passe" onChange={handleChange}/>
                                <label>
                                    <input type="checkbox" className="form-check" />
                                    Se Souvenir de moi
                                </label>
                                <button type="submit" className="formButton">Connexion</button>
                                <hr />
                                <button onClick={onHide} type="button" className="formButton2">Fermer</button>
                            </form>
                        ) : (
                            <form id="registerForm" onSubmit={handleRegister}>
                                <input type="text" name="nom" className="form-control" placeholder="Nom" onChange={handleChange}/>
                                <input type="text" name="prenom" className="form-control" placeholder="Prenom" onChange={handleChange}/>
                                <input type="text" name="email" className="form-control" placeholder="Email" onChange={handleChange}/>
                                <input type="password" name="password" className="form-control" placeholder="Mot de passe" onChange={handleChange}/>
                                <input type="password" name="confirmPassword" className="form-control" placeholder="Confirmer mot de passe" onChange={handleChange}/>
                                <label>
                                    <input type="checkbox" className="form-check" />
                                    J'accepte les termes de l'accord
                                </label>
                                <button type="submit" className="formButton">Inscription</button>
                                <hr />
                                <button onClick={onHide} type="button" className="formButton2">Fermer</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;

