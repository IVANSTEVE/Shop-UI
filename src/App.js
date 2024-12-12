import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import {createCart, isCookieConsentGiven} from './utils';
import CookieConsent, {getCookieConsentValue} from 'react-cookie-consent';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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
    const [cookiesAccepted, setCookiesAccepted] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const initialized = useRef(false);
    const [showAuth, setShowAuth] = useState(false);
    const [tempCart, setTempCart] = useState([]);

    // État du panier
    const [cart, setCartState] = useState({
        cartId: null,
        userId: null,
        cartProducts: [],
        cartTotalPrice: 0,
        cartTotalPriceExcludingVAT: 0,
        numberOfProducts: 0,
    });

    // Utilisation du hook useCallback pour éviter les boucles infinies
    const setCart = useCallback((newCart) => {
        setCartState(newCart);
    }, []);

    // Initialisation du panier
    useEffect(() => {
        const initializeCart = async () => {
            // Éviter de réinitialiser le panier à chaque rendu
            if (initialized.current) return;
            initialized.current = true;

            // Vérifier si l'utilisateur est connecté
            const token = localStorage.getItem("token");
            const isLoggedIn = !!token; // !! convertit la valeur en booléen (particularité liée à JS)

            // Si l'utilisateur n'est pas connecté, vérifier que le consentement des cookies est donné
            const consentValue = getCookieConsentValue();
            if (!isLoggedIn && consentValue !== "true") {
                setTempCart([]); // Initialise un panier temporaire vide
                return; // Aucun panier créé si l'utilisateur n'est pas connecté et n'a pas accepté les cookies
            }


            let cartId = null;

            // Si l'utilisateur est connecté, récupérer l'ID du panier depuis l'utilisateur (auth)
            if (isLoggedIn) {
                try {
                    // Récupérer les informations de l'utilisateur
                    const authResponse = await fetch("http://localhost:8090/auth/me", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (authResponse.ok) {
                        const user = await authResponse.json();
                        cartId = user.cartId; // Récupérer le cartId de l'utilisateur connecté
                    }
                } catch (error) {
                    console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
                }
            }

            // Si cartId existe, récupérer les données du panier
            if (cartId) {
                try {
                    const response = await fetch(`http://localhost:8090/carts/${cartId}`);
                    if (!response.ok) {
                        throw new Error("Erreur lors de la création du panier");
                    }

                    // Récupérer le panier créé
                    const newCart = await response.json();

                    // Mettre à jour l'état du panier et le nombre d'articles
                    setCart(newCart);
                    setCartItemCount(0);

                    // Créer un cookie avec l'ID du panier
                    document.cookie = `cartId=${newCart.cartId};path=/;max-age=604800`;
                } catch (error) {
                    console.error("Erreur lors de la création du panier :", error);
                }
            }
        };

        initializeCart();
    }, [setCart]);

    const handleLogout = async () => {

        // Supprimer le token et l'utilisateur local
        localStorage.removeItem('token');

        // Réinitialiser l'état de l'utilisateur
        setUser(null);

        // Réinitialiser l'état du panier
        setCart({
            cartId: null,
            userId: null,
            cartProducts: [],
            cartTotalPrice: 0,
            cartTotalPriceExcludingVAT: 0,
            numberOfProducts: 0,
        });

        // Réinitialiser le nombre d'articles
        setCartItemCount(0);

        // Supprimer le cookie cartId
        document.cookie = 'cartId=; Max-Age=0; path=/';

        // Vider le panier temporaire
        setTempCart([]);

        // Vérifier si les cookies sont acceptés
        if (cookiesAccepted) {
            document.cookie = 'cartId=; Max-Age=0; path=/';
        }

        // Fermer le panier si les cookies ne sont pas acceptés
        if (!cookiesAccepted) {
            setShowAuth(false);
            setShowCart(false);
            return; // Ne pas créer de panier si les cookies ne sont pas acceptés
        }

        //Recreer un panier
        const newCart = await createCart();

        // Mettre à jour l'état du panier et le nombre d'articles
        setCart(newCart);
        setCartItemCount(0);

        // Fermer le panier et le formulaire
        setShowAuth(false);
        setShowCart(false);
    };

    // Fermer le formulaire d'authentification et réinitialiser la catégorie et le produit sélectionnés
    const toggleAuth = () => {
        setShowAuth(!showAuth);
        setShowCart(false);
        setSelectedCategory(null);
        setSelectedProduct(null);
    };


    // Fonction pour afficher ou masquer le panier
    const toggleCart = useCallback(() => {
        setShowCart((prevShowCart) => {
            // Inverse l'état actuel de `showCart`
            return !prevShowCart;
        });

        // Réinitialisation des autres états
        setShowAuth(false);
        setSelectedCategory(null);
        setSelectedProduct(null);
    }, []);

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
                                    <i className="bi bi-cart-check"
                                       style={{fontSize: '1.0rem', marginRight: '2px'}}></i>
                                    Panier
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {!isCookieConsentGiven()
                                        ? tempCart.reduce((sum, item) => sum + item.quantity, 0)
                                        : cartItemCount
                                    }
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
                            setShowCart={setShowCart}
                            setUser={setUser}
                        />
                    )}
                    {!showAuth && showCart && (
                        <CartDrawer
                            cart={cart}
                            setCart={setCart}
                            show={showCart}
                            onHide={() => setShowCart(false)}
                            updateCartItemCount={(count) => setCartItemCount(count)}
                            setSelectedProduct={setSelectedProduct}
                            setSelectedCategory={setSelectedCategory}
                            cookiesAccepted={cookiesAccepted}
                            setCookiesAccepted={setCookiesAccepted}
                            setShowCart={setShowCart}
                            setTempCart={setTempCart}
                            tempCart={tempCart}
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
                            cookiesAccepted={cookiesAccepted}
                            setCookiesAccepted={setCookiesAccepted}
                            setTempCart={setTempCart}
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
                        <Route path="/FaqText" element={<FaqText/>}/>
                        <Route path="/ContactText" element={<ContactText/>}/>
                        <Route path="/AboutText" element={<AboutText/>}/>
                        <Route path="/RGPDText" element={<RGPDText/>}/>
                    </Routes>
                </main>
                <Footer/>
                {/* Composant CookieConsent */}
                <CookieConsent
                    location="bottom"
                    buttonText="Accepter"
                    declineButtonText="Refuser"
                    enableDeclineButton
                    onAccept={() => console.log("Cookies acceptés")}
                    onDecline={() => console.log("Cookies refusés")}
                    cookieName="userCookieConsent"
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
                    Nous utilisons des cookies pour améliorer votre expérience utilisateur. En acceptant, vous consentez
                    à
                    notre utilisation des cookies.
                </CookieConsent>
            </div>
        </Router>
    );
}

export default App;