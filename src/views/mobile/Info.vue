<template>
  <div class="mobileInfoPage" v-loading="infoPageLoading">
    <div class="infoHeader">
      <i class="el-icon-arrow-left backIcon" @click="backHomePage"></i>
      <div class="univName">{{ topInfoData.univName }}</div>
    </div>
    <div class="infoTopBox">
      <img :src="topInfoData.url" class="img" alt="" srcset="" />
      <div class="univName">{{ topInfoData.univName }}</div>
      <div class="rankText">
        {{ $t("infoPage.regionText") }}: {{ topInfoData.rankRegion }}
        {{ $t("infoPage.globalText") }}: {{ topInfoData.rankGlobal }}
      </div>
    </div>
    <div class="abstractBox" :class="{ open: abstractOpen }">
      <i class="hr"></i>
      <p class="abstract" ref="abstractBox">{{ abstract }}</p>
      <div class="openIcon" @click="changeAbstractBox" v-if="hasAbstractOpen">
        <i class="el-icon-d-caret"></i>
      </div>
    </div>
    <div class="moreInfoBox">
      <div
        class="moreInfoItem"
        @click="baseBoxShow = true"
        v-if="Object.keys(baseInfoData).length > 0"
      >
        <span class="label">{{ $t("infoPage.infoTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="moreInfoItem" @click="getMoreImages" v-if="hasImages">
        <span class="label">{{ $t("infoPage.imagesTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div
        class="moreInfoItem"
        v-if="isChineseUnvi && Object.keys(scoreData).length > 0"
        @click="scoreBoxShow = true"
      >
        <span class="label">{{ $t("infoPage.scoreTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div
        class="moreInfoItem"
        v-if="!isChineseUnvi && Object.keys(requireData).length > 0"
        @click="requireBoxShow = true"
      >
        <span class="label">{{ $t("infoPage.requireTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <transition name="slide-fade">
      <BaseInfo
        v-show="baseBoxShow"
        :topInfoData="topInfoData"
        :baseInfoData="baseInfoData"
      ></BaseInfo>
    </transition>
    <transition name="slide-fade">
      <ImagesBox
        v-show="imagesBoxShow"
        :topInfoData="topInfoData"
        :imagesLoading="imagesLoading"
        :imagesData="imagesData"
      ></ImagesBox>
    </transition>
    <transition name="slide-fade" v-if="isChineseUnvi">
      <ScoreBox
        v-show="scoreBoxShow"
        :topInfoData="topInfoData"
        :scoreData="scoreData"
      ></ScoreBox>
    </transition>
    <transition name="slide-fade" v-if="!isChineseUnvi">
      <RequireBox
        v-show="requireBoxShow"
        :topInfoData="topInfoData"
        :requireData="requireData"
      ></RequireBox>
    </transition>
  </div>
</template>
<script>
import { getDetailBySch, getMoreImages } from "@/API/getData";
import BaseInfo from "@/components/mobileInfoBase";
import ImagesBox from "@/components/mobileInfoImages";
import ScoreBox from "@/components/mobileInfoScore";
import RequireBox from "@/components/mobileInfoRequire";
export default {
  data() {
    return {
      infoPageLoading: true,
      imagesLoading: true,
      isChineseUnvi: true,
      abstract: "",
      topInfoData: {
        url: "",
        rankRegion: "-",
        rankGlobal: "-",
        univName: ""
      },
      baseBoxShow: false,
      baseInfoData: {},
      hasImages: true,
      imagesBoxShow: false,
      imagesData: [],
      scoreBoxShow: false,
      scoreData: {},
      requireBoxShow: false,
      requireData: {},
      abstractOpen: false,
      hasAbstractOpen: false
    };
  },
  components: { BaseInfo, ImagesBox, ScoreBox, RequireBox },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    }
  },
  created() {
    let params = this.$route.query;
    this.topInfoData.univName =
      this.locale === "zh" ? params.cnName : params.enName;
    this.getUnivDetail(params);
  },
  methods: {
    getUnivDetail(data) {
      let _query = {
        language: this.locale,
        name: data.enName
      };
      getDetailBySch(_query)
        .then(res => {
          let _data = res.data;
          this.abstract = _data.abstract;
          this.baseInfoData = _data.infobox;
          this.topInfoData = {
            url: _data.image_sch,
            rankRegion: _data.rank_country,
            rankGlobal: _data.rank_global,
            univName: _data.name
          };
          this.hasImages = _data.images.length > 0;
          this.isChineseUnvi = _data.isChineseUnvi === "true";
          if (this.isChineseUnvi) {
            this.scoreData = _data.score;
            this.requireData = {};
          } else {
            this.requireData = _data.score;
            this.scoreData = {};
          }
          this.infoPageLoading = false;
          this.setAbstractBox();
        })
        .catch(rej => {
          console.log(rej);
          this.infoPageLoading = false;
        });
    },
    backHomePage() {
      if (
        this.baseBoxShow ||
        this.imagesBoxShow ||
        this.scoreBoxShow ||
        this.requireBoxShow
      ) {
        this.baseBoxShow = false;
        this.imagesBoxShow = false;
        this.scoreBoxShow = false;
        this.requireBoxShow = false;
      } else {
        this.$router.push({
          name: "mobileHome"
        });
      }
    },
    getMoreImages() {
      this.imagesBoxShow = true;
      this.imagesLoading = true;
      let _q = {
        language: this.$i18n.locale,
        name: this.$route.query.enName
      };
      this.$nextTick(() => {
        getMoreImages(_q)
          .then(res => {
            this.imagesData = res.data;
            this.imagesLoading = false;
          })
          .catch(rej => {
            console.log(rej);
          });
      });
    },
    setAbstractBox() {
      this.$nextTick(() => {
        let _Dom = this.$refs.abstractBox;
        if (_Dom.scrollHeight > _Dom.clientHeight) {
          this.hasAbstractOpen = true;
        }
      });
    },
    changeAbstractBox() {
      this.abstractOpen = !this.abstractOpen;
    }
  }
};
</script>
<style lang="less">
.mobileInfoPage {
  display: flex;
  flex-direction: column;
  width: 100vw;
  font-size: 3.4667vw;
  background: rgba(248, 248, 248, 1);
  padding-top: 10.6667vw;
  text-align: left;
  .infoHeader {
    position: fixed;
    width: 100%;
    height: 10.6667vw;
    top: 0;
    left: 0;
    background: #5167dc;
    color: #fff;
    z-index: 100;
    .backIcon {
      display: flex;
      position: absolute;
      width: 10.6667vw;
      height: 10.6667vw;
      left: 0;
      justify-content: center;
      align-items: center;
    }
    .univName {
      display: flex;
      width: 100%;
      height: 10.6667vw;
      padding: 0 10.6667vw;
      justify-content: center;
      align-items: center;
    }
  }
  .infoBox {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 0 4vw;
    background: #fff;
    margin-bottom: 2.1333vw;
    max-height: 60vh;
  }
  .infoTopBox {
    position: relative;
    padding: 4vw;
    height: 25.0667vw;
    background: #fff;
    .img {
      position: absolute;
      width: 17.0667vw;
      height: 17.0667vw;
      left: 4vw;
      top: 4vw;
    }
    .univName {
      position: absolute;
      width: 66.6667vw;
      font-size: 4vw;
      right: 4vw;
      top: 4vw;
    }
    .rankText {
      position: absolute;
      width: 66.6667vw;
      right: 4vw;
      bottom: 4vw;
    }
  }
  .abstractBox {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 4vw;
    background: #fff;
    margin-bottom: 2.1333vw;
    height: auto;
    max-height: 74.6667vw;
    .hr {
      position: absolute;
      top: 0;
      left: 4vw;
      height: 0.2667vw;
      width: 92vw;
      background: #bbbbbb;
    }
    p {
      flex: 1;
      text-align: justify;
      overflow: hidden;
      padding-bottom: 6.6667vw;
    }
    .openIcon {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10.6667vw;
      background: #fff;
    }
    &.open {
      max-height: none;
    }
  }
  .moreInfoBox {
    background: #fff;
    padding: 0 4vw;
    margin-bottom: auto;
    .moreInfoItem {
      display: flex;
      width: 100%;
      align-items: center;
      line-height: 10.6667vw;
      border-bottom: 0.2667vw solid #bbbbbb;
      .label {
        flex: 1;
      }
      .el-icon-arrow-right {
        font-size: 3.2vw;
        padding-left: 1.6vw;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .slideFadeBox {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: #f8f8f8;
    padding-top: 10.6667vw;
  }
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(2.6667vw);
    opacity: 0;
  }
  ::-webkit-scrollbar,
  .scrollbar::-webkit-scrollbar {
    width: 0;
  }
}
</style>
