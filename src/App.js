import React, {useEffect, useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Navbar, Nav, Button, Container} from "react-bootstrap";
import './App.css';
import useSWR from "swr";
import logo from './Logo_t_shirt_bis.png';
import headerview from './Headerview.jpg';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import './Card.css'; // Pour le style du drawer
import HomeScreen from './HomeScreen';
import CategoryPage from './CategoryPage';
import ProductDetails from './ProductDetails';
import AuthForm from './AuthForm';
import {getCookie} from './utils';
import CookieConsent from 'react-cookie-consent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FaqText from './FaqText';
import ContactText from './ContactText';
import AboutText from './AboutText';
import RGPDText from './RGPDText';



const fetcher = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Failed to fetch data");
    }
    return response.json();
};

const categoryLabels = {
    MEN: "Hommes",
    WOMEN: "Femmes",
    GIRL: "Filles",
    BOY: "Garçons",
};

function App() {
    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {data: categories, error: categoriesError} = useSWR('http://localhost:8090/categories', fetcher);
    const [cart, setCart] = useState({
        cartID: null, // ID du panier, par défaut null
        userId: null, // Utilisateur lié, par défaut null
        cartProducts: [], // Liste des produits, par défaut vide
        cartTotalPrice: 0, // Prix total TTC, par défaut 0
        cartTotalPriceExcludingVAT: 0, // Prix total HT, par défaut 0
        numberOfProducts: 0, // Nombre total de produits, par défaut 0
    });
    const [showCart, setShowCart] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0); // Stocke le nombre d'articles
    const initialized = useRef(false); // Utilisation de useRef pour stocker l’état mutable


    useEffect(() => {
        const initializeCart = async () => {
            if (initialized.current) return; // Vérifie si l’état est déjà initialisé
            initialized.current = true; // Marque comme initialisé

            let cartId = getCookie('cartId');

            if (cartId) {
                try {
                    console.log(`Chargement du panier avec l'ID : ${cartId}`);
                    const response = await fetch(`http://localhost:8090/carts/${cartId}`);
                    if (!response.ok) {
                        throw new Error("Erreur lors de la récupération du panier");
                    }
                    const data = await response.json();
                    setCart(data);
                    setCartItemCount(data.numberOfProducts || 0);
                } catch (error) {
                    console.error("Erreur lors de la récupération du panier :", error);
                }
            } else {
                try {
                    console.log("Aucun panier trouvé. Création d'un nouveau panier...");
                    const response = await fetch("http://localhost:8090/carts", {method: "POST"});
                    if (!response.ok) {
                        throw new Error("Erreur lors de la création du panier");
                    }
                    const newCart = await response.json();
                    setCart(newCart);
                    setCartItemCount(0);
                    document.cookie = `cartId=${newCart.cartID};path=/;max-age=604800`; // 7 jours
                    console.log(`Nouveau panier créé avec l'ID : ${newCart.cartID}`);
                } catch (error) {
                    console.error("Erreur lors de la création du panier :", error);
                }
            }
        };

        initializeCart();
    }, []); // Pas de dépendances supplémentaires nécessaires

    // Effet pour surveiller l'état utilisateur
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchUser = async () => {
                try {
                    const response = await fetch('http://localhost:8090/auth/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!response.ok) throw new Error("Utilisateur non authentifié");
                    const userData = await response.json();
                    setUser(userData);
                } catch (error) {
                    console.error(error);
                    setUser(null);
                }
            };

            fetchUser();
        }
    }, []); // Exécute seulement une fois au chargement de l'application

    const handleLogout = async () => {
        // Supprimer le token et l'utilisateur local
        localStorage.removeItem('token');
        setUser(null); // Réinitialise l'utilisateur

        // Réinitialiser l'état du panier
        setCart({
            cartID: null,
            userId: null,
            cartProducts: [],
            cartTotalPrice: 0,
            cartTotalPriceExcludingVAT: 0,
            numberOfProducts: 0,
        });

        setCartItemCount(0); // Mettre à jour le compteur du panier

        // Supprimer le cookie du panier
        document.cookie = 'cartId=; Max-Age=0; path=/'; // Supprime le cookie 'cartId'

        //Recreer un panier
        try {
            console.log("Aucun panier trouvé. Création d'un nouveau panier...");
            const response = await fetch("http://localhost:8090/carts", { method: "POST" });
            if (!response.ok) {
                throw new Error("Erreur lors de la création du panier");
            }
            const newCart = await response.json();
            setCart(newCart);  // Met à jour l'état du panier
            setCartItemCount(0);  // Remet à zéro le nombre d'articles
            // Créer un nouveau cookie avec l'ID du panier
            document.cookie = `cartId=${newCart.cartID};path=/;max-age=604800`; // 7 jours
            console.log(`Nouveau panier créé avec l'ID : ${newCart.cartID}`);
        } catch (error) {
            console.error("Erreur lors de la création du panier :", error);
        }
        setShowAuth(false); // Ferme la fenêtre de connexion si elle est ouverte
        setShowCart(false); // Ferme le panier si il est ouvert
    };


    const toggleAuth = () => {
        setShowAuth(!showAuth);
        setShowCart(false); // Fermer le panier si le formulaire est actif
        setSelectedCategory(null); // Réinitialiser la catégorie sélectionnée
        setSelectedProduct(null); // Réinitialiser le produit sélectionné
    };

    const toggleCart = () => {
        setShowCart(!showCart);
        setShowAuth(false); // Fermer le formulaire si le panier est actif
        setSelectedCategory(null); // Réinitialiser la catégorie sélectionnée
        setSelectedProduct(null); // Réinitialiser le produit sélectionné
    };

    const [showAuth, setShowAuth] = useState(false);

    return (
        <Router>
        <div className="background">
            {/* Header avec overlay pour l'image */}
            <header
                className="header-container"
                style={{
                    backgroundImage: `url(${headerview})`,
                    height: '200px',
                }}
            >
                <div className="header-overlay"></div>
                <div className="header-content">
                    <img src={logo} alt="Logo" className="logo"/>
                    <h1 className="site-title">T-SHIRT SHOP</h1>
                </div>
            </header>
            {/* Navbar centrée */}
            <Navbar bg="dark" variant="dark" expand="lg" className="main-navbar">
                <Container className="justify-content-center">
                    <Navbar.Brand onClick={() => setSelectedCategory(null)}
                                  style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                        <i className="bi bi-house-heart" style={{fontSize: '1.5rem', marginRight: '8px'}}></i>
                        HOME
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                        <Nav className="d-flex gap-3">
                            {categoriesError ? (
                                <Button variant="outline-light" disabled>Échec du chargement</Button>
                            ) : !categories ? (
                                <Button variant="outline-light" disabled>Chargement...</Button>
                            ) : (
                                categories.map((category) => (
                                    <Button
                                        key={category}
                                        variant="outline-light"
                                        onClick={() => {
                                            setSelectedCategory(category.toLowerCase());
                                            setSelectedProduct(null);
                                            setShowAuth(false);
                                            setShowCart(false);
                                        }}
                                    >
                                        {categoryLabels[category]}
                                    </Button>
                                ))
                            )}
                            <Button
                                variant="outline-light"
                                style={{position: 'relative'}}
                                onClick={toggleCart}
                            >
                                <i className="bi bi-cart-check" style={{fontSize: '1.0rem', marginRight: '2px'}}></i>
                                Panier
                                <span
                                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartItemCount}
                                    <span className="visually-hidden">articles dans le panier</span>
                                </span>
                            </Button>
                        </Nav>
                        <Nav className="ms-auto">
                            {user ? (
                                <>
            <span className="navbar-text text-light me-3">
                Bienvenue, {user.userSurname} !
            </span>
                                    <Button variant="outline-danger" onClick={handleLogout}>
                                        Déconnexion
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline-light" onClick={toggleAuth}>
                                    Connexion / Inscription
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            {/* Affichage conditionnel des composants selon la sélection */}
            <main className="content">
                {showAuth && (
                    <AuthForm
                        onHide={() => setShowAuth(false)}
                        setUser={setUser}
                    />
                )}
                {!showAuth && showCart && (
                    <CartDrawer
                        cartId={cart.cartID}
                        cart={cart}
                        setCart={setCart}
                        show={showCart}
                        onHide={() => setShowCart(false)}
                        updateCartItemCount={(count) => setCartItemCount(count)}
                        setSelectedProduct={setSelectedProduct}
                        setSelectedCategory={setSelectedCategory}
                    />
                )}
                {!showAuth && !showCart && selectedCategory && !selectedProduct && (
                    <CategoryPage
                        category={selectedCategory}
                        setSelectedProduct={setSelectedProduct}
                        fetcher={fetcher}
                        categoryLabels={categoryLabels}
                    />
                )}
                {!showAuth && !showCart && selectedProduct && (
                    <ProductDetails
                        productId={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        fetcher={fetcher}
                        cart={cart}
                        setCart={setCart}
                        showCart={showCart}
                        setShowCart={setShowCart}
                        setCartItemCount={setCartItemCount}
                    />
                )}
                {!showAuth && !showCart && !selectedCategory && !selectedProduct && (
                    <HomeScreen
                        categories={categories}
                        setSelectedCategory={setSelectedCategory}
                        setSelectedProduct={setSelectedProduct}
                        fetcher={fetcher}
                    />
                )}
                <Routes>
                    <Route path="/FaqText" element={<FaqText />} />
                    <Route path="/ContactText" element={<ContactText />} />
                    <Route path="/AboutText" element={<AboutText />} />
                    <Route path="/RGPDText" element={<RGPDText />} />
                </Routes>
            </main>
            <Footer/>
            {/* Composant CookieConsent */}
            <CookieConsent
                location="bottom" // Position en bas de la page
                buttonText="Accepter"
                declineButtonText="Refuser"
                enableDeclineButton // Active le bouton de refus
                onAccept={() => console.log("Cookies acceptés")} // Action lors de l'acceptation
                onDecline={() => console.log("Cookies refusés")} // Action lors du refus
                cookieName="userCookieConsent" // Nom du cookie pour enregistrer la décision
                style={{
                    background: "#2B373B",
                    color: "#ffffff",
                    textAlign: "center"
                }} // Style du container
                buttonStyle={{
                    background: "#4CAF50",
                    color: "#ffffff",
                    fontSize: "13px",
                    borderRadius: "5px",
                }} // Style du bouton d'acceptation
                declineButtonStyle={{
                    background: "#f44336",
                    color: "#ffffff",
                    fontSize: "13px",
                    borderRadius: "5px",
                }} // Style du bouton de refus
            >
                Nous utilisons des cookies pour améliorer votre expérience utilisateur. En acceptant, vous consentez à
                notre utilisation des cookies.
            </CookieConsent>
        </div>
        </Router>
    );
}

export default App;