import React, { useState } from 'react';
import './AuthForm.css';

function AuthForm({ onHide }) {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
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
                        {isLoginMode ? (
                            <form id="loginForm">
                                <input type="text" className="form-control" placeholder="@Utilisateur" />
                                <input type="password" className="form-control" placeholder="Mot de passe" />
                                <label>
                                    <input type="checkbox" className="form-check" />
                                    Se Souvenir de moi
                                </label>
                                <button type="submit" className="formButton">Connexion</button>
                                <hr />
                                <button onClick={onHide} type="danger" className="formButton2">Fermer le formulaire{/* Bouton pour fermer le formulaire */} </button>
                            </form>
                        ) : (
                            <form id="registerForm">
                                <input type="text" className="form-control" placeholder="@Utilisateur" />
                                <input type="password" className="form-control" placeholder="Mot de passe" />
                                <input type="password" className="form-control" placeholder="Confirmer mot de passe" />
                                <label>
                                    <input type="checkbox" className="form-check" />
                                    J'accepte les termes de l'accord
                                </label>
                                <button type="submit" className="formButton">Inscription</button>
                                <hr />
                                
                                <button onClick={onHide} type="danger" className="formButton2">Fermer le formulaire{/* Bouton pour fermer le formulaire */} </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;

