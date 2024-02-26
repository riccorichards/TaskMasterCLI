import axios, { Method } from "axios";
import { ApiResponse } from "@/types/type";

export async function makeRequest<T>(
  url: string,
  method: Method = "GET",
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const response = await axios({ url, method, data, responseType: "json" });
    return { status: "success", data: response.data };
  } catch (error) {
    let message = "An unexpected error occurred";
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message || message;
    }
    return { status: "error", message };
  }
}
