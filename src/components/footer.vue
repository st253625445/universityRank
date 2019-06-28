<template>
  <footer>
    <div class="app-footer">
      {{ $t("message.footerText") }}
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="less">
footer {
  width: 100%;
  background: #5167dc;
  .app-footer {
    position: relative;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    line-height: 33px;
    color: #e8e8e8;
  }
}
</style>
