import { API_BASE_URL } from "@env";

export const callApi = async (path, { method = "GET", body = null }) => {
  const baseUrl = API_BASE_URL;

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Error ${response.status}: ${error.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Request Error:", error.message);
    throw error;
  }
};
