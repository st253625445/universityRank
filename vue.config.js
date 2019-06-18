module.exports = {
  devServer: {
    // 设置代理
    proxy: {
      "/api": {
        // 代理地址
        target: "http://192.168.1.221:8095/api", // 需要代理的地址
        changeOrigin: true, // 是否跨域
        secure: false,
        pathRewrite: {
          "^/api": "/" // 本身的接口地址没有 '/api' 这种通用前缀，所以要rewrite，如果本身有则去掉
        }
      }
    }
  }
};
