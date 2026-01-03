import { useEffect, useState } from "react";
import { Row, Col, Spinner, Alert, Pagination, Card } from "react-bootstrap";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { useTranslation } from "react-i18next";

function Products() {
	const { t } = useTranslation();

	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const [filters, setFilters] = useState({
		category: "",
		brand: "",
		tag: "",
		search: "",
	});

	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);

	useEffect(() => {
		fetchProducts();
	}, [filters, page]);

	const fetchProducts = async () => {
		setLoading(true);
		setError("");

		try {
			const res = await api.get("/products/", {
				params: { ...filters, page },
			});

			setProducts(res.data.results);
			setCount(res.data.count);
		} catch {
			setError(t("products.load_failed"));
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setPage(1);
	}, [filters]);

	const totalPages = Math.ceil(count / 9);

	return (
		<Row className="gy-4">
			<Col md={3}>
				<Card className="shadow-sm" style={{ top: 20 }}>
					<Card.Body>
						<ProductFilters filters={filters} setFilters={setFilters} />
					</Card.Body>
				</Card>
			</Col>

			<Col md={9}>
				{loading && (
					<div className="text-center py-5">
						<Spinner animation="border" />
					</div>
				)}

				{error && <Alert variant="danger">{error}</Alert>}

				{!loading && !error && products.length === 0 && (
					<Alert variant="light" className="text-center shadow-sm">
						{t("products.no_results")}
					</Alert>
				)}

				<Row>
					{products.map((product) => (
						<Col md={4} sm={6} key={product.id} className="mb-4">
							<div className="hover-shadow h-100 rounded mt-3">
								<ProductCard product={product} />
							</div>
						</Col>
					))}
				</Row>

				{totalPages > 1 && (
					<Pagination className="justify-content-center mt-4">
						<Pagination.Prev
							disabled={page === 1}
							onClick={() => setPage(page - 1)}
						/>

						{[...Array(totalPages)].map((_, idx) => (
							<Pagination.Item
								key={idx}
								active={page === idx + 1}
								onClick={() => setPage(idx + 1)}
							>
								{idx + 1}
							</Pagination.Item>
						))}

						<Pagination.Next
							disabled={page === totalPages}
							onClick={() => setPage(page + 1)}
						/>
					</Pagination>
				)}
			</Col>

			<style>{`
        .hover-shadow {
          transition: all .18s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 12px 28px rgba(0,0,0,.08);
          transform: translateY(-3px);
        }
      `}</style>
		</Row>
	);
}

export default Products;
