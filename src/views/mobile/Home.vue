<template>
  <div class="mobileHomePage" v-loading="loading">
    <header>
      <div class="title">{{ $t("message.title") }}</div>
      <div class="languageText" @click="changeLanguage">{{ languageText }}</div>
    </header>
    <div class="topSelect">
      <div class="selectItem" @click="regionShow = true">
        <span class="label">{{ $t("mobilePage.regionLabel") }}</span>
        <span class="value">{{ region }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="selectItem" @click="subjectShow = true">
        <span class="label">{{ $t("mobilePage.subjectLabel") }}</span>
        <span class="value">{{ subject }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
      <div class="selectItem" @click="weightShow = true">
        <span class="label">{{ $t("mobilePage.weightLabel") }}</span>
        <span class="value">{{ weight }}</span>
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="listsBox">
      <div class="listTh">
        <span class="index">{{ language === "zh" ? "排名" : "Rank" }}</span>
        <span class="gIndex" v-if="params.country || params.continent">
          {{ language === "zh" ? "世界" : "Global" }}
        </span>
        <span class="univLabel">
          {{ language === "zh" ? "大学" : "University" }}
        </span>
        <span class="scoreLabel">
          {{ language === "zh" ? "分数" : "Score" }}
        </span>
      </div>
      <ul class="univsList" ref="univsList" @scroll="univsListScroll">
        <li
          class="univItem"
          v-for="(item, index) in rankList"
          :key="index"
          @click="linkToUniv(item)"
        >
          <span class="index">{{ item.xh }}</span>
          <span class="gIndex" v-if="item.xh_g">{{ item.xh_g }}</span>
          <div class="univValue">
            <p class="name">
              {{ language === "zh" ? item.cnName : item.enName }}
            </p>
            <span class="countryName">
              <img :src="item.image_country" alt="" class="countryImg" />
              {{ language === "zh" ? item.country_cn : item.country_en }}
            </span>
          </div>
          <span class="scoreValue">
            {{ item.score | numToFiexd }}
          </span>
        </li>
        <li v-if="!listFinished" class="univItem nomore">
          {{ $t("mobilePage.moreLoadText") }}
        </li>
        <li v-if="listFinished" class="univItem nomore">
          {{ $t("mobilePage.nomoreText") }}
        </li>
      </ul>
    </div>
    <transition name="slide-fade">
      <MobileRegion
        v-show="regionShow"
        :continentList="continentList"
        :countryList="countryList"
        @changeRegion="changeRegion"
      ></MobileRegion>
    </transition>
    <transition name="slide-fade">
      <MobileSubject
        v-show="subjectShow"
        :subjectList="subjectList"
        @changeSubject="changeSubject"
      >
      </MobileSubject>
    </transition>
    <transition name="slide-fade">
      <MobileWeight
        v-show="weightShow"
        :weightParams="weightParams"
        @changeWeight="changeWeight"
      >
      </MobileWeight>
    </transition>
    <el-backtop target=".univsList"></el-backtop>
  </div>
</template>
<script>
import { getCountryList, getRankList } from "@/API/getData";
import MobileRegion from "@/components/mobileRegion";
import MobileSubject from "@/components/mobileSubject";
import MobileWeight from "@/components/mobileWeight";
export default {
  data() {
    return {
      loading: true,
      listFinished: false,
      language: "",
      languageText: "English",
      region: "全球",
      subject: "综合",
      weight: "自定义",
      params: {
        continent: "",
        country: "",
        language: "zh",
        name: "",
        subject: "",
        pageNow: 1,
        pageSize: 20,
        weight: {}
      },
      rankList: [],
      regionShow: false,
      subjectShow: false,
      weightShow: false,
      continentList: [],
      countryList: [],
      subjectList: [],
      weightParams: {},
      scrollTimeOut: null
    };
  },
  created() {
    this.language = localStorage.lang == undefined ? "zh" : localStorage.lang;
  },
  filters: {
    numToFiexd(val) {
      return (val - 0).toFixed(2);
    }
  },
  watch: {
    language: {
      handler(nVal) {
        document.title =
          nVal === "zh"
            ? "2020年你可排世界大学排名"
            : "2020 NKP Global University Rankings";
        this.languageText = nVal === "zh" ? "English" : "中文";
        this.region = nVal === "zh" ? "全球" : "Global";
        this.subject = nVal === "zh" ? "综合" : "Comprehensive";
        this.weight = nVal === "zh" ? "自定义" : "Default";
        this.getCountryList();
      },
      immediate: true
    }
  },
  components: { MobileRegion, MobileSubject, MobileWeight },
  methods: {
    getCountryList() {
      let _opt = {
        language: this.language
      };
      getCountryList(_opt)
        .then(res => {
          this["continentList"] = res.data.continentList;
          this["countryList"] = res.data.countryList;
          this["subjectList"] = res.data.subjectList;
          this.resizeSelect();
        })
        .catch(rej => {
          console.log(rej);
        });
    },
    getRankList(params) {
      this.loading = true;
      this.params = {
        ...this.params,
        ...params
      };
      getRankList(this.params)
        .then(res => {
          for (let key in res.data.info) {
            let _item = {
              enName: key,
              ...res.data.info[key]
            };
            this.rankList.push(_item);
          }
          this.rankList.sort((a, b) => {
            let _xh1 = a.xh;
            let _xh2 = b.xh;
            if (_xh1 > _xh2) {
              return 1;
            } else if (_xh1 < _xh2) {
              return -1;
            } else {
              return 0;
            }
          });
          if (this.rankList.length >= res.data.pageInfo.total) {
            this.listFinished = true;
          }
          this.loading = false;
        })
        .catch(rej => {
          console.log(rej);
        });
    },
    resizeSelect(params) {
      let _weight = {
        "Academic Performance": 0.4,
        Alumni: 0.3,
        Endowment: 0.05,
        Faculty: 0.05,
        Reputation: 0.2
      };
      if (this["subjectList"].length) {
        for (let key in _weight) {
          if (this["subjectList"][0].parameters[key]) {
            _weight[key] = this["subjectList"][0].parameters[key] / 100;
          } else {
            _weight[key] = 0;
          }
        }
      }
      this.weightParams = _weight;
      let _params = {
        continent: "",
        country: "",
        language: this.language,
        name: "",
        subject: "",
        pageNow: 1,
        weight: _weight
      };
      this.rankList = [];
      this.listFinished = false;

      if (params) {
        _params = {
          ..._params,
          ...params
        };
      }
      this.params = {
        ...this.params,
        ..._params
      };
      this.getRankList();
    },
    changeLanguage() {
      let _lan = this.language === "zh" ? "en" : "zh";
      localStorage.setItem("lang", _lan);
      this.$i18n.locale = _lan;
      this.language = _lan;
    },
    changeRegion(data) {
      this.regionShow = false;
      this.region = data;
      let _all = ["全球", "Global"];
      let _opt = {
        country: _all.indexOf(data) !== -1 ? "" : data,
        pageNow: 1
      };
      this.rankList = [];
      this.listFinished = false;
      this.getRankList(_opt);
    },
    changeSubject(data) {
      this.subjectShow = false;
      this.subject = this.subjectList[data].value;
      let _w = { ...this.params.weight };
      if (this.subjectList[data]) {
        let _parameters = this.subjectList[data].parameters;
        for (let key in _w) {
          if (_parameters[key]) {
            _w[key] = _parameters[key] / 100;
          } else {
            _w[key] = 0;
          }
        }
      }
      this.weightParams = _w;
      let _opt = {
        subject: this.subjectList[data].value,
        weight: _w,
        pageNow: 1
      };
      this.rankList = [];
      this.listFinished = false;
      this.getRankList(_opt);
    },
    changeWeight(data) {
      this.weightShow = false;
      let _opt = {
        weight: data,
        pageNow: 1
      };
      this.rankList = [];
      this.listFinished = false;
      this.getRankList(_opt);
    },
    // 触底加载更多
    univsListScroll() {
      if (this.scrollTimeOut || this.loading || this.listFinished) return false;
      this.scrollTimeOut = setTimeout(() => {
        this.scrollTimeOut = null;
        let _Dom = this.$refs.univsList;
        if (_Dom.scrollHeight < _Dom.scrollTop + _Dom.offsetHeight + 100) {
          this.params.pageNow++;
          this.getRankList();
        }
      }, 1000);
    },
    linkToUniv(data) {
      let _q = {
        cnName: data.cnName,
        enName: data.enName
      };
      this.$router.push({
        name: "mobileInfo",
        query: _q
      });
    }
  }
};
</script>
<style lang="less">
.mobileHomePage {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  font-size: 3.4667vw;
  background: rgba(248, 248, 248, 1);
  overflow: hidden;
  header {
    display: flex;
    width: 100%;
    padding: 0 4vw;
    color: #fff;
    line-height: 10.6667vw;
    .title {
      flex: 1;
      text-align: left;
    }
  }
  .topSelect {
    width: 100%;
    padding: 0 4vw;
    color: #000;
    background: #fff;
    margin-bottom: 2.6667vw;
    .selectItem {
      display: flex;
      width: 100%;
      line-height: 10.6667vw;
      border-bottom: 0.2667vw solid rgba(187, 187, 187, 1);
      .value {
        flex: 1;
        text-align: right;
      }
      &:last-child {
        border-bottom: none;
      }
    }
    .el-icon-arrow-right {
      font-size: 3.2vw;
      padding-left: 1.6vw;
      &::before {
        line-height: 10.6667vw;
      }
    }
  }
  .listsBox {
    display: flex;
    flex-direction: column;
    flex: 1;
    background: #fff;
    .listTh {
      display: flex;
      width: 100%;
      padding: 0 4vw;
      line-height: 10.6667vw;
      text-align: left;
      border-bottom: 0.2667vw solid rgba(187, 187, 187, 1);
      .index,
      .gIndex,
      .scoreLabel {
        width: 13.3333vw;
      }
      .univLabel {
        flex: 1;
      }
    }
    .univsList {
      flex: 1;
      padding: 0 4vw;
      text-align: left;
      overflow: scroll;
      .univItem {
        width: 100%;
        height: 16vw;
        display: flex;
        border-bottom: 0.2667vw solid #bbbbbb;
        align-items: center;
        &.nomore {
          justify-content: center;
          border-bottom: none;
        }
        .index,
        .gIndex,
        .scoreValue {
          width: 13.3333vw;
        }
        .univValue {
          flex: 1;
          display: flex;
          flex-direction: column;
          line-height: 5.3333vw;
          img {
            width: 4.8vw;
            height: 2.6667vw;
          }
        }
      }
    }
  }

  .selectBox {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background: #fff;
    padding: 4.2667vw;
    overflow: auto;
    .gloupLabel {
      text-align: left;
      color: #888;
      margin-bottom: 2.1333vw;
    }
    .selectGloup {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .selectItem {
        width: 32%;
        margin-right: 2%;
        color: #101010;
        line-height: 7.4667vw;
        text-align: center;
        border: 0.2667vw solid #bbb;
        margin-bottom: 2.1333vw;
        &:nth-child(3n) {
          margin-right: 0;
        }
        &.active {
          border-color: #5167dc;
        }
      }
    }

    &.weightBox {
      padding: 0;
      background: #f8f8f8;
      color: #000;
      line-height: 10.6667vw;
    }
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
