<template>
  <div class="mobileInfoPage">
    <div class="infoHeader">
      <i class="el-icon-arrow-left backIcon" @click="backHomePage"></i>
      <div class="univName">{{ univName }}</div>
    </div>
    <div class="infoTopBox">
      <el-image class="img" :src="image_sch"></el-image>
      <div class="univName">{{ univName }}</div>
      <div class="rankText">
        {{ $t("infoPage.regionText") }}: {{ rankRegion }}
        {{ $t("infoPage.globalText") }}: {{ rankGlobal }}
      </div>
    </div>
    <div class="abstractBox">
      <i class="hr"></i>
      <p class="abstract">{{ abstract }}</p>
      <i class="el-icon-d-caret"></i>
    </div>
    <div class="moreInfoBox">
      <div class="moreInfoItem" @click="baseBoxShow = true">
        <span class="label">{{ $t("infoPage.infoTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="moreInfoItem">
        <span class="label">{{ $t("infoPage.imagesTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="moreInfoItem">
        <span class="label">{{ $t("infoPage.scoreTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="moreInfoItem">
        <span class="label">{{ $t("infoPage.requireTitle") }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <transition name="slide-fade">
      <BaseInfo v-show="baseBoxShow" :baseInfoData="baseInfoData"></BaseInfo>
    </transition>
  </div>
</template>
<script>
import { getDetailBySch } from "@/API/getData";
import BaseInfo from "@/components/mobileInfoBase";
export default {
  data() {
    return {
      univName: "",
      abstract: "",
      rankRegion: "-",
      rankGlobal: "-",
      image_sch: "",
      baseBoxShow: false,
      baseInfoData: {}
    };
  },
  components: { BaseInfo },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    }
  },
  created() {
    let params = this.$route.params;
    this.univName = this.locale === "zh" ? params.cnName : params.enName;
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
          console.log(res);
          let _data = res.data;
          this.univName = _data.name;
          this.abstract = _data.abstract;
          this.rankRegion = _data.rank_country;
          this.rankGlobal = _data.rank_global;
          this.image_sch = _data.image_sch;
          this.baseInfoData = _data.infobox;
        })
        .catch(rej => {
          console.log(rej);
        });
    },
    backHomePage() {
      if (this.baseBoxShow) {
        this.baseBoxShow = false;
      } else {
        this.$router.push({
          name: "mobileHome"
        });
      }
    }
  }
};
</script>
<style lang="less">
.mobileInfoPage {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
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
    z-index: 100;
    background: #fff;
    .el-image {
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
    padding: 0 4vw;
    background: #fff;
    margin-bottom: 2.1333vw;
    max-height: 50vh;
    .hr {
      height: 0.2667vw;
      width: 100%;
      background: #bbbbbb;
    }
    p {
      flex: 1;
      margin-top: 4vw;
      margin-bottom: 10.6667vw;
      text-align: justify;
      overflow: scroll;
    }
    .el-icon-d-caret {
      position: absolute;
      bottom: 5.3333vw;
      left: 50%;
      transform: translate(-50%;0);
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
    padding-top: 35.7333vw;
    overflow: auto;
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