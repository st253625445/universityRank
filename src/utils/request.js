import axios from "axios";
import { Message } from "element-ui";

// 创建axios实例
const service = axios.create({
  timeout: 45000 // 请求超时时间
});

service.defaults.baseURL = "/api";

// request拦截器
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers["authToken"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config;
  },
  error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code === 200) {
      return response.data;
    } else {
      Message({
        message: res.msg,
        type: "error",
        duration: 5 * 1000
      });
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.msg,
      type: "error",
      duration: 5 * 1000
    });
  }
);

export default service;
