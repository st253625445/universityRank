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
    <div class="scoreInfoBox">
      <van-dropdown-menu>
        <van-dropdown-item v-model="region" :options="regionOption" />
        <van-dropdown-item v-model="batch" :options="batchOption" />
        <van-dropdown-item v-model="subject" :options="subjectOption" />
      </van-dropdown-menu>
      <el-table :data="scoreListShow" class="scoreListBox">
        <el-table-column prop="year" label="年份"> </el-table-column>
        <el-table-column prop="lowScore" label="最低分"> </el-table-column>
        <el-table-column prop="averageScore" label="平均分"> </el-table-column>
        <el-table-column prop="controlScore" label="批次分"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { DropdownMenu, DropdownItem } from "vant";
export default {
  props: ["topInfoData", "scoreData"],
  data() {
    return {
      scoreList: {},
      region: "",
      subject: "",
      batch: "",
      regionOption: [],
      subjectOption: [],
      batchOption: []
    };
  },
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem
  },
  computed: {
    scoreListShow: function() {
      let _score = this.scoreList;
      let _region = this.region;
      // let _subject = this.subject;
      let _subject = this.subject === "文科" ? "arts" : "science";
      let _batch = this.batch;
      let _return = [];
      if (_score && _region && _subject && _batch) {
        _return = _score[_subject][_region][_batch];
      }
      return _return;
    }
  },
  watch: {
    scoreData(val) {
      if (Object.keys(val).length > 0) {
        this.scoreList = val;
        this.setSubjectList();
      }
    },
    subjectOption(val) {
      this.subject = val[0].value;
    },
    regionOption(val) {
      let _oldRegion = this.region;
      if (this.arrayFind(val, _oldRegion)) {
        return false;
      }
      if (this.arrayFind(val, "beijing")) {
        this.region = "beijing";
      } else if (this.arrayFind(val, "北京")) {
        this.region = "北京";
      } else {
        this.region = val[0].value;
      }
    },
    batchOption(val) {
      let _oldBatch = this.batch;
      if (this.arrayFind(val, _oldBatch)) {
        return false;
      }
      if (this.arrayFind(val, "本科一批")) {
        this.batch = "本科一批";
        return false;
      } else if (this.arrayFind(val, "本科批")) {
        this.batch = "本科批";
        return false;
      } else {
        this.batch = val[0].value;
      }
    },
    region(val) {
      console.log(val);
      this.setBatchList();
    },
    subject(val) {
      console.log(val);
      this.setRegionList();
    }
  },
  methods: {
    setSubjectList() {
      let _score = this.scoreList;
      let _subjects = Object.keys(_score);
      let _return = [];
      if (_subjects.indexOf("science") !== -1) {
        _return.push({ text: "理科", value: "理科" });
      }
      if (_subjects.indexOf("arts") !== -1) {
        _return.push({ text: "文科", value: "文科" });
      }
      this.subjectOption = _return;
    },
    setRegionList() {
      let _score = this.scoreList;
      let _subject = this.subject === "文科" ? "arts" : "science";
      let _return = [];
      if (_score && _subject && _score[_subject]) {
        _return = Object.keys(_score[_subject]).map(item => {
          return {
            text: item,
            value: item
          };
        });
      }
      this.regionOption = _return;
    },
    setBatchList() {
      let _score = this.scoreList;
      let _region = this.region;
      // let _subject = this.subject;
      let _subject = this.subject === "文科" ? "arts" : "science";
      let _return = [];
      if (_score && _region && _subject) {
        _return = Object.keys(_score[_subject][_region]).map(item => {
          return {
            text: item,
            value: item
          };
        });
      }
      this.batchOption = _return;
    },
    arrayFind(data, str) {
      let _retnrn = data.find(item => {
        return item.value === str;
      });
      return _retnrn ? 1 : 0;
    }
  }
};
</script>
<style lang="less">
.scoreInfoBox {
  width: 100%;
  height: calc(100% - 25.0667vw);
  padding-top: 2.1333vw;
  .topSelect {
    display: flex;
    padding: 4vw;
    > .el-select {
      margin-right: 2.6667vw;
      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
