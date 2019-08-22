<template>
  <el-col :span="8" class="toolItem scoreBox">
    <div class="toolTitle">{{ $t("infoPage.scoreTitle") }}</div>
    <div class="toolItemCount">
      <div class="topSelect">
        <el-select size="mini" v-model="scoreSelect.region">
          <el-option
            v-for="(item, index) in regionList"
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
        <el-select size="mini" v-model="scoreSelect.batch">
          <el-option
            v-for="(item, index) in batchList"
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
        <el-table-column prop="averageScore" label="平均分"> </el-table-column>
        <el-table-column prop="controlScore" label="批次分"> </el-table-column>
      </el-table>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "scoreBox",
  props: ["scoreList"],
  data: function() {
    return {
      scoreSelect: {
        region: "",
        subject: "理科",
        batch: ""
      }
    };
  },
  computed: {
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
    }
  },
  watch: {
    subjectList: {
      handler: function(val) {
        this.scoreSelect.subject = val[0];
      },
      immediate: true
    },
    regionList: {
      handler: function(val) {
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
      immediate: true
    },
    batchList: {
      handler: function(val) {
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
      immediate: true
    }
  },
  methods: {}
};
</script>

<style lang="less">
.scoreBox {
  .topSelect {
    display: flex;
    flex-direction: row;
    .el-select--mini {
      &:nth-child(1) {
        width: 60px;
      }
      &:nth-child(2) {
        width: 60px;
      }
      &:nth-child(3) {
        width: 90px;
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
}
</style>
