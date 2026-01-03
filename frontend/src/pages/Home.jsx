import { useEffect, useState } from "react";
import { Container, Row, Col, Carousel, Form, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { useTranslation } from "react-i18next";

const getFirstImage = (product) => {
	if (product?.images?.length && product.images[0].image) {
		return product.images[0].image;
	}
	return "https://via.placeholder.com/1200x400?text=No+Image";
};

function Home() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [featured, setFeatured] = useState([]);
	const [latest, setLatest] = useState([]);
	const [bestSellers, setBestSellers] = useState([]);
	const [categories, setCategories] = useState([]);
	const [topSellers, setTopSellers] = useState([]);

	const [search, setSearch] = useState("");
	const [results, setResults] = useState([]);
	const [loadingSearch, setLoadingSearch] = useState(false);

	useEffect(() => {
		api.get("/products/featured/").then((res) => setFeatured(res.data));
		api.get("/products/latest/").then((res) => setLatest(res.data));
		api.get("/products/best-sellers/").then((res) => setBestSellers(res.data));
		api.get("/categories/featured/").then((res) => setCategories(res.data));
		api.get("/sellers/top/").then((res) => setTopSellers(res.data));
	}, []);

	useEffect(() => {
		if (search.trim().length < 2) {
			setResults([]);
			return;
		}

		const timer = setTimeout(() => {
			setLoadingSearch(true);
			api
				.get(`/products/?search=${search}`)
				.then((res) => setResults(res.data.results || res.data))
				.finally(() => setLoadingSearch(false));
		}, 400);

		return () => clearTimeout(timer);
	}, [search]);

	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (search.trim()) navigate(`/products?search=${search}`);
	};

	return (
		<>
			<div
				className="w-100 mb-5"
				style={{
					height: 420,
					background:
						"linear-gradient(120deg, #f9fafb 0%, #e5edff 50%, #f5f3ff 100%)",
				}}
			>
				<Container className="h-100 d-flex flex-column justify-content-center">
					<Row className="align-items-center">
						<Col md={7} className="mb-4 mb-md-0">
							<h2 className="fw-bold mb-2">{t("home.hero_title")}</h2>

							<p className="text-muted mb-3">{t("home.hero_sub")}</p>

							<Form onSubmit={handleSearchSubmit} className="position-relative">
								<Form.Control
									placeholder={t("home.search_placeholder")}
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									autoComplete="off"
									className="shadow-sm"
								/>

								{loadingSearch && (
									<div className="position-absolute end-0 top-50 translate-middle-y me-3 small text-muted">
										{t("home.searching")}
									</div>
								)}

								{results.length > 0 && (
									<div
										className="position-absolute w-100 bg-white border rounded shadow mt-1"
										style={{ zIndex: 1000 }}
									>
										{results.slice(0, 6).map((p) => (
											<Link
												key={p.id}
												to={`/products/${p.id}`}
												className="d-flex align-items-center p-2 text-decoration-none text-dark border-bottom"
												onClick={() => setResults([])}
											>
												<img
													src={p.images?.[0]?.image || "https://via.placeholder.com/50"}
													alt={p.title}
													style={{
														width: 48,
														height: 48,
														objectFit: "cover",
														borderRadius: 6,
														marginRight: 10,
													}}
												/>
												<div>
													<strong className="small">{p.title}</strong>
													<div className="text-muted small">${p.final_price}</div>
												</div>
											</Link>
										))}

										<div className="text-center p-2">
											<Link
												to={`/products?search=${search}`}
												className="text-decoration-none small"
											>
												{t("home.show_all")} →
											</Link>
										</div>
									</div>
								)}
							</Form>
						</Col>

						<Col md={5} className="d-none d-md-block">
							<img
								src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=70"
								alt="phones"
								className="img-fluid rounded-4 shadow-sm"
							/>
						</Col>
					</Row>
				</Container>
			</div>

			<Container>

				{featured.length > 0 && (
					<Card className="mb-5 border-0 shadow-sm">
						<Card.Body>
							<h4 className="mb-3 fw-semibold">{t("home.featured")}</h4>

							<Carousel>
								{featured.map((product) => (
									<Carousel.Item key={product.id}>
										<img
											className="d-block w-100 rounded"
											src={getFirstImage(product)}
											alt={product.title}
											style={{ height: 380, objectFit: "cover" }}
										/>
										<Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
											<h5>{product.title}</h5>
											<p>${product.final_price}</p>
											<Link
												to={`/products/${product.id}`}
												className="btn btn-light btn-sm"
											>
												{t("home.view_product")}
											</Link>
										</Carousel.Caption>
									</Carousel.Item>
								))}
							</Carousel>
						</Card.Body>
					</Card>
				)}


				<h4 className="mb-3 fw-semibold">{t("home.popular_categories")}</h4>

				<Row className="mb-5">
					{categories.map((cat) => (
						<Col key={cat.id} md={2} sm={4} xs={6} className="mb-3">
							<Link
								to={`/products?category=${cat.id}`}
								className="text-decoration-none"
							>
								<div className="rounded shadow-sm p-2 bg-white h-100 text-center hover-shadow">
									<img
										src={cat.image || "https://via.placeholder.com/200x150"}
										alt={cat.name}
										style={{
											width: "100%",
											height: 110,
											objectFit: "cover",
											borderRadius: 10,
										}}
									/>
									<p className="mt-2 fw-bold small text-dark">{cat.name}</p>
								</div>
							</Link>
						</Col>
					))}
				</Row>


				<h4 className="mb-3 fw-semibold">{t("home.latest")}</h4>

				<Row className="mb-5">
					{latest.map((product) => (
						<Col key={product.id} md={3} sm={6} className="mb-4">
							<div className="h-100 hover-shadow rounded">
								<ProductCard product={product} />
							</div>
						</Col>
					))}
				</Row>

				<h4 className="mb-3 fw-semibold">{t("home.best_sellers")}</h4>

				<Row className="mb-4">
					{bestSellers.map((product) => (
						<Col key={product.id} md={3} sm={6} className="mb-4">
							<div className="h-100 hover-shadow rounded">
								<ProductCard product={product} />
							</div>
						</Col>
					))}
				</Row>
			</Container>

			<style>{`
        .hover-shadow:hover {
          box-shadow: 0 12px 28px rgba(0,0,0,.08);
          transform: translateY(-3px);
          transition: all .18s ease;
        }
      `}</style>
		</>
	);
}

export default Home;
