import axios from "axios"
//in production there is no local host
//const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";
const api = axios.create({
  baseURL: "/api",
  //Sends cookie with every request 
  withCredentials: true
});

//
//api.interceptors.request.use((req) => {
//const token = localstorage.getitem('token');
//console.log(token);
//if (token) {
//req.headers.authorization = `bearer ${token}`
//}
//return req;
//});

export default api
