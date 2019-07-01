<template>
  <div class="imagesPop">
    <div
      class="imgCountBox"
      v-clickoutside="popOutClick"
      v-loading="imgLoading"
      @mousewheel="listMousewheel"
    >
      <div class="imgCount">
        <el-image :src="showUrl" lazy fit="contain"></el-image>
      </div>
      <div class="imgsList" ref="urlslist">
        <el-image
          v-for="(item, index) in urlsLazy"
          :key="index"
          :class="{ active: activeIndex === index }"
          @click="changeShowUrl(index)"
          :src="item"
          fit="contain"
        ></el-image>
      </div>
    </div>
  </div>
</template>
<script>
import Clickoutside from "element-ui/src/utils/clickoutside";
import { getMoreImages } from "@/API/getData";
import { clearTimeout, setTimeout } from "timers";
export default {
  data() {
    return {
      imgLoading: true,
      showUrl: "",
      urls: [],
      urlsLazy: [],
      activeIndex: 0,
      urlScrollTop: 0,
      timer: null,
      wheelTimer: null
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
          this.urlsLazy = new Array(res.data.length);
          for (let i = 0; i < 10; i++) {
            this.urlsLazy[i] = this.urls[i].url;
          }
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
    changeShowUrl(index) {
      this.activeIndex = index;
      let ListDom = this.$refs.urlslist;
      let _top = ListDom.childNodes[index].offsetTop - 120;
      this.urlScrollTop = _top;
      this.showUrl = this.urls[index].url;
      let _len = index + 10 > this.urls.length ? this.urls.length : index + 10;
      for (let i = 0; i < _len; i++) {
        this.urlsLazy[i] = this.urls[i].url;
      }
      let _timer = this.timer;
      if (_timer) {
        clearTimeout(_timer);
        return false;
      } else {
        _timer = setTimeout(() => {
          this.setScrollTop();
        }, 300);
      }
    },
    listMousewheel(el) {
      let _timer = this.wheelTimer;
      let _wheel = el.wheelDelta;
      let _index = this.activeIndex;
      if (_timer) {
        clearTimeout(_timer);
        return false;
      } else {
        _timer = setTimeout(() => {
          _timer = null;
          _wheel > 0
            ? _index > 0
              ? _index--
              : 0
            : _index < this.urls.length - 1
            ? _index++
            : (_index = this.urls.length - 1);
          this.changeShowUrl(_index);
        }, 300);
      }
    },
    setScrollTop() {
      let _Dom = this.$refs.urlslist;
      let _nowScroll = _Dom.scrollTop;
      let total = this.urlScrollTop;
      let step = 0;
      // 平滑滚动，时长200ms，每10ms一跳，共20跳
      if (total > _nowScroll) {
        let newTotal = total - _nowScroll;
        step = newTotal / 20;
        smoothDown();
      } else {
        let newTotal = _nowScroll - total;
        step = newTotal / 20;
        smoothUp();
      }
      function smoothDown() {
        if (_nowScroll < total) {
          _nowScroll += step;
          _Dom.scrollTop = _nowScroll;
          setTimeout(smoothDown, 10);
        } else {
          _Dom.scrollTop = total;
        }
      }
      function smoothUp() {
        if (_nowScroll > total) {
          _nowScroll -= step;
          _Dom.scrollTop = _nowScroll;
          setTimeout(smoothUp, 10);
        } else {
          _Dom.scrollTop = total;
        }
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
    background: #000000db;
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
    overflow: hidden;
    .el-image {
      position: relative;
      height: 120px;
      margin-top: 20px;
      background: #232222ba;
      &.active {
        border: 2px solid #5066dc;
      }
      .el-image__error {
        height: 100px;
        background-color: #4d4e4f;
      }
    }
    &::-webkit-scrollbar,
    &.scrollbar::-webkit-scrollbar {
      background: transparent;
    }
  }
}
</style>
