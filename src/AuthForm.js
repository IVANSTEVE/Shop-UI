import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onHide, setUser, setShowCart }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState(null);

    // État local pour les données du formulaire
    const [formData, setFormData] = useState({
        userName: '',
        userSurname: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        postalCode: '',
    });

    // Réinitialiser les données du formulaire
    const resetFormData = () => {
        setFormData({
            userName: '',
            userSurname: '',
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            city: '',
            postalCode: '',
        });
        setError(null);
    };

    // Gérer les changements de formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Basculer entre les modes de connexion et d'inscription
    const toggleMode = (mode) => {
        setIsLoginMode(mode); // Change le mode
        resetFormData(); // Réinitialise le formulaire
    };

    // Gérer l'inscription
    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation JavaScript
        if (formData.password !== formData.confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }
        // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        //
        // if (!emailRegex.test(formData.email)) {
        //     setError("Veuillez entrer une adresse email valide.");
        //     return;
        // }
        const nameRegex = /^[a-zA-Z]{3,}$/;

        if (!nameRegex.test(formData.userName)) {
            setError("Le nom doit contenir au moins 3 lettres.");
            return;
        }

        if (!nameRegex.test(formData.userSurname)) {
            setError("Le prénom doit contenir au moins 3 lettres.");
            return;
        }
        if (!/^\d{4}$/.test(formData.postalCode)) {
            setError("Le code postal doit contenir exactement 4 chiffres.");
            return;
        }

        // Fetch API pour l'inscription
        try {
            const response = await fetch('http://localhost:8090/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    userName: formData.userName,
                    userSurname: formData.userSurname,
                    email: formData.email,
                    password: formData.password,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text(); // Lire la réponse texte
                throw new Error(errorData); // Lever une exception avec le message du serveur
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); // Stocke le token dans localStorage

            // Appeler immédiatement /me pour récupérer les infos utilisateur
            const userResponse = await fetch('http://localhost:8090/auth/me', {
                headers: {Authorization: `Bearer ${data.token}`},
            });

            if (!userResponse.ok) {
                throw new Error('Impossible de récupérer les informations utilisateur');
            }

            const userData = await userResponse.json();

            //Créer un panier vide pour le nouvel utilisateur
            const cartResponse = await fetch('http://localhost:8090/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${data.token}`,
                },
                body: JSON.stringify({
                    userId: userData.userId, // Associer le panier au nouvel utilisateur
                }),
            });

            if (!cartResponse.ok) {
                throw new Error("Erreur lors de la création du panier pour l'utilisateur.");
            }

            const newCart = await cartResponse.json();
            console.log("Panier créé :", newCart);

            setUser(userData); // Mettre à jour l'état utilisateur
            onHide(); // Fermer le formulaire
        }
        catch (errorData) {
                const errorResponse = JSON.parse(errorData.message); // Convertit le JSON en objet
                setError(errorResponse.error || "Une erreur est survenue."); // Affiche uniquement "Email déjà utilisé."
            }
    };

    // Gérer la connexion
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
                credentials: 'include',
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

                // Ouvre directement le panier après la connexion si il contient des produits
                if (userData.numberOfProductsInCart > 0) {
                    setShowCart(true);
                }
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
                                onClick={() => toggleMode(true)}
                        >
                            Se connecter
                        </div>
                        <div
                            className={`form-header ${!isLoginMode ? 'active' : ''}`}
                                onClick={() => toggleMode(false)}
                        >
                            S'inscrire
                        </div>
                    </div>
                    <div className="card-body">
                        {error && (
                            <div className="error-message">
                                <p>{error}</p>
                            </div>
                        )}
                        {isLoginMode ? (
                            <form id="loginForm" onSubmit={handleLogin}>
                                <input type="text" name="email" className="form-control" placeholder="Email" onChange={handleChange}/>
                                <input type="password" name="password" className="form-control" placeholder="Mot de passe" onChange={handleChange}/>
                                <button type="submit" className="formButton">Connexion</button>
                                <hr />
                                <button onClick={onHide} type="button" className="formButton2">Fermer</button>
                            </form>
                        ) : (
                            <form id="registerForm" onSubmit={handleRegister}>
                                <input
                                    type="text"
                                    name="userName"
                                    className="form-control"
                                    placeholder="Nom"
                                    required
                                    pattern="^[a-zA-Z]{3,}$"
                                    title="Le nom doit contenir au moins 3 lettres."
                                    value={formData.userName}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="userSurname"
                                    className="form-control"
                                    placeholder="Prénom"
                                    required
                                    pattern="^[a-zA-Z]{3,}$"
                                    title="Le prénom doit contenir au moins 3 lettres."
                                    value={formData.userSurname}
                                    onChange={handleChange}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="exemple@domaine.com"
                                    required
                                    pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                    title="Veuillez entrer une adresse email valide (ex. exemple@domain.com)"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Mot de passe"
                                    required
                                    minLength="6" // Validation supplémentaire pour un mot de passe minimum
                                    title="Le mot de passe doit contenir au moins 6 caractères."
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Confirmer le mot de passe"
                                    required
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    placeholder="Adresse"
                                    required
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    placeholder="Ville"
                                    required
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="postalCode"
                                    className="form-control"
                                    placeholder="Code Postal"
                                    required
                                    pattern="\d{4}" // Validation pour un code postal de 4 chiffres
                                    title="Le code postal doit contenir exactement 4 chiffres."
                                    onChange={handleChange}
                                />
                                <button type="submit" className="formButton">Inscription</button>
                            </form>


                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;

