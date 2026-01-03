import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ActivateAccount from "./pages/ActivateAccount";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResendActivation from "./pages/ResendActivation";
import ChangePassword from "./pages/ChangePassword";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SellerDashboard from "./pages/SellerDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import SellerOrders from "./pages/SellerOrders";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminCategories from "./pages/AdminCategories";
import AdminTags from "./pages/AdminTags";
import AdminDashboard from "./pages/AdminDashboard";
import Wishlist from "./pages/Wishlist";


function App() {
	return (
		<BrowserRouter>
			<AppNavbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/activate/:token" element={<ActivateAccount />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-pass/:token" element={<ResetPassword />} />
				<Route path="/resend-activation" element={<ResendActivation />} />
				<Route path="/products" element={<Products />} />
				<Route path="/products/:id" element={<ProductDetail />} />
				<Route path="/cart" element={<Cart />} />
				<Route path="/checkout" element={<Checkout />} />
				<Route path="/order-success" element={<OrderSuccess />} />
				<Route path="/orders" element={<Orders />} />
				<Route
					path="/seller/orders"
					element={
						<ProtectedRoute>
							<SellerOrders />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/orders"
					element={
						<ProtectedRoute>
							<AdminOrders />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/products"
					element={
						<ProtectedRoute>
							<AdminProducts />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/users"
					element={
						<ProtectedRoute>
							<AdminUsers />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/categories"
					element={
						<ProtectedRoute>
							<AdminCategories />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/tags"
					element={
						<ProtectedRoute>
							<AdminTags />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/admin/dashboard"
					element={
						<ProtectedRoute>
							<AdminDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/seller/dashboard"
					element={
						<ProtectedRoute>
							<SellerDashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/seller/products/add"
					element={
						<ProtectedRoute>
							<AddProduct />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/seller/products/:id/edit"
					element={
						<ProtectedRoute>
							<EditProduct />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/wishlist"
					element={
						<ProtectedRoute>
							<Wishlist />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/change-password"
					element={
						<ProtectedRoute>
							<ChangePassword />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
