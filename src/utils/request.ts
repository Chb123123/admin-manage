import axios, {
	AxiosInstance,
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from 'axios';

const service: AxiosInstance = axios.create({
	baseURL: 'http://127.0.0.1',
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem('webiteToken'),
	},
});

service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		if (localStorage.getItem('webiteToken') != null) {
			config.headers.Authorization = localStorage.getItem('webiteToken');
		}
		return config;
	},
	(error: AxiosError) => {
		console.log(error);
		return Promise.reject();
	}
);

service.interceptors.response.use(
	(response: AxiosResponse) => {
		if (response.data.status === 200) {
			return response;
		} else if (response.data.status === 2) {
			localStorage.removeItem('webiteToken');
		} else {
			Promise.reject();
		}
	},
	(error: AxiosError) => {
		console.log(error);
		return Promise.reject();
	}
);

export default service;
