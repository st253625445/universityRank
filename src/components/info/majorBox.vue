<template>
  <el-col :span="8" class="toolItem majorBox">
    <div class="toolTitle">{{ $t("infoPage.majorTitle") }}</div>
    <div class="toolItemCount">
      <div class="topSelect">
        <el-select size="mini" v-model="subjectSelect">
          <el-option
            v-for="(item, index) in subjectOptions"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-select size="mini" v-model="greadSelect">
          <el-option
            v-for="(item, index) in greadOptions"
            :key="index"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <el-row>
        <el-col>
          <el-table :data="subjectShow" height="185" class="tableBox">
            <el-table-column width="60" prop="code" label="代码">
            </el-table-column>
            <el-table-column prop="value" label="学科名"> </el-table-column>
            <el-table-column width="60" prop="code2" label="代码">
            </el-table-column>
            <el-table-column prop="value2" label="学科名"> </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "majorBox",
  props: ["majorData"],
  data: function() {
    return {
      subjectOptions: [],
      subjectSelect: "",
      greadOptions: [],
      greadSelect: ""
    };
  },
  computed: {
    subjectShow: function() {
      let _data = this.majorData;
      let _return = [];
      if (this.subjectSelect && this.greadSelect) {
        let _values = _data[this.subjectSelect][this.greadSelect];
        let _array = [];
        for (const key in _values) {
          if (_values.hasOwnProperty(key)) {
            _array.push({
              code: key,
              value: _values[key]
            });
          }
        }
        for (let i = 0; i < _array.length; i++) {
          if (i % 2 === 0) {
            _return.push(_array[i]);
          } else {
            _return[(i - 1) / 2]["code2"] = _array[i].code;
            _return[(i - 1) / 2]["value2"] = _array[i].value;
          }
        }
      }
      return _return;
    }
  },
  watch: {
    majorData: {
      handler: function(val) {
        this.subjectOptions = Object.keys(val);
        if (this.subjectOptions.length) {
          this.subjectSelect = this.subjectOptions[0];
        }
      },
      immediate: true,
      deep: true
    },
    subjectSelect: {
      handler: function(val) {
        this.greadOptions = Object.keys(this.majorData[val]);
        if (this.subjectOptions.length) {
          this.greadSelect = this.greadOptions[0];
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {}
};
</script>

<style lang="less">
.majorBox {
  .topSelect {
    display: flex;
    flex-direction: row;
    .el-select--mini {
      &:nth-child(1) {
        width: 100px;
      }
      &:nth-child(2) {
        width: 60px;
      }
    }
  }
  .tableBox {
    width: 100%;
    height: 185px;
    margin-top: 15px;
    .cell {
      text-align: center;
      line-height: 30px;
    }
    td {
      padding: 0;
      font-size: 12px;
      color: #101010;
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
