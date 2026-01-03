import { useEffect, useState } from "react";
import { Card, Badge, Form } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function AdminOrders() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState([]);

	const loadOrders = () => {
		api.get("/admin/orders/").then((res) => setOrders(res.data));
	};

	useEffect(() => {
		loadOrders();
	}, []);

	const updateStatus = async (orderId, status) => {
		await api.put(`/admin/orders/${orderId}/status/`, { status });
		loadOrders();
	};

	const getStatusVariant = (status) => {
		switch (status) {
			case "PENDING":
				return "secondary";
			case "PROCESSING":
				return "info";
			case "SHIPPED":
				return "primary";
			case "DELIVERED":
				return "success";
			default:
				return "dark";
		}
	};

	return (
		<>
			<h3 className="mb-4">{t("orders.admin_title")}</h3>

			{orders.map((order) => (
				<Card key={order.id} className="mb-3 shadow-sm">
					<Card.Body>
						<div className="d-flex justify-content-between align-items-center mb-2">
							<h5 className="mb-0">
								{t("orders.order")} #{order.id}
							</h5>

							<Badge bg={getStatusVariant(order.status)}>
								{t(`orders.status.${order.status.toLowerCase()}`)}
							</Badge>
						</div>

						<p className="mb-1">
							<strong>{t("orders.user")}:</strong> {order.full_name}
						</p>

						<p className="mb-2">
							<strong>{t("orders.total")}:</strong> ${order.total_price}
						</p>

						<div className="mb-2">
							<strong>{t("orders.shipping")}:</strong>
							<div className="text-muted small">
								{order?.address && <div>{order.address}</div>}
								{order?.city && <div>{order.city}</div>}
							</div>
						</div>

						<div className="mb-3">
							<strong>{t("orders.payment")}:</strong>{" "}
							<span className="text-muted">
								{order.payment_method || t("orders.unknown")}
							</span>
						</div>

						{order.items.map((item) => (
							<div key={item.id} className="d-flex justify-content-between text-muted">
								<span>
									{item.product_title} × {item.quantity}
								</span>
								<strong>${item.price * item.quantity}</strong>
							</div>
						))}

						<Form.Select
							className="mt-3"
							value={order.status}
							onChange={(e) => updateStatus(order.id, e.target.value)}
						>
							<option value="PENDING">{t("orders.status.pending")}</option>
							<option value="PROCESSING">{t("orders.status.processing")}</option>
							<option value="SHIPPED">{t("orders.status.shipped")}</option>
							<option value="DELIVERED">{t("orders.status.delivered")}</option>
						</Form.Select>
					</Card.Body>
				</Card>
			))}
		</>
	);
}

export default AdminOrders;
