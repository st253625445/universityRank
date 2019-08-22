<template>
  <el-col :span="8" class="toolItem">
    <div class="toolTitle">{{ $t("infoPage.requireTitle") }}</div>
    <div class="toolItemCount requireBox">
      <ul>
        <li v-for="(value, key) in requireList" :key="key">
          <span class="label">{{ key }}</span>
          <div class="count">
            <div class="bg"></div>
            <div class="requireValue" :style="requireItemStyle(value)">
              {{ requireItemValue(value) }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "requireBox",
  props: ["requireList"],
  data: function() {
    return {};
  },
  computed: {
    requireItemValue() {
      return function(value) {
        return this.requireItemValueFn(value);
      };
    },
    requireItemStyle() {
      return function(value) {
        return this.requireItemStyleFn(value);
      };
    }
  },
  methods: {
    requireItemStyleFn(data) {
      let _right = ((data.all - data.end) / data.all) * 100 + "%";
      let _minW = ((data.end - data.start) / data.all) * 100 + "%";
      let _teturn = {
        right: _right,
        minWidth: _minW
      };
      return _teturn;
    },
    requireItemValueFn(data) {
      if (data.start && data.end) {
        return `${data.start}-${data.end}`;
      } else {
        return `${data.start}` || `${data.end}` || "";
      }
    }
  }
};
</script>

<style lang="less">
.requireBox {
  padding: 40px 20px;
  > ul {
    max-height: 100%;
  }
  li {
    display: flex;
    width: 100%;
    height: 44px;
    .label {
      height: 100%;
      font-size: 14px;
      line-height: 44px;
      min-width: 70px;
      padding-right: 10px;
      text-align: left;
    }
    .count {
      flex: 1;
      position: relative;
      height: 100%;
      border-left: 1px solid #e8e8e8;
    }
    .bg {
      position: absolute;
      width: 100%;
      height: 20px;
      left: 0;
      top: 8px;
      background: #e8e8e8;
    }
    .requireValue {
      position: absolute;
      height: 28px;
      top: 4px;
      padding: 0 10px;
      text-align: center;
      background: #5167dc;
      border-radius: 5px;
      color: #fff;
      font-size: 12px;
      line-height: 28px;
    }
  }
}
</style>
