import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const subscribeRefresh = (cb: (success: boolean) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (success: boolean) => {
  refreshSubscribers.forEach((cb) => cb(success));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 🔒 Don't retry if it's already a refresh request — prevents loop
    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeRefresh((success) => {
            if (success) resolve(axiosInstance(originalRequest));
            else reject(error);
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post("/auth/refresh");
        onRefreshed(true);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        onRefreshed(false);
        // 🔒 Clear any stale cookies by letting the 401 propagate
        // The query will catch this and set status to "unauthenticated"
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;