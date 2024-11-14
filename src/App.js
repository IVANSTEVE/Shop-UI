import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Navbar, Nav, Button, Card,  Container } from "react-bootstrap";
import './App.css';
import useSWR from "swr";
import logo from './images/Logo_t_shirt_bis.png';
import headerview from './images/Headerview.jpg'; 
import Footer from './Footer'; 
import './App.css';


//import Footer from './Footer';

// Fonction de récupération des données JSON depuis l'API
const fetcher = async (url) => {
    const response = await fetch(url);
    return response.json();
};

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null); // Catégorie sélectionnée
    const [selectedProduct, setSelectedProduct] = useState(null); // Produit sélectionné
    // Récupère les catégories depuis l'API
    const { data: categories, error: categoriesError } = useSWR('http://localhost:8080/categories', fetcher);

    return (   
       <div className="background">
           <div
                style={{
                    backgroundImage: `url(${headerview})`,
                    backgroundRepeat: 'repeat-x',
                    backgroundSize: 'auto',
                    height: '100px',
                    width: '100%',
                }}
            ></div>
           {/* Navbar avec les catégories comme boutons */}
           <Navbar bg="secondary" variant="dark" expand="lg">
               <Container>
                 <Navbar.Brand href="#home">
               <img
              src={logo}
              alt="Logo"
              style={{ width: '70px', height: 'auto', marginRight: '10px' }}
              />
                   T-SHIRT SHOP
                 </Navbar.Brand>
                 <Navbar.Toggle aria-controls="basic-navbar-nav" />
                 <Navbar.Collapse id="basic-navbar-nav">
                   <Nav className="me-auto">
                     <Button 
                       variant="outline-light" 
                       onClick={() => setSelectedCategory(null)}
                       style={{ width: '70px', height: 'auto', marginRight: '10px' }}
                           >
                               HOME
                     </Button>
                           {/* Affiche chaque catégorie comme un bouton dans la navbar */}
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
                                       }}
                                       style={{ marginRight: '5px' }}
                                   >
                                       {category}
                                   </Button>
                               ))
                           )}
                       </Nav>
                   </Navbar.Collapse>
               </Container>
           </Navbar>
           
          {/* <nav>
                <ul>
                    <CategoriesList setSelectedCategory={(category) => {
                        setSelectedCategory(category);
                        setSelectedProduct(null); // Réinitialise le produit lors du changement de catégorie
                    }}/>
                </ul>
            </nav>*/}
            <div>
                {/* Affichage conditionnel des composants selon la sélection */}
                {selectedCategory && !selectedProduct ? (
                    <CategoryPage
                        category={selectedCategory}
                        setSelectedProduct={setSelectedProduct}
                    />
                ) : selectedCategory && selectedProduct ? (
                    <ProductDetails productId={selectedProduct} setSelectedProduct={setSelectedProduct}/>
                ) : (
                    <HomeScreen/>
                )}
            </div>
            <Footer />
        </div>
    );
}

function HomeScreen() {
    return <h2>Bienvenue sur la page d'accueil</h2>;
}

// Composant pour afficher la liste des catégories avec des liens cliquables
/*function CategoriesList({ setSelectedCategory }) {

    const { data, error } = useSWR('http://localhost:8080/categories', fetcher);

    if (error) return <div>Échec du chargement des catégories</div>;
    if (!data) return <div>Chargement des catégories...</div>;
      
   return (
    <>
        {data.map((category) => (
            <li key={category} onClick={() => setSelectedCategory(category.toLowerCase())}>
                {category}
            </li>
        ))}
    </> 
);
}*/

// Composant pour afficher les produits d'une catégorie donnée
function CategoryPage({ category, setSelectedProduct }) {
    const { data, error } = useSWR(`http://localhost:8080/products/categories/${category}`, fetcher);

    if (error) return <div>Échec du chargement des produits</div>;
    if (!data) return <div>Chargement des produits...</div>;

    return (
        <div>
            <h2>Produits dans la catégorie {category}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {/* Message si aucun produit n'est disponible */}
                {data.length === 0 ? (
                    <p>Aucun produit disponible dans cette catégorie.</p>
                ) : (
                    data.map((selectedProduct) => (
                        <Card
                            key={selectedProduct.idProduct}
                            onClick={() => setSelectedProduct(selectedProduct.idProduct)}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            {/* Miniature du produit avec infobulle */}
                            <Card.Img
                                variant="top"
                                src={selectedProduct.imageURL || '/placeholder.webp'}
                                alt={selectedProduct.productName}
                                //title={selectedProduct.productName}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                           {/*} <Card.Body>
                                <Button variant="secondary">See Details</Button>
                             </Card.Body>*/}
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

// Composant pour afficher les détails d'un produit sélectionné
function ProductDetails({ productId, setSelectedProduct }) {
    const { data, error } = useSWR(`http://localhost:8080/products/${productId}`, fetcher);

    if (error) return <div>Échec du chargement des détails du produit</div>;
    if (!data) return <div>Chargement des détails du produit...</div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <h2>Détails du produit</h2>
        <Card style={{ width: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            {/* Image du produit ou image par défaut */}
            <Card.Img
                variant="top"
                src={data.imageURL || '/placeholder.webp'}
                alt={data.productName}
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />

            <Card.Body>
                    {/* Détails du produit */}
              <Card.Title>{data.productName}</Card.Title>
              <Card.Text>
                <strong>Prix :</strong> {data.price} €
              </Card.Text>
              <Card.Text>
                <strong>Marque :</strong> {data.brand.brandName}
              </Card.Text>
              {/* Ajoutez un bouton ou autre action */}
              <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                Back to list
              </Button>
            </Card.Body>
          </Card>
        </div>
    );
}

export default App;