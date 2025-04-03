import axios from "axios";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getDeviceInfo = async () => {
  try {
    const deviceId =
      window.navigator.userAgent +
      Date.now() +
      Math.random().toString(36).substring(2);
    return {
      deviceId: await crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(deviceId))
        .then((buffer) =>
          Array.from(new Uint8Array(buffer))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("")
        ),
      deviceBrand: "Web Browser",
      platform: window.navigator.platform,
      userAgent: window.navigator.userAgent,
      language: window.navigator.language,
      online: window.navigator.onLine,
    };
  } catch (error) {
    console.error("Error getting device info:", error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return false;

  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = tokenData.exp * 1000;
    const currentTime = Date.now();

    // If token is within 1 hour of expiring, try to refresh it
    if (expiryTime - currentTime < 3600000) {
      refreshToken();
    }

    return currentTime < expiryTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const refreshToken = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (!token) return false;

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.token) {
      localStorage.setItem("jwtToken", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

export const authenticateWithBackend = async (credential, retryCount = 0) => {
  try {
    const deviceInfo = await getDeviceInfo();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/google`,
      {
        credential,
        deviceInfo,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.data.success || !response.data.isAuthenticated) {
      throw new Error(response.data.message || "Authentication failed");
    }

    localStorage.setItem("jwtToken", response.data.token);
    localStorage.setItem("userData", JSON.stringify(response.data.user));
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;

    return response.data;
  } catch (error) {
    console.error("Authentication error:", error);

    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error(error.response.data.message || "Authentication failed");
    }

    // Retry logic for network errors
    if (retryCount < MAX_RETRIES) {
      await sleep(RETRY_DELAY * Math.pow(2, retryCount));
      return authenticateWithBackend(credential, retryCount + 1);
    }

    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userData");
    delete axios.defaults.headers.common["Authorization"];
    window.dispatchEvent(new Event("authChange"));
  }
};

// Set up axios interceptors
axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh the token
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry the original request
        const token = localStorage.getItem("jwtToken");
        error.config.headers.Authorization = `Bearer ${token}`;
        return axios.request(error.config);
      }

      // If refresh failed, logout
      await logout();
    }
    return Promise.reject(error);
  }
);
