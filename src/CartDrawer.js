import React from 'react';
import { Card, Table, Button, Form } from 'react-bootstrap';
import './Card.css'; // Pour le style du panier

function CartDrawer({ cart, setCart, show, onHide }) {
    // Mise à jour de la quantité d'un produit
    const updateQuantity = (idProduct, newQuantity) => {
        const updatedCart = cart.map((item) =>
            item.idProduct === idProduct
                ? { ...item, quantity: newQuantity }
                : item
        );
        setCart(updatedCart);
    };

    // Calcul du total général du panier
    const calculTotal = () =>
        cart.reduce((acc, item) => acc + item.quantity * item.price, 0);

    // Suppression d'un ardicle
    const removeFromCard = (idProduct) => {
        setCart(cart.filter((item) => item.idProduct !== idProduct));
    };

    if (!show) {
        return null; // Si show est false, le panier ne s'affiche pas
    }




    return (
        <Card show={show} onHide={onHide} placement="start">
            <Card.Header>
                <Card.Title>Votre Panier</Card.Title>



            </Card.Header>
            <Card.Body>
                {cart.length > 0 ? (
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
                                        <td> {(item.quantity * item.price).toFixed(2)} €</td>
                                        <td>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => removeFromCard(item.idProduct)}
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
                                Total général : <strong>{calculTotal()} €</strong>
                            </h5>
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