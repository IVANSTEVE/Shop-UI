import React, { useState } from 'react';
import './App.css';
import useSWR from "swr";

// Fonction de récupération des données JSON depuis l'API
const fetcher = async (url) => {
    const response = await fetch(url);
    return response.json();
};

function App() {
    const [selectedCategory, setSelectedCategory] = useState(null); // Catégorie sélectionnée
    const [selectedProduct, setSelectedProduct] = useState(null); // Produit sélectionné

    return (
        <div>
            <h1>Menu de navigation</h1>
            <nav>
                <ul>
                    <CategoriesList setSelectedCategory={(category) => {
                        setSelectedCategory(category);
                        setSelectedProduct(null); // Réinitialise le produit lors du changement de catégorie
                    }}/>
                </ul>
            </nav>
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
        </div>
    );
}

function HomeScreen() {
    return <h2>Bienvenue sur la page d'accueil</h2>;
}

// Composant pour afficher la liste des catégories avec des liens cliquables
function CategoriesList({ setSelectedCategory }) {
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
}

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
                        <div
                            key={selectedProduct.idProduct}
                            onClick={() => setSelectedProduct(selectedProduct.idProduct)}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            {/* Miniature du produit avec infobulle */}
                            <img
                                src={selectedProduct.imageURL || '/placeholder.webp'}
                                alt={selectedProduct.productName}
                                title={selectedProduct.productName}
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// Composant pour afficher les détails d'un produit sélectionné
function ProductDetails({ productId }) {
    const { data, error } = useSWR(`http://localhost:8080/products/${productId}`, fetcher);

    if (error) return <div>Échec du chargement des détails du produit</div>;
    if (!data) return <div>Chargement des détails du produit...</div>;

    return (
        <div>
            <h2>Détails du produit</h2>
            {/* Image du produit ou image par défaut */}
            <img
                src={data.imageURL || '/placeholder.webp'}
                alt={data.productName}
                style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <p><strong>Nom:</strong> {data.productName}</p>
            <p><strong>Prix:</strong> {data.price} €</p>
            <p><strong>Marque:</strong> {data.brand.brandName}</p>
        </div>
    );
}

export default App;