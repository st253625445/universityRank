<template>
  <el-col class="toolItem imagesBox" :span="12">
    <div class="toolTitle">{{ $t("infoPage.imagesTitle") }}</div>
    <div class="toolItemCount unviImages">
      <el-carousel height="280px" indicator-position="none">
        <el-carousel-item v-for="(item, index) in srcList" :key="index">
          <el-image :src="item.url" fit="contain"> </el-image>
        </el-carousel-item>
      </el-carousel>
      <el-button type="primary" class="moreImagesButton" @click="showImagePop">
        {{ $t("infoPage.moreImage") }}
      </el-button>
    </div>
    <template v-if="imagePopShow">
      <ImagesPop @hidePop="hideImagePop"></ImagesPop>
    </template>
  </el-col>
</template>

<script>
import ImagesPop from "./imagesPop";
export default {
  name: "imagesBox",
  props: ["srcList"],
  data: function() {
    return {
      imagePopShow: false
    };
  },
  components: { ImagesPop },
  methods: {
    showImagePop() {
      this.imagePopShow = true;
    },
    hideImagePop() {
      this.imagePopShow = false;
    }
  }
};
</script>

<style lang="less">
.imagesBox {
  .toolItemCount {
    min-height: 340px !important;
  }
  .unviImages {
    padding: 20px 40px 40px;
  }
  .moreImagesButton {
    position: absolute;
    bottom: 10px;
    left: 50%;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    padding: 0 20px;
    background: #5167dc;
    transform: translate(-50%, 0);
    border: none;
  }
}
</style>
