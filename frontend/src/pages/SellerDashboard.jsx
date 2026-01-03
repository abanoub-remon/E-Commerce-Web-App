import { useEffect, useState } from "react";
import { Button, Spinner, Alert, Card, Row, Col, Badge } from "react-bootstrap";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaBox, FaCheck, FaTimes, FaPlus } from "react-icons/fa";

function SellerDashboard() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		api
			.get("/seller/products/")
			.then((res) => {
				const data = res.data;
				setProducts(Array.isArray(data) ? data : data.results || []);
			})
			.catch(() => setError(t("seller.load_failed")))
			.finally(() => setLoading(false));
	}, []);

	const handleDelete = async (id) => {
		if (!window.confirm(t("seller.confirm_delete"))) return;

		try {
			await api.delete(`/products/${id}/`);
			setProducts((prev) => prev.filter((p) => p.id !== id));
		} catch {
			alert(t("seller.delete_failed"));
		}
	};

	if (loading)
		return (
			<div className="text-center py-5">
				<Spinner animation="border" />
			</div>
		);

	if (error) return <Alert variant="danger">{error}</Alert>;

	if (!products.length) {
		return (
			<div className="text-center mt-5">
				<h5>{t("seller.no_products")}</h5>
				<p className="text-muted">{t("seller.start_add")}</p>

				<Button onClick={() => navigate("/seller/products/add")}>
					{t("seller.add_product")}
				</Button>
			</div>
		);
	}

	const stats = {
		total: products.length,
		inStock: products.filter((p) => p.stock > 0).length,
		out: products.filter((p) => p.stock === 0).length,
	};

	return (
		<>
			<div className="d-flex justify-content-between flex-wrap align-items-center mb-4">
				<h3 className="fw-semibold">{t("seller.title")}</h3>

				<Button onClick={() => navigate("/seller/products/add")}>
					<FaPlus className="me-1" /> {t("seller.add_product")}
				</Button>
			</div>

			<Row className="mb-4">
				<Col md={4}>
					<Card className="shadow-sm">
						<Card.Body className="d-flex align-items-center gap-2">
							<FaBox />
							<div>
								<div className="fw-semibold">{t("seller.total_products")}</div>
								<small className="text-muted">{stats.total}</small>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={4}>
					<Card className="shadow-sm">
						<Card.Body className="d-flex align-items-center gap-2">
							<FaCheck color="#16a34a" />
							<div>
								<div className="fw-semibold">{t("seller.in_stock")}</div>
								<small className="text-muted">{stats.inStock}</small>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col md={4}>
					<Card className="shadow-sm">
						<Card.Body className="d-flex align-items-center gap-2">
							<FaTimes color="#dc2626" />
							<div>
								<div className="fw-semibold">{t("seller.out_stock")}</div>
								<small className="text-muted">{stats.out}</small>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>


			<Row>
				{products.map((p) => (
					<Col md={4} key={p.id} className="mb-4">
						<Card className="h-100 shadow-sm product-card">
							<Card.Img
								variant="top"
								src={
									p.images?.length
										? p.images[0].image
										: "https://via.placeholder.com/300"
								}
								style={{ height: 190, objectFit: "cover" }}
							/>

							<Card.Body>
								<Card.Title className="fw-semibold mb-1">{p.title}</Card.Title>

								<p className="mb-1">
									{t("seller.price")}: <strong>${p.final_price}</strong>
								</p>

								<p className="mb-1">
									{t("seller.stock")}:{" "}
									{p.stock > 0 ? (
										<Badge bg="success">{t("seller.in_stock_badge")}</Badge>
									) : (
										<Badge bg="danger">{t("seller.out_stock_badge")}</Badge>
									)}
								</p>

								<div className="d-flex justify-content-between mt-3">
									<Button
										size="sm"
										variant="outline-primary"
										onClick={() => navigate(`/seller/products/${p.id}/edit`)}
									>
										{t("seller.edit")}
									</Button>

									<Button
										size="sm"
										variant="outline-danger"
										onClick={() => handleDelete(p.id)}
									>
										{t("seller.delete")}
									</Button>
								</div>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>

			<style>{`
        .product-card {
          transition: all .18s ease;
        }
        .product-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(0,0,0,.08);
        }
      `}</style>
		</>
	);
}

export default SellerDashboard;
