<template>
  <div id="app">
    <HeaderBox />
    <router-view />
  </div>
</template>
<script>
import HeaderBox from "@/components/header";
export default {
  data() {
    return {};
  },
  components: {
    HeaderBox
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
  min-width: 1440px;
}
</style>
