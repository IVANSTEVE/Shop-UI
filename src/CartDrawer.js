import React, {useRef} from 'react';
import {Card, Table, Form, Button, Spinner} from 'react-bootstrap';
import './Card.css';
import {useState, useEffect} from 'react';

function CartDrawer({cart, setCart, show, onHide, updateCartItemCount, setSelectedProduct, setSelectedCategory}) {
    const [isLoading, setIsLoading] = useState(false);
    const fetchCalledOnce = useRef(false); // Drapeau pour empêcher la double exécution stricte

    // Utiliser un effet pour charger le panier une seule fois
    useEffect(() => {
        // Fonction pour charger le panier
        const fetchCart = async () => {
            // Si le panier n'est pas affiché, ne pas exécuter
            if (!show) {
                return;
            }
            // Si déjà exécuté, ne pas exécuter
            if (fetchCalledOnce.current) {
                return;
            }

            fetchCalledOnce.current = true; // Défini comme exécuté pour éviter les doubles appels
            setIsLoading(true);

            // Fonction asynchrone pour charger le panier
            try {
                // Récupérer les infos utilisateur
                const authResponse = await fetch("http://localhost:8090/auth/me", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Utiliser le token
                    },
                });

                // Si l'utilisateur est connecté et a un panier
                if (authResponse.ok) {
                    const user = await authResponse.json();

                    if (user.cartId) {
                        // Charger le panier de l'utilisateur
                        const response = await fetch(`http://localhost:8090/carts/${user.cartId}`);
                        if (!response.ok) {
                            throw new Error("Erreur lors du chargement du panier utilisateur.");
                        }
                        const userCart = await response.json();

                        // Mettre à jour le panier et le compteur
                        setCart(userCart);
                        updateCartItemCount(userCart.numberOfProducts || 0);
                        return;
                    }
                }

                // Si pas de cartId pour l'utilisateur ou requête échouée, utiliser le cookie

                // Récupérer le cartId depuis les cookies
                const cookieCartId = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("cartId="))
                    ?.split("=")[1];

                // Si un cartId est trouvé dans les cookies
                if (cookieCartId) {
                    // Charger le panier depuis le cookie
                    const response = await fetch(`http://localhost:8090/carts/${cookieCartId}`);
                    if (!response.ok) {
                        throw new Error("Erreur lors du chargement du panier.");
                    }
                    const data = await response.json();

                    // Mettre à jour le panier et le compteur
                    setCart(data);
                    updateCartItemCount(data.numberOfProducts || 0);
                } else {
                    // Créer un nouveau panier si aucun cartId n'est trouvé
                    const response = await fetch("http://localhost:8090/carts", {method: "POST"});
                    if (!response.ok) {
                        throw new Error("Erreur lors de la création du panier.");
                    }
                    const newCart = await response.json();

                    // Mettre à jour le panier et le compteur
                    setCart(newCart);
                    updateCartItemCount(newCart.numberOfProducts || 0);

                    // Enregistrer le cartId dans les cookies
                    document.cookie = `cartId=${newCart.cartId};path=/;max-age=604800`; // Cookie pour 7 jours
                }
            } catch (error) {
                console.error("Erreur lors du chargement/initialisation du panier :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [show, setCart, updateCartItemCount, cart]);

    // Fonction pour mettre à jour la quantité d'un produit
    const updateQuantity = (idProduct, newQuantity) => {

        fetch(`http://localhost:8090/carts/${cart.cartId}/products/${idProduct}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({quantity: newQuantity}),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la mise à jour de la quantité.');
                }
                return response.json();
            })
            .then((updatedCart) => {
                setCart(updatedCart); // Mettre à jour le panier
                updateCartItemCount(updatedCart.numberOfProducts); // Mettre à jour le compteur
            })
            .catch((error) => console.error('Erreur lors de la mise à jour de la quantité :', error));
    };

    // Fonction pour supprimer un produit du panier
    const removeFromCart = (idProduct) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            fetch(`http://localhost:8090/carts/${cart.cartId}/products/${idProduct}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la suppression du produit.');
                    }
                    if (response.status === 204) {
                        return null; // Aucun contenu si panier vide
                    }
                    return response.json();
                })
                // Mettre à jour le panier et le compteur
                .then((updatedCart) => {
                    if (updatedCart) {
                        setCart(updatedCart); // Mettre à jour le panier
                        updateCartItemCount(updatedCart.numberOfProducts); // Mettre à jour le compteur
                    } else {
                        // Si le panier est vide, réinitialiser le panier
                        setCart({
                            cartId: cart.cartId,
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
                        <Spinner animation="border"/>
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

export default React.memo(CartDrawer);
