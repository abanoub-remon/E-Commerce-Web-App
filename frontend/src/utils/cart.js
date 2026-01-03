const CART_KEY = "cart_items";

export const getCart = () => {
	const cart = localStorage.getItem(CART_KEY);
	return cart ? JSON.parse(cart) : [];
};

const saveCart = (cart) => {
	localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product) => {
	const cart = getCart();
	const existing = cart.find((item) => item.product_id === product.id);

	if (existing) {
		existing.quantity += 1;
	} else {
		cart.push({
			product_id: product.id,
			title: product.title,
			price: product.final_price,
			quantity: 1,
			image: product.images?.[0]?.image || "",
		});
	}

	saveCart(cart);
	window.dispatchEvent(new Event("storage"));
};

export const removeFromCart = (productId) => {
	const cart = getCart().filter((item) => item.product_id !== productId);
	saveCart(cart);
	window.dispatchEvent(new Event("storage"));
};

export const updateQuantity = (productId, qty) => {
	const cart = getCart();
	const item = cart.find((i) => i.product_id === productId);

	if (item) {
		item.quantity = qty;
		saveCart(cart);
		window.dispatchEvent(new Event("storage"));
	}
};

export const clearCart = () => {
	localStorage.removeItem(CART_KEY);
	window.dispatchEvent(new Event("storage"));
};

export const getCartCount = () => {
	const cart = getCart();
	return cart.reduce((sum, item) => sum + item.quantity, 0);
};