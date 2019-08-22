<template>
  <div class="infoPage" v-loading="infoPageLoading">
    <TopInfoBox :topInfo="topInfo" />
    <InfoBox v-show="!noData" :infoData="infoData" />
    <div class="countBox">
      <el-row :gutter="20">
        <!-- 地图信息 -->
        <MapInfo :isChinaUnvi="isChinaUnvi" :coordinateData="coordinate" />
        <!-- 校园图集 -->
        <ImagesBox :srcList="srcList" />
      </el-row>
      <el-row :gutter="20" v-if="locale === 'zh' && isChinaUnvi">
        <!-- 学科概览 -->
        <SubjectBox :subjectData="subjectData" />
        <!-- 学科评估结果 -->
        <MajorBox :majorData="majorData" />
        <!-- 录取分数 -->
        <ScoreBox :scoreList="scoreList" />
      </el-row>
      <el-row :gutter="20" v-if="!isChinaUnvi">
        <!-- 申请要求 -->
        <RequireBox :requireList="requireList" />
        <!-- 费用、奖学金和薪资 -->
        <CostInfoBox :costData="costData" />
        <!-- 校园安全 -->
        <SecurityBox :securityData="securityData" />
      </el-row>
      <!-- 知名校友 -->
      <AlumniBox :alumniData="alumniData" />
      <el-row :gutter="20">
        <!-- 最新资讯 -->
        <NewsBox :isChinaUnvi="isChinaUnvi" :newsData="newsData" />
        <!-- 社交媒体 -->
        <MediaBox :mediaData="mediaData" />
      </el-row>
      <!-- 在线课程 -->
      <CoursesBox :coursesData="coursesData" />
    </div>
  </div>
</template>

<script>
import { getDetailBySch } from "@/API/getData";
import TopInfoBox from "@/components/info/topInfoBox";
import InfoBox from "@/components/info/InfoBox";
import MapInfo from "@/components/info/mapInfo";
import ImagesBox from "@/components/info/imageBox";
import MajorBox from "@/components/info/majorBox";
import SubjectBox from "@/components/info/subjectBox";
import ScoreBox from "@/components/info/scoreBox";
import RequireBox from "@/components/info/requireBox";
import CostInfoBox from "@/components/info/costInfoBox";
import SecurityBox from "@/components/info/securityBox";
import AlumniBox from "@/components/info/alumniBox";
import NewsBox from "@/components/info/newsBox";
import MediaBox from "@/components/info/mediaBox";
import CoursesBox from "@/components/info/coursesBox";

export default {
  name: "info",
  data() {
    return {
      noData: true, // 是否无数据
      infoPageLoading: true,
      topInfo: {}, // 顶部信息
      infoData: {}, // 大学信息
      isChinaUnvi: "",
      coordinate: [], // 校区经纬度
      srcList: [], // 图集
      subjectData: {}, // 学科概览
      majorData: {}, // 学科评级
      scoreList: {}, // 录取线
      requireList: {}, // 申请条件
      costData: {}, // 费用
      securityData: {}, // 安全
      alumniData: [], // 校友
      newsData: {}, // 新闻
      mediaData: {}, // 社交url
      coursesData: {}, // 在线课程
      map_zoom: 15
    };
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
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
    }
  },
  components: {
    TopInfoBox,
    InfoBox,
    MapInfo,
    ImagesBox,
    SubjectBox,
    MajorBox,
    ScoreBox,
    RequireBox,
    CostInfoBox,
    SecurityBox,
    AlumniBox,
    NewsBox,
    MediaBox,
    CoursesBox
  },
  created() {
    let query = this.$route.query;
    if (query.cnName || query.enName) {
      this.getDetailBySch(query);
    }
  },
  methods: {
    // 请求大学信息
    getDetailBySch(data) {
      let _query = {
        language: this.locale,
        name: data.enName
      };
      this.noData = false;
      getDetailBySch(_query)
        .then(res => {
          let _keys = Object.keys(res.data);
          if (res.code === 200 && _keys.length !== 0) {
            // 判断是否是中国大学
            this.isChinaUnvi = res.data.isChineseUnvi === "true";
            // 顶部信息
            this.topInfo = {
              name: res.data.name,
              abstract: res.data.abstract,
              image_sch: res.data.image_sch,
              rankGlobal: res.data.rank_global,
              rankRegion: res.data.rank_country,
              urls: res.data.urls,
              iconData: []
            };
            res.data.tags.forEach(item => {
              this.topInfo.iconData.push({
                url: require(`../assets/img/icon/${item.label}.png`),
                value: item.value
              });
            });
            // 大学信息
            this.infoData = res.data.infobox;
            // 地图经纬度
            this.coordinate = res.data.coordinate;
            // 校园图集
            this.srcList = res.data.images || [];
            // 学科概览
            this.subjectData = res.data.infobox_subject;
            // 学科评级
            this.majorData = res.data.xkpgjg;
            // 大学申请要求/录取分数线
            this.requireList = this.scoreList = res.data.score;
            // 大学费用
            this.costData = res.data.cost_scholarship_salary;
            // 校园安全
            this.securityData = res.data.campus_security;
            // 校友信息
            this.alumniData = res.data.alma_mater_img;
            // 最新资讯
            this.newsData = res.data.news;
            // 社交媒体
            this.mediaData = res.data.otherUrls;
            // 在线课程
            this.coursesData = res.data.course;
          } else {
            this.noData = true;
          }
          this.infoPageLoading = false;
        })
        .catch(rej => {
          console.log(rej);
          this.noData = true;
          this.$nextTick(() => {
            this.infoPageLoading = false;
          });
        });
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
  .countBox {
    .toolItem {
      position: relative;
      margin-bottom: 20px;
    }
    .toolTitle {
      font-size: 18px;
      line-height: 30px;
      background: #fff;
      z-index: 2;
    }
    .toolItemCount {
      position: relative;
      width: 100%;
      padding: 20px 0;
      min-height: 260px;
    }
    .pano_close {
      top: auto;
      bottom: 10px;
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
  .el-select--mini {
    line-height: 20px;
    & + .el-select--mini {
      margin-left: 8px;
    }
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
  }
}
</style>
