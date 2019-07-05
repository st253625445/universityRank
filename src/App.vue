<template>
  <div id="app">
    <template v-if="isMobile === 0">
      <HeaderBox />
      <router-view />
      <FooterBox />
    </template>
    <template v-else>
      <!--这里是会被缓存的组件-->
      <keep-alive>
        <router-view v-if="this.$route.meta.keepAlive"></router-view>
      </keep-alive>
      <!--这里是不会被缓存的组件-->
      <router-view v-if="!this.$route.meta.keepAlive"></router-view>
    </template>
  </div>
</template>
<script>
import HeaderBox from "@/components/header";
import FooterBox from "@/components/footer";
export default {
  data() {
    return {
      isMobile: 0
    };
  },
  components: {
    HeaderBox,
    FooterBox
  },
  created() {
    this._isMobile();
  },
  methods: {
    _isMobile() {
      let flag = navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      // localStorage.setItem('isiphone',flag)
      localStorage.setItem("ismobile", flag ? 1 : 0);
      this.isMobile = flag ? 1 : 0;
      let _meta = this.$route.meta.type;
      if (
        (_meta === "pc" && flag === 1) ||
        (_meta === "mobile" && flag === 0) ||
        !_meta
      ) {
        flag
          ? this.$router.push({
              path: "mobile_index"
            })
          : this.$router.push({
              path: "index"
            });
      }
      return flag;
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
</style>
