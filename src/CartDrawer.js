import React, {useRef} from 'react';
import {Card, Table, Form, Button, Spinner} from 'react-bootstrap';
import './Card.css';
import {useState, useEffect} from 'react';
import {createCart, getCartIdFromCookie, isCookieConsentGiven} from "./utils";

function CartDrawer({cart, setCart, show, onHide,  setCartItemCount,setTempCart, tempCart, setSelectedProduct, setSelectedCategory}) {
    const [isLoading, setIsLoading] = useState(false);
    const fetchCalledOnce = useRef(false); // Drapeau pour empêcher la double exécution stricte
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    const totalItemsTempCart = tempCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPriceTempCart = tempCart.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // Utiliser un effet pour charger le panier une seule fois
    useEffect(() => {
        const fetchCart = async () => {
            // Si les cookies ne sont pas acceptés ou l'utilisateur n'est pas connecté
            if (!isLoggedIn && !isCookieConsentGiven()) {
                console.log("Utilisation du panier temporaire.");
                setIsLoading(false);
                return;
            }

            // Si le panier n'est pas affiché ou déjà chargé, ne rien faire
            if (!show || fetchCalledOnce.current) {
                return;
            }

            // Marquer le fetch comme appelé pour empêcher les appels multiples
            fetchCalledOnce.current = true;
            setIsLoading(true);

            try {
                let cartId = null;

                // Si l'utilisateur est connecté récupère les informations de l'utilisateur
                if (isLoggedIn) {
                    const authResponse = await fetch("http://localhost:8090/auth/me", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    // Si la réponse est OK, récupérer le cartId de l'utilisateur
                    if (authResponse.ok) {
                        const user = await authResponse.json();
                        cartId = user.cartId;
                    }
                }

                // Si non connecté, utiliser l'ID du cookie ou en créer un nouveau
                if (!cartId) {
                    cartId = getCartIdFromCookie() || (await createCart()).cartId;
                }

                // Charger le panier avec l'ID récupéré
                const response = await fetch(`http://localhost:8090/carts/${cartId}`);
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement du panier.");
                }

                const fetchedCart = await response.json();

                // Mettre à jour le panier et le nombre d'articles
                setCart(fetchedCart);
                setCartItemCount(fetchedCart.numberOfProducts || 0);
            } catch (error) {
                console.error("Erreur lors du chargement/initialisation du panier :", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, [show, isLoggedIn, setCart, setCartItemCount]);

    // Fonction pour mettre à jour la quantité d'un produit
    const updateQuantity = async (idProduct, newQuantity, size) => {
        // Si utilisateur non connecté et cookies non acceptés
        setTempCart((prev) =>
            prev.map((item) =>
                item.id === idProduct && item.size === size
                    ? { ...item, quantity: newQuantity } // Mettre à jour la quantité si ID et taille correspondent
                    : item
            )
        );

        // Si utilisateur connecté ou cookies acceptés
        // Mettre à jour côté serveur
        if (isLoggedIn || isCookieConsentGiven()) {
            try {

                const sizeObject = {
                    type: size.startsWith("SIZE_") ? "CHILD" : "ADULT",
                    adultSize:!size.startsWith("SIZE_") && (size.includes("XS") || size.includes("S") || size.includes("M") || size.includes("L") || size.includes("XL")) ? size : null,
                    childSize: size.startsWith("SIZE_") ? size : null,
                };

                // Mettre à jour la quantité du produit dans le panier serveur
                const response = await fetch(
                    `http://localhost:8090/carts/${cart.cartId}/products/${idProduct}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ quantity: newQuantity, size: sizeObject }),
                    }
                );

                if (!response.ok) {
                    throw new Error("Erreur lors de la mise à jour de la quantité.");
                }

                // Mettre à jour l'état du panier et le nombre d'articles
                const updatedCart = await response.json();
                setCart(updatedCart);
                setCartItemCount(updatedCart.numberOfProducts);
            } catch (error) {
                console.error("Erreur lors de la mise à jour de la quantité :", error);
            }
        }
    };


    const removeFromCart = async (idProduct, size) => {

        // Demander une confirmation avant de supprimer le produit
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            try {
                // Si utilisateur non connecté et cookies non acceptés
                if (!isLoggedIn && !isCookieConsentGiven()) {
                    console.log("Produit à supprimer :", { id: idProduct, size });
                    console.log("tempCart avant suppression :", tempCart);

                    // Mettre à jour `tempCart`
                    setTempCart((prev) => {
                        const updatedCart = prev.filter(
                            (item) => !(item.id === idProduct && item.size === size)
                        );
                        console.log("tempCart après suppression :", updatedCart); // Log après filtrage
                        return updatedCart;
                    });

                    return; // Arrêter ici pour éviter de continuer inutilement
                }
                const sizeObject = {
                    type: size.startsWith("SIZE_") ? "CHILD" : "ADULT",
                    adultSize:!size.startsWith("SIZE_") && (size.includes("XS") || size.includes("S") || size.includes("M") || size.includes("L") || size.includes("XL")) ? size : null,
                    childSize: size.startsWith("SIZE_") ? size : null,
                };

                const requestPayload = {
                    cartId: cart.cartId,
                    productId: idProduct,
                    size: sizeObject, // Correspond à l'objet `Size` dans AddToCartRequest
                };

                console.log("Payload envoyé :", JSON.stringify(requestPayload));

                const response = await fetch(
                    `http://localhost:8090/carts/${cart.cartId}/products/${idProduct}`,
                    {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(requestPayload), // Passer AddToCartRequest
                    }
                );

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du produit.');
                }
                // Si le statut est 204, le panier est vide, sinon mettre à jour le panier
                if (response.status === 204) {
                    setCart({
                        cartId: cart.cartId,
                        numberOfProducts: 0,
                        cartProducts: [],
                        cartTotalPrice: 0,
                    });
                    setCartItemCount(0);
                    return;
                }

                // Mettre à jour le panier et le nombre d'articles
                const updatedCart = await response.json();
                setCart(updatedCart);
                setCartItemCount(updatedCart.numberOfProducts);
            } catch (error) {
                console.error('Erreur lors de la suppression :', error);
            }
        }
    };

    // Fonction pour accepter les cookies
    // const handleAcceptCookies = () => {
    //     // Définir le consentement des cookies sur vrai
    //     document.cookie = "userCookieConsent=true; path=/; max-age=" + 365 * 24 * 60 * 60;
    //     // Mettre à jour l'état des cookies acceptés
    //     setCookiesAccepted(true);
    // };

    // Ne pas afficher le panier si `show` est faux
    if (!show) return null;

    if (!isLoggedIn && !isCookieConsentGiven()) {
        return (
            <Card>
                <Card.Header>
                    <Card.Title className="text-center">Votre Panier ({totalItemsTempCart} articles)</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Table responsive striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Article</th>
                            <th>Size</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Total ligne</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tempCart.length > 0 ? (
                            tempCart.map((item, index) => (
                                <tr key={index}>
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
                                    <td>{item.size.startsWith("SIZE_") ? item.size.replace("SIZE_", "") : item.size}</td>
                                    <td>
                                        {/* Champ de sélection pour la quantité */}
                                        <Form.Select
                                            size="sm"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value), item.size)} // Passer l'ID, la nouvelle quantité et la taille
                                        >
                                            {[...Array(10).keys()].map((val) => (
                                                <option key={val + 1} value={val + 1}>
                                                    {val + 1}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </td>
                                    <td>{item.price} €</td>
                                    <td>{(item.quantity * item.price).toFixed(2)} €</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            onClick={() => removeFromCart(item.id, item.size)} // Passer l'ID et la taille pour la suppression
                                        >
                                            Supprimer
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="6" className="text-center">Aucun produit dans le panier.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                    <div className="mt-3 text-end">
                        <h5>
                            Total général (TVA 21% comprise): <strong>{totalPriceTempCart.toFixed(2)} €</strong>
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
                </Card.Body>
            </Card>
        );
    }


    // Affichage du message si les cookies sont refusés
    // if (!isLoggedIn && !cookiesAccepted) {
    //     return (
    //         <Card>
    //             <Card.Header>
    //                 <Card.Title className="text-center">Votre Panier</Card.Title>
    //             </Card.Header>
    //             <Card.Body>
    //                 <div className="text-center">
    //                     <p>
    //                         La fonctionnalité du panier nécessite l'activation des cookies. Veuillez les accepter
    //                         pour continuer.
    //                     </p>
    //                     {/* Bouton personnalisé pour accepter les cookies */}
    //                     <Button
    //                         variant="success"
    //                         onClick={handleAcceptCookies} // Accepter les cookies et afficher le panier
    //                     >
    //                         Accepter les cookies
    //                     </Button>
    //                 </div>
    //             </Card.Body>
    //         </Card>
    //     );
    // }

    // Affichage du panier si les cookies sont acceptés
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
                                <th>Taille</th>
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
                                        <td>{item.size.startsWith("SIZE_") ? item.size.replace("SIZE_", "") : item.size}</td>
                                        <td>
                                            <Form.Select
                                                size="sm"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    updateQuantity(item.productId, parseInt(e.target.value), item.size)
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
                                                onClick={() => removeFromCart(item.productId, item.size)}
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
