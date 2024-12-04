import React from 'react';
import { Card, Table, Form, Button, Spinner } from 'react-bootstrap';
import './Card.css'; // Pour le style du panier
import { useState, useEffect } from 'react';

function CartDrawer({ cartId, show, onHide, updateCartItemCount }) {

    const [cart, setCart] = useState({
        cartID: null, // ID du panier, par défaut null
        userId: null, // Utilisateur lié, par défaut null
        cartProducts: [], // Liste des produits, par défaut vide
        cartTotalPrice: 0, // Prix total TTC, par défaut 0
        cartTotalPriceExcludingVAT: 0, // Prix total HT, par défaut 0
        numberOfProducts: 0, // Nombre total de produits, par défaut 0
    });

    const [isLoading, setIsLoading] = useState(false);

    // Charger les données du panier depuis le backend
    useEffect(() => {
        if (show) {
            setIsLoading(true);
            fetch(`http://localhost:8090/carts/12`)
                .then((response) => response.json())
                .then((data) => {
                    setCart(data); // Stockez tout l'objet JSON retourné
                    updateCartItemCount(data.numberOfProducts);
                })
                .catch((error) => console.error('Erreur lors du chargement du panier:', error))
                .finally(() => setIsLoading(false));
        }
    }, [show, cartId, updateCartItemCount]);

    const updateQuantity = (idProduct, newQuantity) => {
        fetch(`http://localhost:8090/carts/${cart.cartID}/products/${idProduct}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: newQuantity }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour de la quantité.');
                }
                return response.json();
            })
            .then((updatedCart) => {
                setCart(updatedCart);
                updateCartItemCount(updatedCart.numberOfProducts);
            })
            .catch((error) => console.error('Erreur lors de la mise à jour de la quantité:', error));
    };

    const removeFromCart = (idProduct) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            fetch(`http://localhost:8090/carts/${cart.cartID}/products/${idProduct}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la suppression du produit.');
                    }
                    return response.json();
                })
                .then((updatedCart) => {
                    setCart(updatedCart); // Mettre à jour l'état local
                    updateCartItemCount(updatedCart.numberOfProducts);
                })
                .catch((error) => console.error('Erreur lors de la suppression:', error));
        }
    };

    if (!show) return null;

    return (
        <Card show={show} onHide={onHide} placement="start">
            <Card.Header>
                <Card.Title className="d-flex justify-content-center mt-3 gap-5">
                    Votre Panier ({cart.numberOfProducts} articles)
                </Card.Title>
            </Card.Header>
            <Card.Body>
                {isLoading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <Table responsive striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Article</th>
                                <th>Quantité</th>
                                <th>Prix unitaire</th>
                                <th>Total ligne</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart.cartProducts && cart.cartProducts.length > 0 ? (
                                cart.cartProducts.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.productName}</td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(item.productId, parseInt(e.target.value))
                                                }
                                            >
                                                {[...Array(10).keys()].map((val) => (
                                                    <option key={val + 1} value={val + 1}>
                                                        {val + 1}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td>{item.productUnitPrice.toFixed(2)} €</td>
                                        <td>{item.totalPrice.toFixed(2)} €</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeFromCart(item.productId)}
                                            >
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Aucun produit dans le panier.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                        <div className="mt-3 text-end">
                            <h5>
                                Total général (TVA 21% comprise): <strong>{cart.cartTotalPrice.toFixed(2)} €</strong>
                            </h5>
                        </div>
                        <div className="d-flex justify-content-center mt-3 gap-5">
                            <Button variant="danger" onClick={onHide}>
                                Fermer le panier
                            </Button>
                            <Button variant="success" onClick={() => alert('Commande passée !')}>
                                Passer commande
                            </Button>
                        </div>
                    </>
                )}
            </Card.Body>
        </Card>
    );
}

export default CartDrawer;
