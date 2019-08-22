<template>
  <div class="titleBox">
    <div class="univTitleBox">
      <el-image class="img" :src="topInfo.image_sch"></el-image>
      <div class="topInfoBox">
        <p class="title">{{ topInfo.name }}</p>
        <div class="icon">
          <div
            class="iconItem"
            v-for="(item, index) in topInfo.iconData"
            :key="index"
          >
            <div class="tooltip">{{ item.value }}</div>
            <el-image :src="item.url" fit="contain" />
          </div>
          <div class="urlItem">
            <el-image
              v-if="topInfo.urls && topInfo.urls.wiki_url"
              :src="require('../../assets/img/icon/link_wiki.png')"
              fit="contain"
            ></el-image>
            <el-image
              v-else
              :src="require('../../assets/img/icon/link_wiki_no.png')"
              fit="contain"
            ></el-image>
            <a :href="topInfo.urls && topInfo.urls.wiki_url" target="_balnk">
              {{ $t("infoPage.wikiLink") }}
            </a>
          </div>
          <div class="urlItem">
            <el-image
              v-if="topInfo.urls && topInfo.urls.baidu_url"
              :src="require('../../assets/img/icon/link_baidu.png')"
              fit="contain"
            ></el-image>
            <el-image
              v-else
              :src="require('../../assets/img/icon/link_baidu_no.png')"
              fit="contain"
            ></el-image>
            <a :href="topInfo.urls && topInfo.urls.baidu_url" target="_balnk">
              {{ $t("infoPage.baiduLink") }}
            </a>
          </div>
          <div class="urlItem">
            <el-image
              v-if="topInfo.urls && topInfo.urls.sch_url"
              :src="require('../../assets/img/icon/link_official.png')"
              fit="contain"
            ></el-image>
            <el-image
              v-else
              :src="require('../../assets/img/icon/link_official_no.png')"
              fit="contain"
            ></el-image>
            <a :href="topInfo.urls && topInfo.urls.sch_url" target="_balnk">
              {{ $t("infoPage.officialLink") }}
            </a>
          </div>
        </div>
      </div>
      <div class="rankText">
        <div class="rankItem">
          <span class="value">{{ topInfo.rankRegion }}</span>
          <span class="label">{{ $t("infoPage.regionText2") }}</span>
        </div>
        <div class="rankItem">
          <span class="value">{{ topInfo.rankGlobal }}</span>
          <span class="label">{{ $t("infoPage.globalText2") }}</span>
        </div>
      </div>
    </div>
    <div
      class="univContent"
      @mouseenter="abstractShowFn(true)"
      @mouseleave="abstractShowFn(false)"
    >
      <p class="content" ref="abstract">
        {{ topInfo.abstract }}
      </p>
      <p class="contentShow" v-if="abstractShow" :style="abstractShowStyle">
        {{ topInfo.abstract }}
      </p>
      <span class="more" v-if="hasMoreAbstract && !abstractShow">...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "topInfoBox",
  props: ["topInfo"],
  data: function() {
    return {
      hasMoreAbstract: false, // 简介是否有隐藏部分
      abstractShow: false, // 简介是否展开
      abstractShowStyle: {} // 简介展开的样式
    };
  },
  watch: {
    topInfo(val) {
      console.log(val);

      let _DOM = this.$refs.abstract;
      let _scrollH = _DOM.scrollHeight;
      let _clientH = _DOM.clientHeight;
      if (_clientH < _scrollH) {
        this.hasMoreAbstract = true;
      }
    }
  },
  methods: {
    // 展开隐藏的简介内容
    abstractShowFn(data) {
      if (this.hasMoreAbstract) {
        if (data) {
          let _top = this.$refs.abstract.offsetTop;
          this.abstractShowStyle = {
            top: _top + "px"
          };
        } else {
          this.abstractShowStyle = {
            top: 0
          };
        }
        this.abstractShow = data;
      }
    }
  }
};
</script>

<style lang="less">
.titleBox {
  position: relative;
  width: 100%;
  max-height: 330px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 18px;
  color: #101010;
  margin-bottom: 50px;
  z-index: 50;
  .univTitleBox {
    display: flex;
    width: 100%;
    height: 160px;
    overflow: hidden;
    padding: 20px 0;
    .img {
      width: 120px;
      height: 120px;
      margin-right: 35px;
    }
    .topInfoBox {
      position: relative;
      flex: 1;
      height: 120px;
    }
    .title {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 28px;
      line-height: 40px;
    }
    .icon {
      margin-top: 87px;
    }
    .iconItem {
      height: 30px;
      float: left;
      .el-image {
        width: 32px;
        height: 32px;
        margin-right: 13px;
      }
      .tooltip {
        display: none;
        position: absolute;
        bottom: 35px;
        left: 0;
        background: #e6eaff;
        padding: 5px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      &:hover {
        .tooltip {
          display: block;
        }
      }
    }
    .urlItem {
      display: flex;
      float: right;
      height: 32px;
      align-items: center;
      margin-right: 10px;
      .el-image {
        width: 20px;
        height: 20px;
        margin-right: 5px;
      }
      a {
        font-size: 14px;
        color: #5066dc;
        line-height: 20px;
      }
    }
    .rankText {
      display: flex;
      flex-direction: row-reverse;
      .rankItem {
        display: flex;
        flex-direction: column;
        margin-left: 60px;
        justify-content: center;
        .value {
          font-size: 36px;
          line-height: 54px;
          color: #5066dc;
          padding: 0 15px;
          border-bottom: 1px solid #5066dc;
        }
        .label {
          color: #888888;
          font-size: 20px;
          line-height: 40px;
          text-align: center;
        }
        &:last-child {
          margin-left: 100px;
        }
      }
    }
  }
  .univContent {
    position: relative;
    padding-top: 15px;
    .content {
      text-align: justify;
      max-height: 160px;
      overflow: hidden;
    }
    .contentShow {
      position: absolute;
      height: auto;
      text-align: justify;
      background: #e6eaff;
      padding: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }
    .more {
      position: absolute;
      bottom: -30px;
      right: 0;
      padding: 10px 15px;
    }
  }
}
</style>
