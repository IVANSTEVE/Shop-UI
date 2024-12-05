import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onHide, setUser }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        userName: '',
        userSurname: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // // Validation des champs
        // if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        //     setError("Tous les champs sont requis");
        //     return;
        // }
        // if (formData.password !== formData.confirmPassword) {
        //     setError("Les mots de passe ne correspondent pas");
        //     return;
        // }

        try {
            const response = await fetch('http://localhost:8090/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: formData.userName,
                    userSurname: formData.userSurname,
                    email: formData.email,
                    password: formData.password,
                    address: formData.address,
                    city: formData.city,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'inscription');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Stocke le token

            // Appeler immédiatement /me pour récupérer les infos utilisateur
            const userResponse = await fetch('http://localhost:8090/auth/me', {
                headers: { Authorization: `Bearer ${data.token}` },
            });

            if (!userResponse.ok) {
                throw new Error('Impossible de récupérer les informations utilisateur');
            }

            const userData = await userResponse.json();
            setUser(userData); // Mettre à jour l'état utilisateur
            onHide(); // Fermer le formulaire
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        setError(null); // Réinitialise les erreurs

        // Validation des champs
        if (!formData.email || !formData.password) {
            setError("Email et mot de passe sont requis");
            return;
        }

        try {
            // Étape 1 : Envoi de la requête de connexion
            const response = await fetch('http://localhost:8090/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                // Récupère les éventuels messages d'erreur depuis le backend
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la connexion");
            }

            // Étape 2 : Récupère le token JWT depuis la réponse
            const data = await response.json();
            const token = data.token;

            if (token) {
                // Enregistre le token dans le localStorage
                localStorage.setItem('token', token);

                // Étape 3 : Appel au backend pour récupérer les informations utilisateur
                const userResponse = await fetch('http://localhost:8090/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!userResponse.ok) {
                    throw new Error("Échec de la récupération des informations utilisateur");
                }

                // Étape 4 : Récupère les informations utilisateur et met à jour l'état
                const userData = await userResponse.json();
                setUser(userData); // Met à jour l'état utilisateur
                onHide(); // Ferme le formulaire d'authentification
            }
        } catch (err) {
            setError(err.message);
        }
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
                                <input type="text" name="userName" className="form-control" placeholder="Nom" onChange={handleChange}/>
                                <input type="text" name="userSurname" className="form-control" placeholder="Prénom" onChange={handleChange}/>
                                <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange}/>
                                <input type="password" name="password" className="form-control" placeholder="Mot de passe" onChange={handleChange}/>
                                <input type="password" name="confirmPassword" className="form-control" placeholder="Confirmer le mot de passe" onChange={handleChange}/>
                                <input type="text" name="address" className="form-control" placeholder="Adresse"
                                       onChange={handleChange}/>
                                <input type="text" name="city" className="form-control" placeholder="Ville"
                                       onChange={handleChange}/>
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

