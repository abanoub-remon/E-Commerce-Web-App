import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
	const tokens = localStorage.getItem("authTokens");

	if (tokens) {
		const { access } = JSON.parse(tokens);
		config.headers.Authorization = `Bearer ${access}`;
	}

	return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (
			error.response?.status === 401 &&
			originalRequest.url.includes("/token/refresh/")
		) {
			logoutAndRedirect();
			return Promise.reject(error);
		}

		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes("/users/login/")
		) {
			originalRequest._retry = true;

			try {
				const tokens = JSON.parse(localStorage.getItem("authTokens"));

				if (!tokens?.refresh) {
					logoutAndRedirect();
					return Promise.reject(error);
				}

				const res = await axios.post("http://localhost:8000/api/token/refresh/", {
					refresh: tokens.refresh,
				});

				const newTokens = {
					access: res.data.access,
					refresh: res.data.refresh || tokens.refresh,
				};

				localStorage.setItem("authTokens", JSON.stringify(newTokens));

				originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;

				return api(originalRequest);
			} catch (err) {
				logoutAndRedirect();
				return Promise.reject(err);
			}
		}

		return Promise.reject(error);
	}
);

function logoutAndRedirect() {
	localStorage.removeItem("authTokens");

	const currentPath = window.location.pathname;
	localStorage.setItem("redirectAfterLogin", currentPath);

	window.location.href = "/login";
}

export default api;
