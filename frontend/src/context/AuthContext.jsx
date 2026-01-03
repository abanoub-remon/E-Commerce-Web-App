import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
	const [authTokens, setAuthTokens] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [cartCount, setCartCount] = useState(0);


	const [wishlistIds, setWishlistIds] = useState(new Set());


	const loadWishlist = async () => {
		try {
			const res = await api.get("/wishlist/");
			setWishlistIds(new Set(res.data.map((i) => i.product.id)));
		} catch (error) {
			console.error("Failed to load wishlist", error);
			setWishlistIds(new Set());
		}
	};

	useEffect(() => {
		const tokens = localStorage.getItem("authTokens");

		if (tokens) {
			const parsedTokens = JSON.parse(tokens);
			setAuthTokens(parsedTokens);

			fetchUserAndInit();
		}

		setLoading(false);
	}, []);

	const fetchUserAndInit = async () => {
		try {
			const [userRes, cartRes] = await Promise.all([
				api.get("/users/profile/"),
				api.get("/cart/count/"),
			]);

			setUser(userRes.data);
			setCartCount(cartRes.data.count);

			await loadWishlist();
		} catch (error) {
			console.error("Failed to restore session after refresh", error);
			logout();
		}
	};

	const login = async (tokens) => {
		setAuthTokens(tokens);
		localStorage.setItem("authTokens", JSON.stringify(tokens));

		try {
			const [userResponse, cartResponse] = await Promise.all([
				api.get("/users/profile/"),
				api.get("/cart/count/"),
			]);

			setUser(userResponse.data);
			setCartCount(cartResponse.data.count);

			await loadWishlist();
		} catch (error) {
			console.error("Failed to fetch data after login", error);
		}
	};

	const logout = () => {
		setAuthTokens(null);
		setUser(null);
		setCartCount(0);
		setWishlistIds(new Set());
		localStorage.removeItem("authTokens");
	};

	const isAuthenticated = !!authTokens;

	return (
		<AuthContext.Provider
			value={{
				authTokens,
				user,
				setUser,
				isAuthenticated,
				login,
				logout,
				loading,
				cartCount,
				setCartCount,
				wishlistIds,
				setWishlistIds,
				loadWishlist,
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	);
}

export default AuthProvider;
