import axios from "axios";

let BASE_URL = "";
if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:3000";
} else {
  BASE_URL = "https://ec2-54-175-236-193.compute-1.amazonaws.com:3001";
}

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-type": "application/json" },
  withCredentials: true,
});
