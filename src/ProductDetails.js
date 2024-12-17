import React, { useState } from 'react';
import useSWR from 'swr';
import { Button, Card, Col, Modal, Row, Form } from 'react-bootstrap';
import { getCartIdFromCookie, isCookieConsentGiven, setCookieConsent, createCart } from "./utils";

function ProductDetails({ setCart, setTempCart, productId, setSelectedProduct, setCartItemCount, setShowCart }) {
    const fetcher = (url) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR(`http://localhost:8090/products/${productId}`, fetcher);
    const [showPopup, setShowPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;
    const [selectedSize, setSelectedSize] = useState("");
    const addToCartTemp = () => {
        if (!selectedSize) {
            setErrorMessage("Veuillez sélectionner une taille."); // Assurez que la taille est sélectionnée
            return;
        }

        setTempCart((prev) => [
            ...prev,
            {
                id: productId,
                name: data.productName, // Ajoutez le nom du produit
                price: data.price,
                quantity: 1,
                size: selectedSize, // Ajoutez la taille sélectionnée
                productName: data.productName // Ajoutez le nom du produit pour le lien
            },
        ]);
        setShowCart(true);
    };
    const addToCart = async () => {

        // Si l'utilisateur n'est pas connecté ET le consentement est absent, affichez la popup
        if (!isLoggedIn && !isCookieConsentGiven()) {
            addToCartTemp(); // Utiliser le panier temporaire
            // setShowPopup(true);
            return;
        }
        if (!selectedSize) {
            setErrorMessage("Veuillez sélectionner une taille.");
            return;
        }
        try {
            let cartId;

            // Vérifier si l'utilisateur est connecté
            if (isLoggedIn) {

                // Récupérer les informations de l'utilisateur
                const userResponse = await fetch("http://localhost:8090/auth/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (userResponse.ok) {
                    const user = await userResponse.json();
                    // Récupérer le cartId de l'utilisateur
                    cartId = user.cartId;
                }
            }

            // Si pas connecté, récupérer le cartId depuis les cookies
            if (!cartId) {
                const cookieCartId = getCartIdFromCookie();
                // Crée un panier si aucun n'existe
                cartId = cookieCartId ? cookieCartId : (await createCart()).cartId;
            }
            // Construire l'objet `size` attendu par le backend
            const size = {
                type: selectedSize.startsWith("SIZE_") ? "CHILD" : "ADULT", // Déterminer le type (enfant ou adulte)
                adultSize: !selectedSize.startsWith("SIZE_") && (selectedSize === "XS" || selectedSize === "S" || selectedSize === "M" || selectedSize === "L" || selectedSize === "XL") ? selectedSize : null,
                childSize: selectedSize.startsWith("SIZE_") ? selectedSize : null,
            };
            console.log("Selected size:", selectedSize);
            console.log("Size object:", size);

            // Ajouter le produit au panier
            const response = await fetch(`http://localhost:8090/carts/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cartId,
                    productId,
                    quantity: 1,
                    size, // Inclure l'objet `size`
                }),
            });


            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout du produit au panier.");
            }

            // Mettre à jour le panier et le nombre d'articles
            const updatedCart = await response.json();
            setCart(updatedCart);
            setCartItemCount(updatedCart.numberOfProducts || 0);

            // Afficher le panier
            setShowCart(true);

            // Réinitialiser l'état du produit sélectionné
            setSelectedProduct(null);
        } catch (error) {
            setErrorMessage("Impossible d'ajouter le produit au panier. Veuillez réessayer.");
        }
    };

    // Gérer l'acceptation des cookies
    const handleAcceptCookies = async () => {
        // Définir le consentement des cookies sur vrai
        setCookieConsent(true);
        // Fermer la popup
        setShowPopup(false);
        // Ajouter le produit au panier
        await addToCart();
    };

    // Gérer le refus des cookies
    const handleDeclineCookies = () => {
        // Définir le consentement des cookies sur faux
        setCookieConsent(false);
        // Fermer la popup
        setShowPopup(false);
        // Afficher un message d'erreur
        setErrorMessage("Vous devez accepter les cookies pour ajouter des produits au panier.");
    };

    if (error) return <div>Erreur lors du chargement des détails.</div>;
    if (!data) return <div>Chargement...</div>;

    return (
        <Row className="justify-content-center mt-4">
            <Col xs={12} md={8}>
                <Card>
                    <Card.Header>
                        <h2>{data.productName}</h2>
                    </Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Card.Img
                            variant="top"
                            src={data.imageURL || '/placeholder.jpg'}
                            style={{ width: '500px', height: '500px' }}
                        />
                    </div>
                    <Card.Body>
                        <Card.Text><strong>Marque :</strong> {data.brandName}</Card.Text>
                        <Card.Text>Prix : {data.price} €</Card.Text>
                        <div>
                            <Card.Text>
                                <strong>Choisissez une taille :</strong>
                            </Card.Text>
                            <Form.Select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                            >
                                <option value="">-- Sélectionnez une taille --</option>
                                {data && ((data.adultSizes?.length > 0) || (data.childSizes?.length > 0)) ? (
                                    [...(data.adultSizes || []), ...(data.childSizes?.map((size) => `SIZE_${size}`) || [])].map((size) => (
                                        <option key={size} value={size}>
                                            {size.startsWith("SIZE_") ? size.replace("SIZE_", "") : size} {/* Supprime le préfixe pour l'affichage */}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Aucune taille disponible</option>
                                )}
                            </Form.Select>
                        </div>
                            <Button variant="primary" onClick={addToCart}>
                                Ajouter au panier
                            </Button>
                            <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
                                Retour
                            </Button>
                            {errorMessage && <p style={{color: "red", marginTop: "10px"}}>{errorMessage}</p>}
                    </Card.Body>
                </Card>
            </Col>
            {/* Popup pour demander l'acceptation des cookies */}
            <Modal show={showPopup} onHide={() => setShowPopup(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Accepter les cookies</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Pour ajouter des produits au panier, nous avons besoin de votre consentement pour activer les cookies.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleAcceptCookies}>
                        Accepter les cookies
                    </Button>
                    <Button variant="secondary" onClick={handleDeclineCookies}>
                        Refuser
                    </Button>
                </Modal.Footer>
            </Modal>
        </Row>
    );
}

export default ProductDetails;
