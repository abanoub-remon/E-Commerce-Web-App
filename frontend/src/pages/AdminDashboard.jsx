import { useEffect, useState } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import {
	FaUsers,
	FaShoppingBag,
	FaBoxOpen,
	FaDollarSign,
} from "react-icons/fa";

function AdminDashboard() {
	const { t } = useTranslation();
	const [data, setData] = useState(null);

	useEffect(() => {
		api.get("/admin/analytics/").then((res) => setData(res.data));
	}, []);

	if (!data) return null;

	const StatCard = ({ icon, title, value, link }) => (
		<Card className="shadow-sm h-100">
			<Card.Body className="d-flex flex-column">
				<div className="d-flex align-items-center gap-3 mb-2">
					<span
						style={{
							fontSize: 26,
							color: "#2563eb",
						}}
					>
						{icon}
					</span>
					<h6 className="mb-0">{title}</h6>
				</div>

				<h3 className="fw-bold mb-3">{value}</h3>

				{link && (
					<div className="mt-auto">
						<Button as={Link} to={link} size="sm" variant="outline-primary">
							{t("admin.manage")}
						</Button>
					</div>
				)}
			</Card.Body>
		</Card>
	);

	return (
		<>
			<h3 className="mb-4">{t("admin.dashboard")}</h3>

			<Row className="mb-4 g-3">
				<Col md={3} sm={6}>
					<StatCard
						icon={<FaUsers />}
						title={t("admin.total_users")}
						value={data.total_users}
						link="/admin/users"
					/>
				</Col>

				<Col md={3} sm={6}>
					<StatCard
						icon={<FaShoppingBag />}
						title={t("admin.total_orders")}
						value={data.total_orders}
						link="/admin/orders"
					/>
				</Col>

				<Col md={3} sm={6}>
					<StatCard
						icon={<FaBoxOpen />}
						title={t("admin.total_products")}
						value={data.total_products}
						link="/admin/products"
					/>
				</Col>

				<Col md={3} sm={6}>
					<StatCard
						icon={<FaDollarSign />}
						title={t("admin.total_revenue")}
						value={`$${data.total_revenue}`}
					/>
				</Col>
			</Row>

			<Row className="g-3">
				<Col md={6}>
					<Card className="shadow-sm h-100">
						<Card.Body>
							<h6 className="mb-2">{t("admin.best_product")}</h6>

							{data.best_product ? (
								<>
									<p className="mb-1">{data.best_product.product__title}</p>
									<small className="text-muted">
										{t("admin.sold")}: {data.best_product.total_sold}
									</small>
								</>
							) : (
								<p className="text-muted">{t("admin.no_data")}</p>
							)}
						</Card.Body>
					</Card>
				</Col>

				<Col md={6}>
					<Card className="shadow-sm h-100">
						<Card.Body>
							<h6 className="mb-2">{t("admin.top_seller")}</h6>

							{data.top_seller ? (
								<>
									<p className="mb-1">{data.top_seller.seller__email}</p>
									<small className="text-muted">
										{t("admin.products")}: {data.top_seller.total_products}
									</small>
								</>
							) : (
								<p className="text-muted">{t("admin.no_data")}</p>
							)}
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
}

export default AdminDashboard;
