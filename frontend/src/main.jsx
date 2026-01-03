import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./i18n"

ReactDOM.createRoot(document.getElementById("root")).render(
		<AuthProvider>
			<App />
		</AuthProvider>
);
