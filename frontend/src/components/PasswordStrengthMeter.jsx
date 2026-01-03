import { ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function getStrength(password) {
	let score = 0;

	if (password.length >= 8) score++;
	if (/[A-Z]/.test(password)) score++;
	if (/[0-9]/.test(password)) score++;
	if (/[^A-Za-z0-9]/.test(password)) score++;

	return score;
}

function PasswordStrengthMeter({ password }) {
	const { t } = useTranslation();

	const strength = getStrength(password);

	const variants = ["danger", "danger", "warning", "info", "success"];

	const labels = [
		t("password.very_weak"),
		t("password.weak"),
		t("password.fair"),
		t("password.good"),
		t("password.strong"),
	];

	return password ? (
		<>
			<ProgressBar
				now={(strength / 4) * 100}
				variant={variants[strength]}
				className="mb-2"
			/>

			<small className="text-muted">{labels[strength]}</small>
		</>
	) : null;
}

export default PasswordStrengthMeter;
