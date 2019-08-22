<template>
  <el-col class="toolItem mapBox" :span="12">
    <div class="toolTitle">{{ $t("infoPage.mapTitle") }}</div>
    <div class="topSelect" v-if="mapOptions.length > 1">
      <el-select size="mini" v-model="mapValue" @change="mapValueChange">
        <el-option
          v-for="(item, index) in mapOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="toolItemCount toolMapBox">
      <baidu-map v-if="isChinaUnvi" :center="map_center"></baidu-map>
      <GoogleOrBingMap v-else :center="map_center"></GoogleOrBingMap>
    </div>
  </el-col>
</template>

<script>
import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
import VueBaiduMap from "vue-baidu-map";
import BaiduMap from "./baiduMap";
import GoogleOrBingMap from "./googleOrBingMap";
export default {
  name: "mapInfo",
  props: ["isChinaUnvi", "coordinateData"],
  data: function() {
    return {
      mapOptions: [],
      mapValue: "",
      map_center: {
        lng: 0,
        lat: 0
      }
    };
  },
  components: { BaiduMap, GoogleOrBingMap },
  watch: {
    coordinateData: {
      handler(val) {
        this.mapOptions = val.map(item => {
          return {
            label: item.campus,
            value: item.campus
          };
        });
        this.mapValue = this.mapOptions[0].value;
        this.map_center.lng = val[0].longitude - 0;
        this.map_center.lat = val[0].latitude - 0;
      },
      immediate: false
    }
  },
  created() {
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
    mapValueChange(val) {
      this.coordinateData.forEach(item => {
        if (item.campus === val) {
          this.map_center.lng = item.longitude - 0;
          this.map_center.lat = item.latitude - 0;
          console.log(this.map_center);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.mapBox {
  position: relative;
  .toolItemCount {
    min-height: 340px !important;
  }
  .topSelect {
    position: absolute;
    top: 5px;
    right: 0;
  }
  .toolMapCount {
    width: 100%;
    height: 300px;
    &.toolMapCountPop {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: calc(100%);
      z-index: 1050;
    }
  }
}
</style>
