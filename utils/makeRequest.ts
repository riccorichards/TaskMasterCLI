import axios, { AxiosError, Method } from "axios";

export const makeRequest = async (
  url: string,
  method: Method = "GET",
  data?: any
) => {
  try {
    const response = await axios({ url, method, data });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error("Error:" + error.message);
    }
    console.log(error);
  }
};
