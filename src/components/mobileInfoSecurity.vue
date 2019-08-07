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
    <div class="securityInfoBox">
      <van-dropdown-menu>
        <van-dropdown-item v-model="year" :options="yearsOption" />
      </van-dropdown-menu>
      <ul class="securityBox">
        <li v-for="(item, key) in securityDataShow" :key="key">
          <span class="itemLabel">{{ key }}</span>
          <span class="itemValue">{{ item }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
export default {
  props: ["topInfoData", "securityData"],
  data() {
    return {
      year: "",
      yearsOption: []
    };
  },
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  computed: {
    securityDataShow: function() {
      return this.securityData[this.year];
    }
  },
  watch: {
    securityData: {
      handler(val) {
        let _keys = Object.keys(val).sort((a, b) => b - a);
        if (_keys.length > 0) {
          this.yearsOption = _keys.map(item => {
            return {
              text: item,
              value: item
            };
          });
          this.year = _keys[0];
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {}
};
</script>
<style lang="less">
.securityInfoBox {
  width: 100%;
  height: calc(100% - 25.0667vw);
  padding-top: 2.1333vw;
  .van-dropdown-menu {
    background-color: transparent;
  }
  .van-dropdown-menu__title {
    margin-left: auto;
    margin-right: 4vw;
    border: 1px solid #5167dc;
    border-radius: 1.6vw;
    padding: 0 8vw 0 5.6vw;
    height: 8vw;
    line-height: 7.4667vw;
    &::after {
      right: 2.4vw;
      top: 2.6667vw;
    }
    &--down::after {
      top: 3.4667vw;
    }
  }
  .securityBox {
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
      .itemLabel {
        width: 38.6667vw;
      }
      .itemValue {
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
