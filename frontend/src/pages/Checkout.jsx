import { useEffect, useState, useContext } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { getCart, clearCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

function Checkout() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	const [cart, setCart] = useState([]);
	const [error, setError] = useState("");

	const [form, setForm] = useState({
		full_name: "",
		address: "",
		city: "",
		phone: "",
		payment_method: "cod",
	});

	useEffect(() => {
		if (!user) navigate("/login");
	}, [user, navigate]);

	useEffect(() => {
		const loadCartForCheckout = async () => {
			if (user) {
				const res = await api.get("/cart/");
				if (!res.data.length) navigate("/cart");
				else setCart(res.data);
			} else {
				const items = getCart();
				if (!items.length) navigate("/cart");
				else setCart(items);
			}
		};

		loadCartForCheckout();
	}, [user, navigate]);

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			await api.post("/orders/create/", {
				full_name: form.full_name,
				address: form.address,
				city: form.city,
				phone: form.phone,
				payment_method: form.payment_method,
			});

			clearCart();
			navigate("/order-success");
		} catch {
			setError(t("checkout.failed"));
		}
	};

	return (
		<>
			<h3 className="mb-4">{t("checkout.title")}</h3>

			{error && (
				<Alert variant="danger" className="mb-3">
					{error}
				</Alert>
			)}

			<Card className="mb-4 shadow-sm">
				<Card.Body>
					<Card.Title className="mb-3">{t("checkout.summary")}</Card.Title>

					{cart.map((item) => (
						<div
							key={item.product_id || item.id}
							className="d-flex justify-content-between mb-2"
						>
							<span>
								{item.title || item.product_title} × {item.quantity}
							</span>
							<strong>${item.price * item.quantity}</strong>
						</div>
					))}

					<hr />

					<h5 className="d-flex justify-content-between">
						<span>{t("checkout.total")}</span>
						<span>${total}</span>
					</h5>
				</Card.Body>
			</Card>

			<Card className="shadow-sm">
				<Card.Body>
					<Card.Title className="mb-3">{t("checkout.shipping")}</Card.Title>

					<Form onSubmit={handleSubmit}>
						<Form.Control
							className="mb-2"
							name="full_name"
							placeholder={t("checkout.full_name")}
							required
							onChange={handleChange}
						/>

						<Form.Control
							className="mb-2"
							name="address"
							placeholder={t("checkout.address")}
							required
							onChange={handleChange}
						/>

						<Form.Control
							className="mb-2"
							name="city"
							placeholder={t("checkout.city")}
							required
							onChange={handleChange}
						/>

						<Form.Control
							className="mb-3"
							name="phone"
							placeholder={t("checkout.phone")}
							required
							onChange={handleChange}
						/>

						<Form.Select
							className="mb-3"
							name="payment_method"
							onChange={handleChange}
						>
							<option value="cod">{t("checkout.cod")}</option>
							<option value="card">{t("checkout.card")}</option>
						</Form.Select>

						<Button type="submit" className="w-100">
							{t("checkout.place")}
						</Button>
					</Form>
				</Card.Body>
			</Card>
		</>
	);
}

export default Checkout;
