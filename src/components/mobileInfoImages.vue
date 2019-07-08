<template>
  <div class="slideFadeBox">
    <div class="infoTopBox">
      <el-image class="img" :src="topInfoData.url"></el-image>
      <div class="univName">{{ topInfoData.univName }}</div>
      <div class="rankText">
        {{ $t("infoPage.regionText") }}: {{ topInfoData.rankRegion }}
        {{ $t("infoPage.globalText") }}: {{ topInfoData.rankGlobal }}
      </div>
    </div>
    <div class="imagesInfoBox" v-loading="imagesLoading">
      <div class="imagesList" ref="imagesList">
        <div
          class="imageItem"
          v-for="(item, index) in lowUrls"
          @click="showPopFn(item)"
          :style="styles[index]"
          :key="index"
        >
          <el-image class="img" :src="item" lazy></el-image>
        </div>
      </div>
    </div>
    <van-image-preview
      v-model="showPop"
      :loop="false"
      :images="urls"
      :startPosition="indexPop"
      @change="onChange"
    >
      <template v-slot:indexPop> </template>
    </van-image-preview>
    <el-backtop target=".imagesInfoBox"></el-backtop>
  </div>
</template>
<script>
import Vue from "vue";
import { ImagePreview } from "vant";
Vue.use(ImagePreview);

export default {
  props: ["imagesLoading", "topInfoData", "imagesData"],
  data() {
    return {
      showPop: false,
      indexPop: 0,
      lowUrls: [],
      urls: [],
      styles: []
    };
  },
  watch: {
    imagesData(val) {
      if (Object.keys(val)) {
        this.setMasonry(val);
      }
    }
  },
  methods: {
    setMasonry(data) {
      let _leftH = 0;
      let _rightH = 0;
      this.lowUrls = [];
      this.urls = [];
      this.styles = [];
      let _lowImages = data.w200 || [];
      let _images = data.w500 || [];
      _lowImages.forEach((item, index) => {
        this.lowUrls.push(item.url);
        this.urls.push(_images[index].url);
        let _h = item.height;
        let _w = item.width;
        let _b = _h / _w;
        if (_leftH > _rightH) {
          this.styles.push({
            top: `${_rightH}vw`,
            right: 0,
            height: `${_b * 44}vw`
          });
          _rightH += _b * 44 + 2;
        } else {
          this.styles.push({
            top: `${_leftH}vw`,
            left: 0,
            height: `${_b * 44}vw`
          });
          _leftH += _b * 44 + 2;
        }
      });
      this.$refs.imagesList.style.height =
        _rightH > _leftH ? `${_rightH}vw` : `${_leftH}vw`;
    },
    onChange(index) {
      this.indexPop = index;
    },
    showPopFn(data) {
      let _index = this.lowUrls.indexOf(data);
      this.showPop = true;
      this.indexPop = _index;
    }
  }
};
</script>
<style lang="less">
.imagesInfoBox {
  // display: flex;
  width: 100%;
  height: calc(100% - 25.0667vw);
  padding: 4vw;
  padding-top: 2.1333vw;
  overflow: scroll;
  .imagesList {
    position: relative;
    width: 100%;
  }
  .imageItem {
    position: absolute;
    width: 44vw;
    margin-bottom: 2vw;
    background: #e8e8e8;
  }
}
</style>
