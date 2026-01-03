import { useEffect, useState } from "react";
import { Card, Badge, Form, Row, Col } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

const statusColors = {
	PENDING: "warning",
	PROCESSING: "info",
	SHIPPED: "primary",
	DELIVERED: "success",
};

function SellerOrders() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState([]);

	const loadOrders = () => {
		api.get("/seller/orders/").then((res) => setOrders(res.data));
	};

	useEffect(() => {
		loadOrders();
	}, []);

	const updateStatus = async (orderId, status) => {
		await api.put(`/seller/orders/${orderId}/status/`, { status });
		loadOrders();
	};

	return (
		<>
			<h3 className="mb-4 fw-semibold">{t("seller_orders.title")}</h3>

			{orders.map((order) => {
				const total = order.items.reduce((s, it) => s + it.price * it.quantity, 0);

				return (
					<Card key={order.id} className="mb-3 shadow-sm border-0">
						<Card.Body>
							<div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
								<div>
									<h5 className="mb-1">
										{t("seller_orders.order")} #{order.id}
									</h5>
									<small className="text-muted">
										{t("seller_orders.customer")}: {order.full_name}
									</small>
								</div>

								<Badge
									bg={statusColors[order.status] || "secondary"}
									className="px-3 py-2"
								>
									{t(`seller_orders.status.${order.status}`)}
								</Badge>
							</div>

							<hr />

							{order.items.map((item) => (
								<div
									key={item.id}
									className="d-flex justify-content-between align-items-center mb-2"
								>
									<div className="text-truncate">
										{item.product_title} × {item.quantity}
									</div>

									<strong>${item.price * item.quantity}</strong>
								</div>
							))}

							<Row className="mt-2">
								<Col sm={6} className="mb-2">
									<strong>{t("seller_orders.total")}:</strong> ${total}
								</Col>

								<Col sm={6} className="text-sm-end">
									<Form.Select
										value={order.status}
										onChange={(e) => updateStatus(order.id, e.target.value)}
									>
										<option value="PENDING">{t("seller_orders.status.PENDING")}</option>
										<option value="PROCESSING">
											{t("seller_orders.status.PROCESSING")}
										</option>
										<option value="SHIPPED">{t("seller_orders.status.SHIPPED")}</option>
										<option value="DELIVERED">
											{t("seller_orders.status.DELIVERED")}
										</option>
									</Form.Select>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				);
			})}
		</>
	);
}

export default SellerOrders;
