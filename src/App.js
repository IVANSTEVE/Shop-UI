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
//import CartModal  from './CartModal';
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
    const toggleCart = () => {
        setShowCart(!showCart); // Change la visibilité du panier
    };

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
                        <Nav>
                            {categoriesError ? (
                                <Button variant="outline-light" disabled>Échec du chargement</Button>
                            ) : !categories ? (
                                <Button variant="outline-light" disabled>Chargement...</Button>
                            ) : (
                                categories.map((category) => (

                                    <Button
                                        key={category}
                                        variant="outline-light"
                                        className="category-button"
                                        onClick={() => {
                                            setSelectedCategory(category.toLowerCase());
                                            setSelectedProduct(null);
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
                            </Button>
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Affichage conditionnel des composants selon la sélection */}
            <main className="content">
                {/* Si showCart est vrai, afficher uniquement le panier */}
                {showCart ? (
                    <CartDrawer
                        cart={cart}
                        setCart={setCart}
                        show={showCart}
                        onHide={() => setShowCart(false)}
                    />
                ) : (
                    // Si showCart est false, afficher les autres composants en fonction des sélections
                    selectedCategory && !selectedProduct ? (
                        <CategoryPage
                            category={selectedCategory}
                            setSelectedProduct={setSelectedProduct}
                            fetcher={fetcher}
                            categoryLabels={categoryLabels}
                        />
                    ) : selectedCategory && selectedProduct ? (
                        <ProductDetails
                            productId={selectedProduct}
                            setSelectedProduct={setSelectedProduct}
                            fetcher={fetcher}
                            cart={cart}
                            setCart={setCart}
                            showCart={showCart}
                            setShowCart={setShowCart}
                        />
                    ) : (
                        <HomeScreen
                            categories={categories}
                            setSelectedCategory={setSelectedCategory}
                            setSelectedProduct={setSelectedProduct}
                            fetcher={fetcher}
                        />
                    )
                )}
            </main>
            <Footer />
        </div>
    );
}

export default App;