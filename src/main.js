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
import BaiduMap from "vue-baidu-map";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: "W8G1VEhRLFbgcE2GUABhWZka"
});
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyAxhDDN-BJELdSTxptjRVQn6uY9x6l42f8",
    // v: "GOOGLE_MAPS_VERSION",
    libraries: "places"
  },
  loadCn: true
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
