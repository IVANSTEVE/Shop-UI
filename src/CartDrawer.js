import React from 'react';
import { Card, Table, Button, Form, Spinner } from 'react-bootstrap';
import './Card.css'; // Pour le style du panier
import { useState, useEffect } from 'react';

function CartDrawer({ cartId, show, onHide, updateCartItemCount }) {

    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Charger les données du panier depuis le backend
    useEffect(() => {
        if (show) {
            setIsLoading(true);
            fetch(`http://localhost:8090/cart/${cartId}`)
                .then((response) => response.json())
                .then((data) => {
                    const items = Array.isArray(data.items) ? data.items : []; // Vérifiez si data.items est un tableau
                    setCart(items);
                    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
                    updateCartItemCount(itemCount);
                })
                .catch((error) => console.error('Erreur lors du chargement du panier:', error))

                .finally(() => setIsLoading(false));
        }
    }, [show, cartId, updateCartItemCount]);

    // Mise à jour de la quantité d'un produit
    const updateQuantity = (idProduct, newQuantity) => {
        fetch(`http://localhost:8090/cart/${cartId}/update?productId=${idProduct}&quantity=${newQuantity}`, {
            method: 'PUT',
        })
            .then((response) => {
                if (response.ok) {
                    setCart((prevCart) =>
                        prevCart.map((item) =>
                            item.idProduct === idProduct ? { ...item, quantity: newQuantity } : item
                        )
                    );
                }
            })
            .catch((error) => console.error('Erreur lors de la mise à jour de la quantité:', error));
    };

    // Calcul du total général du panier
    const calculTotal = () =>
        (cart || []).reduce((acc, item) => acc + item.quantity * item.price, 0);

    const getCartItemsCount = () =>
        (cart || []).reduce((total, item) => total + item.quantity, 0);
    // Mettre à jour le compteur d'articles après tout changement dans le panier
    React.useEffect(() => {
        updateCartItemCount(getCartItemsCount());
    }, [cart, updateCartItemCount]); // Réévalue lorsque `cart` change


    const [selectedItems, setSelectedItems] = useState([]);
    const handleSelection = (idProduct, isSelected) => {
        setSelectedItems((prevSelected) =>
            isSelected
                ? [...prevSelected, idProduct] // Ajouter l'article
                : prevSelected.filter((id) => id !== idProduct) // Retirer l'article
        );
    };



    // Suppression d'un article
    const removeFromCart = (idProduct) => {
        fetch(`http://localhost:8090/cart/${cartId}/remove?productId=${idProduct}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setCart(cart.filter((item) => item.idProduct !== idProduct));
                }
            })
            .catch((error) => console.error('Erreur lors de la suppression:', error));
    };

    if (!show) return null;

    return (
        <Card show={show} onHide={onHide} placement="start">
            <Card.Header>
                <Card.Title className="d-flex justify-content-center mt-3 gap-5">Votre Panier ({cart.reduce((total, item) => total + item.quantity, 0)} articles)</Card.Title>



            </Card.Header>
            <Card.Body>
                {isLoading ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" />
                    </div>
                ) : cart.length > 0 ? (
                    <>
                        <Table responsive striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Article</th>
                                    <th>Quantité</th>
                                    <th>Prix unitaire</th>
                                    <th>Total ligne</th>
                                    <th>Sélectionner</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <tr key={item.idProduct}>
                                        <td>{index + 1}</td>
                                        <td>{item.productName}</td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                style={{ width: '80px' }}
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(
                                                        item.idProduct,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                            >
                                                {[...Array(10).keys()].map((val) => (
                                                    <option key={val + 1} value={val + 1}>
                                                        {val + 1}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </td>
                                        <td>{item.price.toFixed(2)} €</td>
                                        <td>{(item.quantity * item.price).toFixed(2)} €</td>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={(e) =>
                                                    handleSelection(item.idProduct, e.target.checked)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeFromCart(item.idProduct)}
                                            >
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <div className="mt-3 text-end">
                            <h5>
                                Total général ( TVA 21 % Comprise): <strong>{calculTotal().toFixed(2)} €</strong>
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
                ) : (
                    <p>Votre panier est vide.</p>
                )}
            </Card.Body>
        </Card>
    );
}

export default CartDrawer;