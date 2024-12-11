// Vérifie si le consentement aux cookies a été donné
export const isCookieConsentGiven = () => {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith("userCookieConsent="))
        ?.split("=")[1] === "true";
};

// Définit le consentement des cookies
export const setCookieConsent = (value) => {
    const consentValue = value ? "true" : "false";
    document.cookie = `userCookieConsent=${consentValue};path=/;max-age=${365 * 24 * 60 * 60}`; // 1 an
};


export const getCartIdFromCookie = () => {
    const cookies = document.cookie.split("; ");
    const cartIdCookie = cookies.find((c) => c.startsWith("cartId="));
    return cartIdCookie ? cartIdCookie.split("=")[1] : null;
};

export const createCart = async () => {
    // Vérifier si les cookies sont acceptés
    if (!isCookieConsentGiven()) {
        console.log("Consentement aux cookies non donné. Le panier ne sera pas créé.");
        return null; // Retournez `null` si le consentement n'est pas donné
    }
    try {
        console.log("Création d'un nouveau panier...");
        const response = await fetch("http://localhost:8090/carts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la création du panier.");
        }

        const newCart = await response.json();
        console.log("Nouveau panier créé :", newCart);

        // Enregistrez le cartId dans un cookie
        document.cookie = `cartId=${newCart.cartId};path=/;max-age=604800`; // Valide 7 jours
        return newCart;
    } catch (error) {
        console.error("Erreur lors de la création du panier :", error.message);
        throw error;
    }
};
