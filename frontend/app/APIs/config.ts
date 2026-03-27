import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  // timeout:6,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? error.status;
      const requestedApi = error.config as any;
      const isRefreshCall = requestedApi?.url?.includes("/userAuth/refresh-token");

      if (status === 401 && requestedApi && !isRefreshCall && !requestedApi._retry) {
        requestedApi._retry = true;
        try {
          await axiosInstance.get("/userAuth/refresh-token");
          return axiosInstance(requestedApi);
        } catch (refreshError) {
          if (typeof window !== "undefined") {
            window.location.href = `/login?redirect=${encodeURIComponent(
              window.location.pathname
            )}`;
          }
          return Promise.reject(refreshError);
        }
      }
      if (status === 403) {
        if (typeof window !== "undefined") {
          window.location.href = `/login?redirect=${encodeURIComponent(
            window.location.pathname
          )}`;
        }
      }
    }
    return Promise.reject(error);
  }
);
