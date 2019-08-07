import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "normalize.css/normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "vant/lib/index.css";
import "@/assets/less/index.less"; // global css
import i18n from "./utils/i18n";

Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
