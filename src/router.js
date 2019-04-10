import Vue from "vue";
import Router from "vue-router";
import Home from "@/views/Home.vue";
import Info from "@/views/Info.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/info",
      name: "info",
      component: Info
    }
  ]
});
