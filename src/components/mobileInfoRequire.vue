<template>
  <div class="slideFadeBox">
    <div class="infoTopBox">
      <el-image class="img" :src="topInfoData.url"></el-image>
      <div class="univName">{{ topInfoData.univName }}</div>
      <div class="icons">
        <el-image
          v-for="(item, index) in topInfoData.iconData"
          :key="index"
          :src="item.url"
          fit="contain"
        />
      </div>
      <div class="rankText">
        {{ $t("infoPage.regionText") }}: {{ topInfoData.rankRegion }}
        {{ $t("infoPage.globalText") }}: {{ topInfoData.rankGlobal }}
      </div>
    </div>
    <div class="requireInfoBox">
      <ul class="requireBox">
        <li v-for="(item, key) in requireData" :key="key">
          <span class="infoLabel">{{ item.name }}</span>
          <span class="infoValue">{{ `${item.start}-${item.end}` }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: ["topInfoData", "requireData"],
  data() {
    return {};
  }
};
</script>
<style lang="less">
.requireInfoBox {
  width: 100%;
  height: calc(100% - 25.0667vw);
  padding-top: 2.1333vw;
  .requireBox {
    width: 100%;
    overflow: auto;
    background: #fff;
    color: #000;
    padding: 0 4vw;
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
        text-align: right;
        flex: 1;
      }
      &:last-child {
        border: none;
      }
    }
  }
}
</style>
