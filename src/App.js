import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Navbar, Nav, Button, Container, Card, Row, Col} from "react-bootstrap";
import './App.css';
import useSWR from "swr";
import logo from './Logo_t_shirt_bis.png';
import headerview from './Headerview.jpg';
import Footer from './Footer';

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
    const {data: categories, error: categoriesError} = useSWR('http://localhost:8080/categories', fetcher);

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
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Affichage conditionnel des composants selon la sélection */}
            <main className="content">
                {selectedCategory && !selectedProduct ? (
                    <CategoryPage
                        category={selectedCategory}
                        setSelectedProduct={setSelectedProduct}
                    />
                ) : selectedCategory && selectedProduct ? (
                    <ProductDetails productId={selectedProduct} setSelectedProduct={setSelectedProduct}/>
                ) : (
                    <HomeScreen categories={categories} setSelectedCategory={setSelectedCategory}
                                setSelectedProduct={setSelectedProduct}/>
                )}
            </main>
            <Footer/>
        </div>
    );
}

function HomeScreen({categories, setSelectedCategory, setSelectedProduct}) {
    const {data, error} = useSWR('http://localhost:8080/products', fetcher);

    if (error) return <div>Échec du chargement des catégories</div>;
    if (!data) return <div>Chargement des catégories...</div>;
    return (
        <div className="home-screen text-center my-4">
            <h2 className="futuristic-heading">Bienvenue sur le projet T-Shirt Shop !</h2>
            <p className="futuristic-paragraph">
                Ce site a été réalisé dans le cadre du cours de Projet d'Intégration. Découvrez notre sélection de
                t-shirts et explorez les différentes catégories disponibles.
                Ce projet utilise React pour le front-end, Spring Boot pour le back-end, et MySQL pour la gestion de
                données.
            </p>
            <Row className="justify-content-center">
                {categories && categories.map((category) => (
                    <Col key={category} xs={6} md={4} lg={3}>
                        <Button
                            variant="outline-info"
                            className="category-button"
                            onClick={() => setSelectedCategory(category.toLowerCase())}
                        >
                            {categoryLabels[category.toUpperCase()]}
                        </Button>
                    </Col>
                ))}
            </Row>
            <Row>

                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>

                    {/* Message si aucun produit n'est disponible */}

                    {data.length === 0 ? (
                        <p>Aucun produit disponible dans le shop.</p>

                    ) : (

                        data.map((selectedProduct) => (
                            <div

                                key={selectedProduct.idProduct}

                                onClick={() => setSelectedProduct(selectedProduct.idProduct)}

                                style={{cursor: 'pointer', textAlign: 'center'}}
                            >

                                {/* Miniature du produit avec infobulle */}
                                <img

                                    src={selectedProduct.imageURL || '/placeholder.webp'}

                                    alt={selectedProduct.productName}

                                    title={selectedProduct.productName}

                                    style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px'}}

                                />
                            </div>

                        ))

                    )}
                </div>

            </Row>


        </div>
    );
}

function CategoryPage({category, setSelectedProduct}) {
    const {data, error} = useSWR(`http://localhost:8080/categories/${category}/products`, fetcher);

    if (error) return <div className="error-message">Échec du chargement des produits</div>;
    if (!data) return <div className="loading-message">Chargement des produits...</div>;

    return (
        <div className="category-page">
            <h2>Produits dans la catégorie {categoryLabels[category.toUpperCase()]}</h2>
            <div className="products-grid">
                {data.length === 0 ? (
                    <p>Aucun produit disponible dans cette catégorie.</p>
                ) : (
                    data.map((product) => (
                        <Card
                            key={product.idProduct}
                            onClick={() => setSelectedProduct(product.idProduct)}
                            className="product-card"
                        >
                            <Card.Img
                                variant="top"
                                src={product.imageURL || '/placeholder.webp'}
                                alt={product.productName}
                                className="product-image"
                            />
                            <Card.Body>
                                <Card.Title>{product.productName}</Card.Title>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

function ProductDetails({productId, setSelectedProduct}) {
    const {data, error} = useSWR(`http://localhost:8080/products/${productId}`, fetcher);

    if (error) return <div>Échec du chargement des détails du produit</div>;
    if (!data) return <div>Chargement des détails du produit...</div>;

    return (
        <Row className="justify-content-center mt-4">
            <Col xs="12" md="8" lg="6">
                <Card style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px'}}>
                    <Card.Header className="text-center">
                        <h2>Détails du produit</h2>
                    </Card.Header>
                    <Card.Img
                        src={data.imageURL || '/placeholder.webp'}
                        alt={data.productName}
                        style={{
                            width: '200px',
                            height: '200px',
                            objectFit: 'cover',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px',
                            margin: '0 auto',
                        }}
                    />
                    <Card.Body className="text-center">
                        <Card.Title>{data.productName}</Card.Title>
                        <Card.Text><strong>Prix :</strong> {data.price} €</Card.Text>
                        <Card.Text><strong>Marque :</strong> {data.brand.brandName}</Card.Text>
                        <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                            Retour à la liste
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default App;
