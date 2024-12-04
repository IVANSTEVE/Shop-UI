import React from 'react';
import useSWR from 'swr';
import { Button, Card, Col, Row } from 'react-bootstrap';

function ProductDetails({ setCart, productId, setSelectedProduct }) {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`http://localhost:8090/products/${productId}`, fetcher);

    if (error) return <div>Erreur lors du chargement des détails.</div>;
    if (!data) return <div>Chargement...</div>;
    const addToCart = () => {
        fetch(`http://localhost:8090/carts/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({productId: data.idProduct, quantity: 1 }),
        })
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        alert(`Produit ajouté au panier ${data.cartID}`);
                    });
                    alert(`Ajouté au panier ${data.cartID}`);
                    setCart (data);
                }
            })
            .catch((error) => console.error('Erreur:', error));
    };

    return (
        <Row className="justify-content-center mt-4">
            <Col xs={12} md={8}>
                <Card>
                    <Card.Header>
                        <h2>{data.productName}</h2>
                    </Card.Header>
                    <Card.Img variant="top" src={data.imageURL || '/placeholder.jpg'} />
                    <Card.Body>
                        <Card.Text>Prix : {data.price} €</Card.Text>
                        <Button variant="primary" onClick={addToCart}>
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
