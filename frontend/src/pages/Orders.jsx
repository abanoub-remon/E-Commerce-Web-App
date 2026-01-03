import { useEffect, useState } from "react";
import {
	Card,
	Badge,
	Spinner,
	Accordion,
	Row,
	Col,
	Alert,
	ProgressBar,
} from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

const statusVariant = {
	pending: "warning",
	processing: "info",
	shipped: "primary",
	delivered: "success",
	cancelled: "secondary",
};

const statusSteps = ["pending", "processing", "shipped", "delivered"];

function Orders() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api
			.get("/orders/")
			.then((res) => setOrders(res.data))
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="text-center py-5">
				<Spinner animation="border" />
			</div>
		);
	}

	if (!orders.length) {
		return (
			<Alert variant="light" className="text-center mt-4 shadow-sm">
				<h5 className="mb-1">{t("orders.empty_title")}</h5>
				<p className="text-muted mb-0">{t("orders.empty_text")}</p>
			</Alert>
		);
	}

	const getProgress = (status) => {
		const normalized = (status || "").toLowerCase();
		if (normalized === "cancelled") return 0;
		const index = statusSteps.indexOf(normalized);
		return index === -1
			? 0
			: Math.round(((index + 1) / statusSteps.length) * 100);
	};

	return (
		<>
			<h3 className="mb-4 fw-semibold">{t("orders.title")}</h3>

			{orders.map((order) => {
				const normalized = (order.status || "").toLowerCase();

				return (
					<Card key={order.id} className="mb-3 shadow-sm border-0">
						<Card.Body>
							<div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
								<div>
									<h5 className="mb-1">
										{t("orders.order")} #{order.id}
									</h5>
									<small className="text-muted">
										{t("orders.date")}: {new Date(order.created_at).toLocaleDateString()}
									</small>
								</div>

								<Badge
									bg={statusVariant[normalized] || statusVariant["pending"]}
									className="px-3 py-2"
								>
									{t(`orders.status.${normalized}`, order.status)}
								</Badge>
							</div>

							<div className="mt-3">
								<ProgressBar
									now={getProgress(order.status)}
									animated
									striped
									variant={statusVariant[normalized] || "warning"}
									className="rounded-pill"
									style={{ height: 12 }}
								/>

								<div className="d-flex justify-content-between mt-1 small text-muted">
									<span>{t("orders.status.pending")}</span>
									<span>{t("orders.status.processing")}</span>
									<span>{t("orders.status.shipped")}</span>
									<span>{t("orders.status.delivered")}</span>
								</div>
							</div>

							<hr />

							<Row className="mb-2">
								<Col sm={6} className="mb-2">
									<strong>{t("orders.total")}:</strong> ${order.total_price}
								</Col>
								<Col sm={6} className="mb-2">
									<strong>{t("orders.items")}:</strong> {order.items?.length}
								</Col>
							</Row>

							<Accordion flush>
								<Accordion.Item eventKey="0">
									<Accordion.Header>{t("orders.show_details")}</Accordion.Header>

									<Accordion.Body>
										{order.items.map((item) => (
											<div
												key={item.id}
												className="d-flex justify-content-between align-items-center mb-2"
											>
												<div className="d-flex align-items-center gap-2">
													<img
														src={item.image || "https://via.placeholder.com/60"}
														alt={item.product_title}
														style={{
															width: 58,
															height: 58,
															objectFit: "cover",
															borderRadius: 10,
														}}
													/>

													<div>
														<div className="fw-semibold">{item.product_title}</div>
														<small className="text-muted">
															{t("orders.qty")} {item.quantity}
														</small>
													</div>
												</div>

												<strong>${item.price * item.quantity}</strong>
											</div>
										))}
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</Card.Body>
					</Card>
				);
			})}
		</>
	);
}

export default Orders;
