import React from "react";
import useSWR from "swr";
import {Button, Card, Col, Row} from "react-bootstrap";
 
function ProductDetails({productId, setSelectedProduct, fetcher, cart, setCart, setShowCart}) {
 
    const {data, error} = useSWR(`http://localhost:8090/products/${productId}`, fetcher);

    if (error) return <div>Échec du chargement des détails du produit</div>;
    if (!data) return <div>Chargement des détails du produit...</div>;

    const addToCart = () => {
        const existingProductIndex = cart.findIndex(item => item.idProduct === data.idProduct);

        if (existingProductIndex > -1) {
            // Si l'article est déjà dans le panier, augmentez sa quantité
            const newCart = [...cart];
            newCart[existingProductIndex].quantity += 1;
            setCart(newCart);
        } else {
            // Sinon, ajoutez un nouvel article avec une quantité initiale de 1
            setCart([...cart, { ...data, quantity: 1 }]);
        }
        setShowCart(true); // Ouvre Cart après ajout au panier
    };

    return ( <Row className="justify-content-center mt-4">
        <Col xs="12" md="8" lg="6">
            <Card>
                <Card.Header className="text-center">
                    <h2>Détails du produit</h2>
                </Card.Header>
                <Card.Img
                    src={data.imageURL || '/images/placeholder.webp'}
                    alt={data.productName}
                    style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '0 auto' }}
                />
                <Card.Body className="text-center">
                    <Card.Title>{data.productName}</Card.Title>
                    <Card.Text><strong>Prix :</strong> {data.price} €</Card.Text>
                    <Button variant="primary" onClick={addToCart} className="me-2">
                        Ajouter au panier
                    </Button>
                    <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                        Retour
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    </Row>


    );
}

export default ProductDetails;