import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Alert, Spinner } from "react-bootstrap";
import api from "../api/axios";
import { useTranslation } from "react-i18next";

function ActivateAccount() {
	const { t } = useTranslation();
	const { token } = useParams();
	const [status, setStatus] = useState("loading");
	const [message, setMessage] = useState("");

	const hasCalled = useRef(false);

	useEffect(() => {
		if (hasCalled.current) return;
		hasCalled.current = true;

		api
			.get(`/users/activate/${token}/`)
			.then((res) => {
				setStatus("success");
				setMessage(res.data.message || t("activate.success_default"));
			})
			.catch((err) => {
				setStatus("error");
				setMessage(err.response?.data?.detail || t("activate.error_default"));
			});
	}, [token, t]);

	if (status === "loading") {
		return (
			<div className="text-center mt-5">
				<Spinner animation="border" />
				<p className="mt-2 text-muted">{t("activate.loading")}</p>
			</div>
		);
	}

	return (
		<div className="text-center mt-5">
			{status === "success" ? (
				<Alert variant="success">
					<strong>{t("activate.success_title")}</strong>
					<div className="mt-2">{message}</div>

					<div className="mt-3">
						<Link to="/login">{t("activate.go_login")}</Link>
					</div>
				</Alert>
			) : (
				<Alert variant="danger">
					<strong>{t("activate.error_title")}</strong>
					<div className="mt-2">{message}</div>

					<div className="mt-3">
						<Link to="/register">{t("activate.register_again")}</Link>
					</div>
				</Alert>
			)}
		</div>
	);
}

export default ActivateAccount;
