import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Nav, Button, Container } from "react-bootstrap";
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
//import AboutText from './components/AboutText';
//import Apropos from './components/Apropos';
//import Faq from './components/Faq';


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
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { data: categories, error: categoriesError } = useSWR('http://localhost:8080/categories', fetcher);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false); // État pour afficher le modal*/
    const [cartItemCount, setCartItemCount] = useState(0); // Stocke le nombre d'articles


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
                    <img src={logo} alt="Logo" className="logo" />
                    <h1 className="site-title">T-SHIRT SHOP</h1>
                </div>
            </header>
            {/* Navbar centrée */}
            <Navbar bg="dark" variant="dark" expand="lg" className="main-navbar">
                <Container className="justify-content-center">
                    <Navbar.Brand onClick={() => setSelectedCategory(null)}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <i className="bi bi-house-heart" style={{ fontSize: '1.5rem', marginRight: '8px' }}></i>
                        HOME
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                        <Nav className="d-flex gap-3">
                            <Button
                                variant="outline-light"
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSelectedProduct(null);
                                    setShowAuth(false);
                                    setShowCart(false);
                                }}
                            >
                                Accueil
                            </Button>
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
                                style={{ position: 'relative' }}
                                onClick={toggleCart} // Appelle toggleCart au clic  {() => console.log("Ouverture du panier")}
                            >
                                <i className="bi bi-cart-check" style={{ fontSize: '1.0rem', marginRight: '2px' }}></i>
                                Panier
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {cartItemCount}
                                    <span className="visually-hidden">articles dans le panier</span>
                                </span>
                            </Button>
                            <Button variant="outline-light" onClick={toggleAuth}>
                                Login / Register
                            </Button>
                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>

            {/* Affichage conditionnel des composants selon la sélection */}
            <main className="content">
                {showAuth && (
                    <AuthForm onHide={() => setShowAuth(false)} />
                )}
                {!showAuth && showCart && (
                    <CartDrawer
                        cart={cart}
                        setCart={setCart}
                        show={showCart}
                        onHide={() => setShowCart(false)}
                        updateCartItemCount={(count) => setCartItemCount(count)}
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
                {!showAuth && !showCart && selectedCategory && selectedProduct && (
                    <ProductDetails
                        productId={selectedProduct}
                        setSelectedProduct={setSelectedProduct}
                        fetcher={fetcher}
                        cart={cart}
                        setCart={setCart}
                        showCart={showCart}
                        setShowCart={setShowCart}
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
            </main>

            <Footer />
        </div>
    );
}

export default App;