<template>
  <div id="app">
    <HeaderBox />
    <router-view />
    <FooterBox />
  </div>
</template>
<script>
import HeaderBox from "@/components/header";
import FooterBox from "@/components/footer";
export default {
  data() {
    return {};
  },
  components: {
    HeaderBox,
    FooterBox
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
