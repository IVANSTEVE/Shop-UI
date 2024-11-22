import useSWR from "swr";
import {Row} from "react-bootstrap";
import React from "react";

function HomeScreen({setSelectedProduct, fetcher}) {
    const {data, error} = useSWR('http://localhost:8080/products', fetcher);

    if (error) return <div>Échec du chargement des catégories</div>;
    if (!data) return <div>Chargement des catégories...</div>;
    return (
        <div className="home-screen text-center my-4">
            <h2 className="category-title">Bienvenue sur T-Shirt Shop !</h2>
            {/*<p className="futuristic-paragraph">*/}
            {/*    Ce site a été réalisé dans le cadre du cours de Projet d'Intégration. Découvrez notre sélection de*/}
            {/*    t-shirts et explorez les différentes catégories disponibles.*/}
            {/*    Ce projet utilise React pour le front-end, Spring Boot pour le back-end, et MySQL pour la gestion de*/}
            {/*    données.*/}
            {/*</p>*/}
            {/*<Row className="justify-content-center">*/}
            {/*    {categories && categories.map((category) => (*/}
            {/*        <Col key={category} xs={6} md={4} lg={3}>*/}
            {/*            <Button*/}
            {/*                variant="outline-info"*/}
            {/*                className="category-button"*/}
            {/*                onClick={() => setSelectedCategory(category.toLowerCase())}*/}
            {/*            >*/}
            {/*                {categoryLabels[category.toUpperCase()]}*/}
            {/*            </Button>*/}
            {/*        </Col>*/}
            {/*    ))}*/}
            {/*</Row>*/}
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
                                    src={selectedProduct.imageURL || '/images/placeholder.webp'}
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

export default HomeScreen;