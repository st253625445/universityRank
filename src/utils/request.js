import axios from "axios";
import { Message } from "element-ui";

// 创建axios实例
const service = axios.create({
  timeout: 45000 // 请求超时时间
});
//  阻止频繁请求方法
let CancelToken = axios.CancelToken;
let pending = []; // 声明一个数组存储每个请求的取消函数跟标识
let removePending = config => {
  for (let p in pending) {
    if (pending[p].u.split("?")[0] === config.url.split("?")[0]) {
      pending[p].f(); // 执行取消请求
      pending.splice(p, 1); // 数组中删除该请求
    }
  }
};

service.defaults.baseURL = "/api";

// request拦截器
service.interceptors.request.use(
  config => {
    removePending(config); //执行频繁请求时取消操作
    config.cancelToken = new CancelToken(c => {
      pending.push({ u: config.url, f: c });
    });
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
      console.log(res.msg);
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export default service;
