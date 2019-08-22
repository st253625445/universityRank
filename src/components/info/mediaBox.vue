<template>
  <el-col :span="8" class="toolItem mediaBox">
    <div class="toolTitle">{{ $t("infoPage.mediaTitle") }}</div>
    <div class="toolItemCount">
      <div class="mediaItemBox">
        <el-image
          v-if="mediaData.facebook_url"
          :src="require('../../assets/img/icon/media_icon1.png')"
          fit="contain"
        ></el-image>
        <el-image
          v-else
          :src="require('../../assets/img/icon/media_icon1_no.png')"
          fit="contain"
        ></el-image>
        <span class="mediaLabel">Facebook</span>
      </div>
      <div class="mediaItemBox">
        <el-image
          v-if="mediaData.twitter_url"
          :src="require('../../assets/img/icon/media_icon2.png')"
          fit="contain"
        ></el-image>
        <el-image
          v-else
          :src="require('../../assets/img/icon/media_icon2_no.png')"
          fit="contain"
        ></el-image>
        <span class="mediaLabel">Twitter</span>
      </div>
      <div class="mediaItemBox">
        <el-image
          v-if="mediaData.weibo_url"
          :src="require('../../assets/img/icon/media_icon3.png')"
          fit="contain"
        ></el-image>
        <el-image
          v-else
          :src="require('../../assets/img/icon/media_icon3_no.png')"
          fit="contain"
        ></el-image>
        <span class="mediaLabel">新浪微博</span>
      </div>
      <div class="mediaItemBox">
        <el-image
          v-if="mediaData.linkedin_url"
          :src="require('../../assets/img/icon/media_icon4.png')"
          fit="contain"
        ></el-image>
        <el-image
          v-else
          :src="require('../../assets/img/icon/media_icon4_no.png')"
          fit="contain"
        ></el-image>
        <span class="mediaLabel">LinkedIn</span>
      </div>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "mediaBox",
  props: ["mediaData"],
  data: function() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less">
.mediaBox {
  .toolItemCount {
    min-height: 220px !important;
  }
  .mediaItemBox {
    display: flex;
    cursor: pointer;
    .el-image {
      width: 32px !important;
      height: 32px !important;
    }
    .mediaLabel {
      font-size: 14px;
      line-height: 32px;
      margin-left: 20px;
    }
    & + .mediaItemBox {
      margin-top: 14px;
    }
  }
}
</style>
