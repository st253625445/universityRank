<template>
  <el-row class="toolItem alumniBox">
    <div class="toolTitle">{{ $t("infoPage.alumniTitle") }}</div>
    <div class="toolItemCount">
      <ul class="alumniItems">
        <li
          class="alumniItemBox"
          v-for="(item, index) in alumniData"
          :key="index"
          @click="linkUrl(item.url)"
        >
          <div class="alumniImg">
            <el-image :src="item.imgurl"></el-image>
          </div>
          <p class="alumniName">{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </el-row>
</template>

<script>
export default {
  name: "alumniBox",
  props: ["alumniData"],
  data: function() {
    return {};
  },
  methods: {
    linkUrl(val) {
      if (val) {
        window.open(val, "_blank");
      }
    }
  }
};
</script>

<style lang="less">
.alumniBox {
  .toolItemCount {
    position: relative;
    min-height: 180px !important;
    overflow-x: scroll;
  }
  .alumniItems {
    width: auto;
    display: flex;
    flex-direction: row;
  }
  .alumniItemBox {
    width: 120px;
    text-align: center;
    cursor: pointer;
    & + .alumniItemBox {
      margin-left: 25px;
    }
  }
  .alumniImg {
    width: 120px;
    height: 120px;
  }
  .alumniName {
    margin-top: 15px;
    font-size: 12px;
    line-height: 18px;
    color: #101010;
  }
}
</style>
