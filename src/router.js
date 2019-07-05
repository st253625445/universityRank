import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Info from "@/views/Info.vue";
import Mhome from "@/views/mobile/Home.vue";
import Minfo from "@/views/mobile/Info.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/index",
      name: "home",
      meta: { type: "pc" },
      component: Home
    },
    {
      path: "/info",
      name: "info",
      meta: { type: "pc" },
      component: Info
    },
    {
      path: "/mobile_index",
      name: "mobileHome",
      meta: { type: "mobile", keepAlive: true },
      component: Mhome
    },
    {
      path: "/mobile_info",
      name: "mobileInfo",
      meta: { type: "mobile" },
      component: Minfo
    }
  ]
});

router.beforeEach((to, from, next) => {
  var ismobile = localStorage.getItem("ismobile");
  // 电脑
  if (ismobile == 0) {
    console.log(to);
    if (to.path == "/" || to.meta.type == "mobile") {
      next("/index");
    } else {
      next();
    }
  }

  // 手机
  if (ismobile == 1) {
    if (to.path == "/" || to.meta.type == "pc") {
      next("/mobile_index");
    } else {
      next();
    }
  }
});
export default router;
