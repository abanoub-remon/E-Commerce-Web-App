import { useEffect, useState } from "react";
import { Table, Badge, Button } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";
import { FaCheck, FaStar } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

function AdminProducts() {
	const { t } = useTranslation();
	const [products, setProducts] = useState([]);

	const loadProducts = () => {
		api.get("/admin/products/").then((res) => setProducts(res.data));
	};

	useEffect(() => {
		loadProducts();
	}, []);

	const toggleApproval = (p) => {
		const action = p.is_approved ? "reject" : "approve";

		api.put(`/admin/products/${p.id}/status/`, { action }).then(loadProducts);
	};

	const toggleFeatured = (p) => {
		const action = p.is_featured ? "unfeature" : "feature";

		api.put(`/admin/products/${p.id}/status/`, { action }).then(loadProducts);
	};

	return (
		<>
			<h3 className="mb-4">{t("admin_products.manage")}</h3>

			<Table bordered hover responsive className="align-middle">
				<thead>
					<tr>
						<th>{t("admin_products.title")}</th>
						<th>{t("admin_products.seller")}</th>
						<th>{t("admin_products.status")}</th>
						<th>{t("admin_products.featured")}</th>
						<th>{t("admin_products.actions")}</th>
					</tr>
				</thead>

				<tbody>
					{products.map((p) => (
						<tr key={p.id}>
							<td className="fw-semibold">{p.title}</td>

							<td className="text-muted">{p.seller}</td>

							<td>
								{p?.is_approved ? (
									<Badge bg="success">{t("admin_products.approved")}</Badge>
								) : (
									<Badge bg="warning" text="dark">
										{t("admin_products.pending")}
									</Badge>
								)}
							</td>

							<td className="text-center" style={{ fontSize: 18 }}>
								{p.is_featured ? <FaStar color="#facc15" /> : "—"}
							</td>

							<td className="d-flex gap-2">
								<Button
									size="sm"
									variant={p.is_approved ? "secondary" : "success"}
									onClick={() => toggleApproval(p)}
								>
									{p.is_approved ? (
										<>
											<FaTimes className="me-1" />
											{t("admin_products.unapprove")}
										</>
									) : (
										<>
											<FaCheck className="me-1" />
											{t("admin_products.approve")}
										</>
									)}
								</Button>

								<Button
									size="sm"
									variant={p.is_featured ? "secondary" : "warning"}
									onClick={() => toggleFeatured(p)}
								>
									<FaStar className="me-1" />
									{p.is_featured
										? t("admin_products.unfeature")
										: t("admin_products.feature")}
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
}

export default AdminProducts;
