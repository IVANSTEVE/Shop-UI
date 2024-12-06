import React from 'react';
import useSWR from 'swr';
import { Button, Card, Col, Row } from 'react-bootstrap';
import {getCookie} from "./utils";

function ProductDetails({ setCart, productId, setSelectedProduct, setCartItemCount, setShowCart }) {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`http://localhost:8090/products/${productId}`, fetcher);

    if (error) return <div>Erreur lors du chargement des détails.</div>;
    if (!data) return <div>Chargement...</div>;
    const addToCart = async () => {
        try {
            const cartId = getCookie('cartId'); // Récupérer le cartId depuis le cookie

            if (!cartId) {
                throw new Error("Aucun panier existant. Veuillez actualiser la page.");
            }

            console.log(`Ajout du produit au panier ${cartId}...`);

            const addProductResponse = await fetch(`http://localhost:8090/carts/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId, productId: productId, quantity: 1 }),
            });

            if (!addProductResponse.ok) {
                throw new Error("Erreur lors de l'ajout du produit au panier.");
            }

            const updatedCart = await addProductResponse.json();
            alert(`Produit ajouté au panier ${updatedCart.cartID}`);
            setCart(updatedCart);
            setCartItemCount(updatedCart.numberOfProducts || 0);
            // Rediriger vers le panier
            setShowCart(true); // Affiche le panier
            setSelectedProduct(null);
        } catch (error) {
            console.error("Erreur :", error.message);
            alert("Impossible d'ajouter le produit au panier. Veuillez réessayer.");
        }
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