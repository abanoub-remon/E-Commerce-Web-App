import React from "react";
import { Container } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import "../styles/app-theme.css";

const Layout = ({ children }) => {
	const { i18n, t } = useTranslation();

	React.useEffect(() => {
		const dir = i18n.language === "ar" ? "rtl" : "ltr";

		document.documentElement.setAttribute("dir", dir);
		document.documentElement.lang = i18n.language;

		document.body.setAttribute("dir", dir);
	}, [i18n.language]);

	return (
		<div className="app-wrapper">
			<a
				href="#main-content"
				className="visually-hidden-focusable"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					padding: "6px 10px",
					background: "#fff",
					zIndex: 1000,
				}}
			>
				{t("layout.skip_to_content")}
			</a>

			<AppNavbar />

			<main id="main-content" className="app-main">
				<Container fluid className="py-4">
					{children}
				</Container>
			</main>

			<Footer />
		</div>
	);
};

export default Layout;
