import React from 'react';
import { Card, Table, Form, Button, Spinner } from 'react-bootstrap';
import './Card.css'; // Pour le style du panier
import { useState, useEffect } from 'react';

function CartDrawer({ cartId, show, onHide, updateCartItemCount, setSelectedProduct, setSelectedCategory }) {

    const [cart, setCart] = useState({
        cartID: null, // ID du panier, par défaut null
        userId: null, // Utilisateur lié, par défaut null
        cartProducts: [], // Liste des produits, par défaut vide
        cartTotalPrice: 0, // Prix total TTC, par défaut 0
        cartTotalPriceExcludingVAT: 0, // Prix total HT, par défaut 0
        numberOfProducts: 0, // Nombre total de produits, par défaut 0
    });
    const getCartIdFromCookie = () => {
        const cookies = document.cookie.split("; ");
        const cartIdCookie = cookies.find((c) => c.startsWith("cartId="));
        return cartIdCookie ? cartIdCookie.split("=")[1] : null;
    };

    const setCartIdInCookie = (cartId) => {
        document.cookie = `cartId=${cartId};path=/;max-age=604800`; // 7 jours
    };

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            if (!show) return;

            setIsLoading(true);
            let cartIdToLoad = getCartIdFromCookie();

            if (!cartIdToLoad) {
                console.log("Aucun panier existant, création d'un nouveau panier...");
                try {
                    const createCartResponse = await fetch("http://localhost:8090/carts", { method: "POST" });
                    if (!createCartResponse.ok) {
                        throw new Error("Erreur lors de la création du panier");
                    }
                    const newCart = await createCartResponse.json();
                    cartIdToLoad = newCart.cartID;
                    setCartIdInCookie(cartIdToLoad);
                    setCart(newCart);
                } catch (error) {
                    console.error("Erreur lors de la création du panier :", error);
                    setIsLoading(false);
                    return;
                }
            }

            try {
                console.log(`Chargement du panier avec l'ID : ${cartIdToLoad}`);
                const response = await fetch(`http://localhost:8090/carts/${cartIdToLoad}`);
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement du panier");
                }
                const data = await response.json();
                setCart(data);
                updateCartItemCount(data.numberOfProducts || 0);
            } catch (error) {
                console.error("Erreur lors du chargement du panier :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [show, updateCartItemCount]);




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
                setCart(updatedCart); // Mettre à jour le panier avec les données renvoyées par l'API
                updateCartItemCount(updatedCart.numberOfProducts); // Mettre à jour le compteur
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
                    // Si le statut est 204, ne pas tenter de parser du JSON
                    if (response.status === 204) {
                        return null; // Aucun contenu
                    }
                    return response.json();
                })
                .then((updatedCart) => {
                    if (updatedCart) {
                        setCart(updatedCart); // Mettre à jour l'état local si des données sont renvoyées
                        updateCartItemCount(updatedCart.numberOfProducts); // Mettre à jour le compteur
                    } else {
                        // Si le panier est vide
                        setCart({
                            cartID: cart.cartID,
                            numberOfProducts: 0,
                            cartProducts: [],
                            cartTotalPrice: 0,
                        });
                        updateCartItemCount(0);
                    }
                })
                .catch((error) => console.error('Erreur lors de la suppression :', error));
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
                                        <td>
                                            <Button
                                                variant="link"
                                                onClick={() => {
                                                    setSelectedProduct(item.productId); // Naviguer vers la page des détails
                                                    setSelectedCategory(null);
                                                    onHide(); // Fermer le panier
                                                }}
                                            >
                                                {item.productName}
                                            </Button>
                                        </td>
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
