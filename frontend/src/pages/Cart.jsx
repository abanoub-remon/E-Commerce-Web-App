import { useEffect, useState, useContext } from "react";
import { Table, Button, Form, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { getCart, removeFromCart, updateQuantity } from "../utils/cart";
import { useTranslation } from "react-i18next";

function Cart() {
	const { t } = useTranslation();
	const { user, setCartCount } = useContext(AuthContext);
	const navigate = useNavigate();
	const [cart, setCart] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadCart();
	}, [user]);

	useEffect(() => {
		const newCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
		setCartCount(newCartCount);
	}, [cart, setCartCount]);

	const loadCart = async () => {
		try {
			if (user) {
				const res = await api.get("/cart/");
				setCart(res.data);
			} else {
				setCart(getCart());
			}
		} catch {
			console.error("Failed to load cart");
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async (id, quantity) => {
		if (user) {
			await api.delete(`/cart/item/${id}/`);
			setCartCount((prev) => prev - quantity);
			loadCart();
		} else {
			removeFromCart(id);
			const updated = getCart();
			setCart(updated);
			setCartCount(updated.reduce((s, i) => s + i.quantity, 0));
		}
	};

	const handleQtyChange = async (id, qty) => {
		if (qty < 1) return;

		if (user) {
			const item = cart.find((i) => i.id === id || i.product_id === id);
			const oldQty = item ? item.quantity : 0;

			await api.put(`/cart/item/${id}/update/`, { quantity: qty });
			setCartCount((prev) => prev + (qty - oldQty));
			loadCart();
		} else {
			updateQuantity(id, qty);
			const updated = getCart();
			setCart(updated);
			setCartCount(updated.reduce((s, i) => s + i.quantity, 0));
		}
	};

	const handleCheckout = () => {
		if (!user) navigate("/login");
		else navigate("/checkout");
	};

	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	if (loading) return null;

	if (!cart.length) {
		return (
			<Alert variant="info" className="mt-4 text-center">
				{t("cart.empty")}
			</Alert>
		);
	}

	return (
		<>
			<h3 className="mb-4">{t("cart.title")}</h3>

			<Row>
				<Col md={8}>
					<Table hover responsive className="align-middle">
						<thead>
							<tr>
								<th>{t("cart.product")}</th>
								<th width="140" className="text-center">
									{t("cart.price")}
								</th>
								<th width="160" className="text-center">
									{t("cart.quantity")}
								</th>
								<th width="140" className="text-center">
									{t("cart.total")}
								</th>
								<th width="80"></th>
							</tr>
						</thead>

						<tbody>
							{cart.map((item) => {
								const id = user ? item.id : item.product_id;
								return (
									<tr key={id}>
										<td>
											<div className="d-flex align-items-center">
												<img
													src={item.image || "https://via.placeholder.com/80"}
													alt=""
													width={80}
													height={80}
													className="rounded border me-3"
													style={{ objectFit: "cover" }}
												/>
												<span>{item.product_title || item.title}</span>
											</div>
										</td>

										<td className="text-center">${item.price}</td>

										<td className="text-center">
											<div className="d-inline-flex align-items-center">
												<Button
													size="sm"
													variant="outline-secondary"
													onClick={() => handleQtyChange(id, item.quantity - 1)}
												>
													−
												</Button>

												<Form.Control
													type="number"
													min="1"
													value={item.quantity}
													className="mx-2 text-center"
													style={{ width: 60 }}
													onChange={(e) => handleQtyChange(id, Number(e.target.value))}
												/>

												<Button
													size="sm"
													variant="outline-secondary"
													onClick={() => handleQtyChange(id, item.quantity + 1)}
												>
													+
												</Button>
											</div>
										</td>

										<td className="text-center">${item.price * item.quantity}</td>

										<td className="text-center">
											<Button
												size="sm"
												variant="outline-danger"
												onClick={() => handleRemove(id, item.quantity)}
											>
												{t("cart.remove")}
											</Button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</Table>
				</Col>

				<Col md={4}>
					<Card className="shadow-sm ">
						<Card.Body>
							<h5 className="mb-3">{t("cart.summary")}</h5>

							<div className="d-flex justify-content-between mb-2">
								<span>{t("cart.subtotal")}</span>
								<strong>${total}</strong>
							</div>

							<div className="d-flex justify-content-between text-muted small mb-3">
								<span>{t("cart.shipping")}</span>
								<span>{t("cart.shipping_calc")}</span>
							</div>

							<hr />

							<div className="d-flex justify-content-between mb-3">
								<h6 className="mb-0">{t("cart.total")}</h6>
								<h6 className="mb-0">${total}</h6>
							</div>

							<Button className="w-100" onClick={handleCheckout}>
								{t("cart.checkout")}
							</Button>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default Cart;
