<template>
  <div class="slideFadeBox">
    <div class="baseInfoBox">
      <ul class="baseInfo">
        <li v-for="(item, key) in baseInfoData" :key="key">
          <span class="infoLabel">{{ key }}</span>
          <span class="infoValue">{{ item }}</span>
        </li>
      </ul>
    </div>
    <el-backtop target=".baseInfo"></el-backtop>
  </div>
</template>
<script>
export default {
  props: ["baseInfoData"],
  data() {
    return {};
  }
};
</script>
<style lang="less">
.baseInfoBox {
  width: 100%;
  height: 100%;
  padding-top: 2.1333vw;
  .baseInfo {
    width: 100%;
    height: 100%;
    overflow: scroll;
    background: #fff;
    color: #000;
    padding: 0 4vw;
    padding-bottom: 16vw;
    li {
      display: flex;
      min-height: 10.6667vw;
      padding: 3.2vw 0;
      line-height: 4.2667vw;
      border-bottom: 0.2667vw solid #bbbbbb;
      .infoLabel {
        width: 38.6667vw;
      }
      .infoValue {
        flex: 1;
      }
      &:last-child {
        border: none;
      }
    }
  }
}
</style>
