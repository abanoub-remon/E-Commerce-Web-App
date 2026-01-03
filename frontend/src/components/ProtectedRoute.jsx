import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useContext(AuthContext);
	const location = useLocation();
	const { t } = useTranslation();

	if (loading) {
		return (
			<div
				className="d-flex flex-column align-items-center justify-content-center py-5"
				style={{ minHeight: 220 }}
			>
				<Spinner animation="border" size="sm" className="mb-2" />
				<span className="text-muted small">{t("auth.checking")}</span>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
}

export default ProtectedRoute;
