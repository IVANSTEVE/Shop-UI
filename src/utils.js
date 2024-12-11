export const getCartIdFromCookie = () => {
    const cookies = document.cookie.split("; ");
    const cartIdCookie = cookies.find((c) => c.startsWith("cartId="));
    return cartIdCookie ? cartIdCookie.split("=")[1] : null;
};