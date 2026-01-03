import {
	Navbar,
	Nav,
	Container,
	Image,
	Dropdown,
	Badge,
	Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";

function AppNavbar() {
	const { t } = useTranslation();
	const { isAuthenticated, user, logout, cartCount, wishlistIds } =
		useContext(AuthContext);

	const changeLanguage = (lang) => {
		i18n.changeLanguage(lang);
		localStorage.setItem("lang", lang);
	};

	const toggleLanguage = () => {
		const next = i18n.language === "ar" ? "en" : "ar";
		changeLanguage(next);
	};

	const langLabel = i18n.language === "ar" ? "E" : "ع";

	return (
		<Navbar
			bg="light"
			variant="light"
			expand="lg"
			className="shadow-sm border-bottom"
		>
			<Container>
				<div className="position-relative d-flex align-items-center">
					<Navbar.Brand
						as={Link}
						to="/"
						className="fw-semibold text-primary"
						style={{ fontSize: 25 }}
					>
						<span style={{ fontSize: 35 }}>T</span>ECH
						<span style={{ fontSize: 33 }}>M</span>ART
					</Navbar.Brand>

					<div
						className="position-absolute d-flex gap-1"
						style={{ top: -8, right: -12 }}
					>
						{user?.is_seller && (
							<Badge bg="info" pill className="shadow-sm">
								{t("nav.seller")}
							</Badge>
						)}

						{user?.is_staff && (
							<Badge bg="info" pill className="shadow-sm">
								{t("nav.admin")}
							</Badge>
						)}
					</div>
				</div>

				<div className="d-flex align-items-center gap-3 order-lg-2 ms-auto">
					{user && (
						<Nav.Link
							as={Link}
							to="/wishlist"
							className="position-relative d-flex align-items-center"
						>
							<FaHeart size={18} />
							{wishlistIds && wishlistIds.size > 0 && (
								<Badge
									bg="danger"
									pill
									className="position-absolute top-0 start-100 translate-middle"
								>
									{wishlistIds.size}
								</Badge>
							)}
						</Nav.Link>
					)}

					<Nav.Link as={Link} to="/cart" className="position-relative">
						<FaShoppingCart size={20} />
						{cartCount > 0 && (
							<Badge
								bg="danger"
								pill
								className="position-absolute top-0 start-100 translate-middle"
							>
								{cartCount}
							</Badge>
						)}
					</Nav.Link>

					<Button
						size="sm"
						variant="outline-secondary"
						onClick={toggleLanguage}
						className="fw-bold"
						style={{ width: 36, height: 30, padding: 0 }}
					>
						{langLabel}
					</Button>

					<Navbar.Toggle />
				</div>

				<Navbar.Collapse className="order-lg-1 mt-2 mt-lg-0">
					<Nav className="me-auto align-items-lg-center">
						<Nav.Link as={Link} to="/products">
							{t("nav.products")}
						</Nav.Link>

						{user?.is_seller && (
							<>
								<Nav.Link as={Link} to="/seller/dashboard">
									{t("nav.seller_dashboard")}
								</Nav.Link>
								<Nav.Link as={Link} to="/seller/products/add">
									{t("nav.add_product")}
								</Nav.Link>
							</>
						)}
					</Nav>

					<Nav className="ms-auto align-items-center gap-2">
						{!isAuthenticated ? (
							<>
								<Nav.Link as={Link} to="/login">
									{t("nav.login")}
								</Nav.Link>
								<Nav.Link as={Link} to="/register">
									{t("nav.register")}
								</Nav.Link>
							</>
						) : (
							<Dropdown align="end">
								<Dropdown.Toggle
									as="div"
									className="d-flex align-items-center gap-1 me-3"
									style={{ cursor: "pointer" }}
								>
									{user?.profile_image ? (
										<Image
											src={user.profile_image}
											roundedCircle
											width={32}
											height={32}
										/>
									) : (
										<div
											className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
											style={{ width: 32, height: 32, fontSize: 14 }}
										>
											{user?.first_name?.charAt(0).toUpperCase()}
										</div>
									)}

									<span className="fw-medium">{user?.first_name}</span>
								</Dropdown.Toggle>

								<Dropdown.Menu>
									{user?.is_staff && (
										<>
											<Dropdown.Item as={Link} to="/admin/dashboard">
												{t("nav.admin_dashboard")}
											</Dropdown.Item>
											<Dropdown.Item as={Link} to="/admin/tags">
												{t("nav.manage_tags")}
											</Dropdown.Item>
											<Dropdown.Item as={Link} to="/admin/categories">
												{t("nav.manage_categories")}
											</Dropdown.Item>
											<Dropdown.Item as={Link} to="/admin/users">
												{t("nav.manage_users")}
											</Dropdown.Item>
											<Dropdown.Item as={Link} to="/admin/products">
												{t("nav.manage_products")}
											</Dropdown.Item>
											<Dropdown.Item as={Link} to="/admin/orders">
												{t("nav.manage_orders")}
											</Dropdown.Item>
										</>
									)}

									{user?.is_seller && (
										<Dropdown.Item as={Link} to="/seller/orders">
											{t("nav.seller_orders")}
										</Dropdown.Item>
									)}

									<Dropdown.Item as={Link} to="/orders">
										{t("nav.my_orders")}
									</Dropdown.Item>

									<Dropdown.Item as={Link} to="/profile">
										{t("nav.profile")}
									</Dropdown.Item>

									<Dropdown.Divider />

									<Dropdown.Item onClick={logout}>{t("nav.logout")}</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default AppNavbar;
