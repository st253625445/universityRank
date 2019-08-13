<template>
  <div class="infoPage" v-loading="infoPageLoading">
    <div class="titleBox">
      <div class="univTitleBox">
        <el-image class="img" :src="image_sch"></el-image>
        <div class="topInfoBox">
          <p class="title">{{ name }}</p>
          <div class="icon">
            <div
              class="iconItem"
              v-for="(item, index) in iconData"
              :key="index"
            >
              <div class="tooltip">{{ item.value }}</div>
              <el-image :src="item.url" fit="contain" />
            </div>
            <div class="urlItem">
              <span>官方网站</span>
            </div>
          </div>
        </div>
        <div class="rankText">
          <div class="rankItem">
            <span class="value">{{ rankRegion }}</span>
            <span class="label">{{ $t("infoPage.regionText2") }}</span>
          </div>
          <div class="rankItem">
            <span class="value">{{ rankGlobal }}</span>
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
          {{ abstract }}
        </p>
        <p class="contentShow" v-if="abstractShow" :style="abstractShowStyle">
          {{ abstract }}
        </p>
        <span class="more" v-if="hasMoreAbstract && !abstractShow">...</span>
      </div>
    </div>
    <div
      class="infoBox"
      v-show="!noData"
      ref="infoBox"
      :style="{ height: infoBoxHeight }"
    >
      <div class="infoItem" v-for="(value, key) in infoData" :key="key">
        <span class="infiItemLabel">{{ key }}</span>
        <span class="infiItemContent" v-html="value"></span>
      </div>
    </div>
    <div class="toolBox">
      <div class="toolItem">
        <div class="toolTitle">{{ $t("infoPage.imagesTitle") }}</div>
        <div class="toolItemCount unviImages">
          <el-carousel height="200px" indicator-position="none">
            <el-carousel-item v-for="(item, index) in srcList" :key="index">
              <el-image :src="item.url" fit="contain"> </el-image>
            </el-carousel-item>
          </el-carousel>
          <el-button
            type="primary"
            class="moreImagesButton"
            @click="showImagePop"
          >
            {{ $t("infoPage.moreImage") }}
          </el-button>
        </div>
      </div>
      <div class="toolItem" v-if="isChinaUnvi">
        <div class="toolTitle">{{ $t("infoPage.mapTitle") }}</div>
        <div class="toolItemCount toolMapBox">
          <baidu-map></baidu-map>
        </div>
      </div>
      <div class="toolItem" v-if="!isChinaUnvi">
        <div class="toolTitle">{{ $t("infoPage.mapTitle") }}</div>
        <div class="toolItemCount toolMapBox">
          <GoogleOrBingMap :center="map_center"></GoogleOrBingMap>
        </div>
      </div>
      <div class="toolItem" v-if="isChinaUnvi">
        <div class="toolTitle">{{ $t("infoPage.scoreTitle") }}</div>
        <div class="toolItemCount">
          <div class="topSelect">
            <el-select size="mini" v-model="scoreSelect.batch">
              <el-option
                v-for="(item, index) in batchList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-select size="mini" v-model="scoreSelect.subject">
              <el-option
                v-for="(item, index) in subjectList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-select size="mini" v-model="scoreSelect.region">
              <el-option
                v-for="(item, index) in regionList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <el-table :data="scoreListShow" height="185" class="scoreListBox">
            <el-table-column prop="year" label="年份"> </el-table-column>
            <el-table-column prop="lowScore" label="最低分"> </el-table-column>
            <el-table-column prop="averageScore" label="平均分">
            </el-table-column>
            <el-table-column prop="controlScore" label="批次分">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div
        class="toolItem"
        v-if="!isChinaUnvi && Object.keys(requireList).length > 0"
      >
        <div class="toolTitle">{{ $t("infoPage.requireTitle") }}</div>
        <div class="toolItemCount requireBox">
          <ul>
            <li v-for="(value, key) in requireList" :key="key">
              <span class="label">{{ key }}</span>
              <div class="count">
                <div class="bg"></div>
                <div class="requireValue" :style="requireItemStyle(value)">
                  {{ requireItemValue(value) }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="toolItem">
        <div class="toolTitle">{{ $t("infoPage.securityTitle") }}</div>
        <div class="toolItemCount securityBox">
          <div class="topSelect">
            <el-select size="mini" v-model="securitySelect">
              <el-option
                v-for="(item, index) in securityOption"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
          <div class="securityCount">
            <div>
              <div
                v-for="(item, index) in securityDataSelect"
                :key="index"
                class="securityItem"
              >
                <span class="securityLabel">{{ item.label }}</span>
              </div>
            </div>
            <div>
              <div
                v-for="(item, index) in securityDataSelect"
                :key="index"
                class="securityItem"
              >
                <span class="securityBar">
                  <span :style="{ width: item.per }"></span>
                </span>
                <span class="securityValue">{{ item.value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="imagePopShow">
      <ImagesPop @hidePop="hideImagePop"></ImagesPop>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import { getDetailBySch } from "@/API/getData";

import ImagesPop from "@/components/imagesPop";
import BaiduMap from "@/components/baiduMap";
import GoogleOrBingMap from "@/components/googleOrBingMap";
import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
import VueBaiduMap from "vue-baidu-map";
export default {
  name: "info",
  data() {
    return {
      noData: true, // 是否无数据
      infoPageLoading: true,
      name: "",
      image_sch: "",
      abstract: "",
      infoData: {},
      rankRegion: "",
      rankGlobal: "",
      infoBoxHeight: "auto",
      isChinaUnvi: true,
      hasMoreAbstract: false, // 简介是否有隐藏部分
      abstractShow: false, // 简介是否展开
      abstractShowStyle: {}, // 简介展开的样式
      baiduMapPop: false,
      map_center: { lng: 0, lat: 0 },
      srcList: [],
      iconData: [], // 认证标签
      scoreSelect: {
        region: "",
        subject: "理科",
        batch: ""
      },
      scoreList: {},
      requireList: {},
      imagePopShow: false,
      map_zoom: 15,
      securityOption: [],
      securitySelect: "",
      securityData: {}
    };
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    },
    regionList: function() {
      let _score = this.scoreList;
      // let _subject = this.scoreSelect.subject;
      let _subject = this.scoreSelect.subject === "文科" ? "arts" : "science";
      let _return = [];
      if (_score && _subject && _score[_subject]) {
        _return = Object.keys(_score[_subject]);
      }
      return _return;
    },
    subjectList: function() {
      let _score = this.scoreList;
      let _subjects = Object.keys(_score);
      let _return = [];
      if (_subjects.indexOf("science") !== -1) {
        _return.push("理科");
      }
      if (_subjects.indexOf("arts") !== -1) {
        _return.push("文科");
      }
      return _return;
    },
    batchList: function() {
      let _score = this.scoreList;
      let _region = this.scoreSelect.region;
      // let _subject = this.scoreSelect.subject;
      let _subject = this.scoreSelect.subject === "文科" ? "arts" : "science";
      let _return = [];
      if (_score && _region && _subject) {
        _return = Object.keys(_score[_subject][_region]);
      }
      return _return;
    },
    scoreListShow: function() {
      let _score = this.scoreList;
      let _region = this.scoreSelect.region;
      // let _subject = this.scoreSelect.subject;
      let _subject = this.scoreSelect.subject === "文科" ? "arts" : "science";
      let _batch = this.scoreSelect.batch;
      let _return = [];
      if (_score && _region && _subject && _batch) {
        _return = _score[_subject][_region][_batch];
      }
      return _return;
    },
    requireItemStyle() {
      return function(value) {
        return this.requireItemStyleFn(value);
      };
    },
    requireItemValue() {
      return function(value) {
        return this.requireItemValueFn(value);
      };
    },
    securityDataSelect() {
      let _data = this.securityData[this.securitySelect];
      let _return = [];
      let maxVal = 0;
      if (_data) {
        // 设置柱子宽
        for (let key in _data) {
          if (_data[key] > maxVal) {
            maxVal = _data[key];
          }
        }
        // 生成返回数组
        for (let key in _data) {
          _return.push({
            label: key,
            value: _data[key],
            per: `${((_data[key] - 0) / maxVal) * 100}%`
          });
        }
      }
      return _return;
    }
  },
  watch: {
    locale(newVal) {
      console.log(newVal);
      this.infoPageLoading = true;
      let query = this.$route.query;
      if (query.cnName || query.enName) {
        this.getDetailBySch(query);
      }
    },
    subjectList(val) {
      this.scoreSelect.subject = val[0];
    },
    regionList(val) {
      let _oldRegion = this.scoreSelect.region;
      if (val.indexOf(_oldRegion) !== -1) {
        return false;
      }
      if (val.indexOf("beijing") !== -1) {
        this.scoreSelect.region = "beijing";
      } else if (val.indexOf("北京") !== -1) {
        this.scoreSelect.region = "北京";
      } else {
        this.scoreSelect.region = val[0];
      }
    },
    batchList(val) {
      let _oldBatch = this.scoreSelect.batch;
      if (val.indexOf(_oldBatch) !== -1) {
        return false;
      }
      if (val.indexOf("本科一批") !== -1) {
        this.scoreSelect.batch = "本科一批";
        return false;
      } else if (val.indexOf("本科批") !== -1) {
        this.scoreSelect.batch = "本科批";
        return false;
      } else {
        this.scoreSelect.batch = val[0];
      }
    },
    abstract() {
      this.$nextTick(() => {
        let _DOM = this.$refs.abstract;
        let _scrollH = _DOM.scrollHeight;
        let _clientH = _DOM.clientHeight;
        if (_clientH < _scrollH) {
          this.hasMoreAbstract = true;
        }
      });
    }
  },
  components: { ImagesPop, BaiduMap, GoogleOrBingMap },
  created() {
    let query = this.$route.query;
    if (query.cnName || query.enName) {
      this.getDetailBySch(query);
    }
    // 地图组件
    let isChinese = localStorage.getItem("ischinese") === "0";
    Vue.use(VueBaiduMap, {
      // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
      ak: "W8G1VEhRLFbgcE2GUABhWZka"
    });
    Vue.use(VueGoogleMaps, {
      load: {
        key: "AIzaSyAxhDDN-BJELdSTxptjRVQn6uY9x6l42f8",
        // v: "GOOGLE_MAPS_VERSION",
        libraries: "places"
      },
      loadCn: isChinese
    });
  },
  methods: {
    // 请求大学信息
    getDetailBySch(data) {
      let _query = {
        language: this.locale,
        name: data.enName
      };
      this.noData = false;
      this.infoBoxHeight = `auto`;
      getDetailBySch(_query)
        .then(res => {
          let _keys = Object.keys(res.data);
          if (res.code === 200 && _keys.length !== 0) {
            this.name = res.data.name;
            this.abstract = res.data.abstract;
            this.image_sch = res.data.image_sch;
            // 判断是否是中国大学
            this.isChinaUnvi = res.data.isChineseUnvi === "true";
            // 大学信息
            this.infoData = res.data.infobox;
            // 校园图集
            this.srcList = res.data.images || [];
            // 排名信息
            this.rankGlobal = res.data.rank_global;
            this.rankRegion = res.data.rank_country;
            // 经纬度
            this.map_center.lng =
              res.data.coordinate && res.data.coordinate.longitude;
            this.map_center.lat =
              res.data.coordinate && res.data.coordinate.latitude;
            // 大学申请要求
            this.requireList = this.scoreList = res.data.score;
            // 大学认证标签
            this.iconData = [];
            res.data.tags.forEach(item => {
              this.iconData.push({
                url: require(`../assets/img/icon/${item.label}.png`),
                value: item.value
              });
            });
            // 校园安全
            if (res.data.campus_security) {
              this.securityOption = Object.keys(res.data.campus_security).sort(
                (a, b) => b - a
              );
              this.securitySelect = this.securityOption[0];
              this.securityData = res.data.campus_security;
            }
          } else {
            this.noData = true;
          }
          this.$nextTick(() => {
            let _height = this.$refs.infoBox.clientHeight;
            let _childNodes = this.$refs.infoBox.childNodes;
            let _childHeights = [];
            _childNodes.forEach(item => {
              _childHeights.push(item.clientHeight);
            });
            let defaultH = (_height - 0) / 2;
            let boxH = 0;
            for (let i = 0; i < _childHeights.length; i++) {
              boxH += _childHeights[i] - 0;
              if (boxH >= defaultH) {
                let _leftH = boxH;
                let _rightH = 0;
                _childHeights.slice(i + 1).forEach(item => {
                  _rightH += item;
                });
                this.infoBoxHeight = `${_leftH > _rightH ? _leftH : _rightH}px`;
                break;
              } else {
                continue;
              }
            }
            this.infoPageLoading = false;
          });
        })
        .catch(rej => {
          console.log(rej);
          this.noData = true;
          this.$nextTick(() => {
            this.infoPageLoading = false;
          });
        });
    },
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
    },
    requireItemStyleFn(data) {
      let _right = ((data.all - data.end) / data.all) * 100 + "%";
      let _minW = ((data.end - data.start) / data.all) * 100 + "%";
      let _teturn = {
        right: _right,
        minWidth: _minW
      };
      return _teturn;
    },
    requireItemValueFn(data) {
      if (data.start && data.end) {
        return `${data.start}-${data.end}`;
      } else {
        return `${data.start}` || `${data.end}` || "";
      }
    },
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
.infoPage {
  min-height: calc(100% - 83px);
  width: 1140px;
  margin: 0 auto;
  padding: 50px 0;
  text-align: left;
  cursor: default;
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
        float: right;
        span {
          font-size: 14px;
          color: #5066dc;
          line-height: 30px;
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
  .infoBox {
    width: calc(100% + 10px);
    position: relative;
    display: flex;
    left: -5px;
    flex-direction: column;
    flex-wrap: wrap;
    font-size: 12px;
    line-height: 24px;
    color: #101010;
    margin-bottom: 50px;
    overflow: hidden;
    .infoItem {
      width: 50%;
      display: flex;
      padding: 0 5px;
    }
    .infiItemLabel {
      width: 140px;
      padding-right: 20px;
      font-weight: bold;
    }
    .infiItemContent {
      flex: 1;
      white-space: pre-line;
    }
  }
  .toolBox {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
    .toolItem {
      position: relative;
      width: 50%;
      padding-right: 10px;
      margin-bottom: 40px;
      &:nth-child(2n) {
        padding-left: 10px;
        padding-right: 0;
      }
    }
    .toolTitle {
      position: absolute;
      left: 16px;
      top: -15px;
      font-size: 14px;
      line-height: 30px;
      padding: 0 15px;
      background: #fff;
      z-index: 2;
    }
    .toolItemCount {
      position: relative;
      width: 100%;
      padding: 20px;
      min-height: 260px;
      border: 1px solid #5066dc;
    }
    .unviImages {
      padding: 20px 40px 40px;
    }
    .toolMapBox {
      padding: 20px;
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
    .toolMapCount {
      width: 100%;
      height: 220px;
      &.toolMapCountPop {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: calc(100%);
        z-index: 1050;
      }
    }
    .pano_close {
      top: auto;
      bottom: 10px;
    }
    .topSelect {
      display: flex;
      flex-direction: row-reverse;
      .el-select--mini {
        line-height: 20px;
        margin-left: 8px;
        .el-input__inner {
          padding-left: 8px;
          padding-right: 18px;
          height: 20px;
          line-height: 20px;
        }
        .el-input__icon {
          width: 15px;
          height: 20px;
          line-height: 20px;
        }
        &:nth-child(1) {
          width: 90px;
        }
        &:nth-child(2) {
          width: 60px;
        }
        &:nth-child(3) {
          width: 60px;
        }
      }
    }
    .scoreListBox {
      width: 100%;
      height: 185px;
      margin-top: 15px;
      .cell {
        text-align: center;
        line-height: 30px;
      }
      td {
        padding: 0;
        border-bottom: none;
      }
      th {
        padding: 0;
        font-size: 14px;
        line-height: 40px;
        border-bottom: none;
        background: #5167dc;
        color: #fff;
        border-right: 1px solid #fff;
        font-weight: normal;
        &.gutter {
          background: #fff;
        }
      }
      &::before {
        height: 0;
      }
    }
    .requireBox {
      padding: 40px 20px;
      > ul {
        max-height: 100%;
      }
      li {
        display: flex;
        width: 100%;
        height: 36px;
        .label {
          height: 100%;
          font-size: 14px;
          line-height: 36px;
          min-width: 70px;
          padding-right: 10px;
          text-align: left;
        }
        .count {
          flex: 1;
          position: relative;
          height: 100%;
          border-left: 1px solid #e8e8e8;
        }
        .bg {
          position: absolute;
          width: 100%;
          height: 20px;
          left: 0;
          top: 8px;
          background: #e8e8e8;
        }
        .requireValue {
          position: absolute;
          height: 28px;
          top: 4px;
          padding: 0 10px;
          text-align: center;
          background: #5167dc;
          border-radius: 5px;
          color: #fff;
          font-size: 12px;
          line-height: 28px;
        }
      }
    }
    .securityBox {
      display: flex;
      flex-direction: column;
      .topSelect {
        flex-direction: row;
      }
      .securityCount {
        width: 100%;
        padding-top: 10px;
        flex: 1;
        display: flex;
        > div {
          display: flex;
          flex-direction: column;
          &:last-child {
            flex: 1;
          }
        }
      }
      .securityItem {
        flex: 1;
        display: flex;
        align-items: center;
        .securityLabel {
          max-width: 120px;
          text-align: left;
          word-break: break-all;
        }
        .securityValue {
          width: 30px;
        }
        .securityBar {
          flex: 1;
          height: 12px;
          padding: 0 20px;
          > span {
            display: block;
            background: #5066dc;
            height: 100%;
          }
        }
      }
    }
  }

  .el-image {
    width: 100%;
    height: 100%;
  }
  .el-loading-mask {
    background: rgba(255, 255, 255);
  }
}
</style>
