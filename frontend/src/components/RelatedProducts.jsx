import { useEffect, useState } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";

function RelatedProducts({ productId }) {
	const { t } = useTranslation();
	const [products, setProducts] = useState([]);

	useEffect(() => {
		api.get(`/products/${productId}/related/`).then((res) => {
			const data = res.data;
			setProducts(Array.isArray(data) ? data : data.results || []);
		});
	}, [productId]);

	const list = Array.isArray(products) ? products : products.results || [];

	return (
		<>
			<h5 className="mt-4 mb-3">{t("product.related_products")}</h5>

			{list.length === 0 ? (
				<Alert variant="light" className="text-muted">
					{t("product.no_related")}
				</Alert>
			) : (
				<Row>
					{list.map((p) => (
						<Col md={3} sm={6} xs={12} key={p.id} className="mb-3">
							<ProductCard product={p} />
						</Col>
					))}
				</Row>
			)}
		</>
	);
}

export default RelatedProducts;
