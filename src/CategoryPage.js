import useSWR from "swr";
import {Card} from "react-bootstrap";
import React from "react";

function CategoryPage({category, setSelectedProduct, fetcher, categoryLabels}) {
    const {data, error} = useSWR(`http://localhost:8080/categories/${category}/products`, fetcher);

    if (error) return <div className="error-message">Échec du chargement des produits</div>;
    if (!data) return <div className="loading-message">Chargement des produits...</div>;

    return (
        <div className="category-page">
            <h2 className="category-title">{categoryLabels[category.toUpperCase()]}</h2>
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
                                src={product.imageURL || '/images/placeholder.webp'}
                                alt={product.productName}
                                title={product.productName}
                                style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', display: 'block', margin: 'auto'}}
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

export default CategoryPage;