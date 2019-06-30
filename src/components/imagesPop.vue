<template>
  <div class="imagesPop">
    <div
      class="imgCountBox"
      v-clickoutside="popOutClick"
      v-loading="imgLoading"
    >
      <div class="imgCount">
        <el-image :src="showUrl" lazy fit="contain"></el-image>
      </div>
      <div class="imgsList">
        <div
          v-for="(item, index) in urls"
          :key="index"
          @click="changeShowUrl(item)"
        >
          <el-image :src="item.url" lazy fit="contain"></el-image>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import { getMoreImages } from "@/API/getData";
export default {
  data() {
    return {
      imgLoading: true,
      showUrl: "",
      urls: []
    };
  },
  created() {
    let query = this.$route.query;
    if (query.cnName || query.enName) {
      this.getImages(query);
    }
  },
  mounted() {
    document.body.style["overflow-y"] = "hidden";
  },
  directives: { Clickoutside },
  methods: {
    getImages(data) {
      let _q = {
        language: this.$i18n.locale,
        name: data.enName
      };
      getMoreImages(_q)
        .then(res => {
          this.imgLoading = false;
          this.urls = res.data;
          this.showUrl = this.urls[0].url;
        })
        .catch(rej => {
          console.log(rej);
          this.imgLoading = false;
        });
    },
    popOutClick() {
      document.body.style["overflow-y"] = "auto";
      this.$emit("hidePop");
    },
    changeShowUrl(data) {
      console.log(data);
      if (data && data.url && data.type) {
        this.showUrl = data.url;
      } else {
        this.showUrl = "";
      }
    }
  }
};
</script>
<style lang="less">
.imagesPop {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #00000075;
  z-index: 1060;
  .imgCountBox {
    position: absolute;
    display: flex;
    width: 70%;
    height: 70%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #00000090;
    .el-image__error,
    .el-image__placeholder {
      background: #4d4e4f;
    }
  }
  .imgCount {
    flex: 1;
    height: 100%;
    padding: 10px;
  }
  .imgsList {
    width: 200px;
    height: 100%;
    padding: 10px;
    overflow: auto;
    .el-image {
      position: relative;
      height: auto;
      .el-image__error {
        height: 100px;
        background-color: #4d4e4f;
      }
      &:hover {
        &::after {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background: #00000040;
        }
      }
    }
    &::-webkit-scrollbar,
    &.scrollbar::-webkit-scrollbar {
      background: transparent;
    }
  }
}
</style>
