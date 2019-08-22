<template>
  <el-col :span="8" class="toolItem">
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
  </el-col>
</template>

<script>
export default {
  name: "securityBox",
  props: ["securityData"],
  data: function() {
    return {
      securityOption: [],
      securitySelect: ""
    };
  },
  computed: {
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
    securityData: {
      handler: function(val) {
        this.securityOption = Object.keys(val).sort((a, b) => b - a);
        this.securitySelect = this.securityOption[0];
      },
      immediate: true
    }
  },
  methods: {}
};
</script>

<style scoped></style>
