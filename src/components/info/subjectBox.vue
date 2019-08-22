<template>
  <el-col :span="8" class="toolItem subjectBox">
    <div class="toolTitle">{{ $t("infoPage.subjectBoxTitle") }}</div>
    <div class="toolItemCount">
      <p v-for="(item, index) in labels" :key="index" class="subjectItem">
        <span class="label">{{ item }}</span>
        <span class="value">{{ subjectData[item] }}</span>
      </p>
    </div>
  </el-col>
</template>
<script>
export default {
  name: "subjectBox",
  props: ["subjectData"],
  data: function() {
    return {
      labels: ["本科专业", "硕士点", "博士点", "博士后", "国家重点学科"]
    };
  },
  methods: {}
};
</script>

<style lang="less">
.subjectBox {
  .subjectItem {
    display: flex;
    height: 44px;
    align-items: center;
    line-height: 20px;
    font-size: 14px;
    .label {
      position: relative;
      display: inline-block;
      width: 110px;
      text-indent: 16px;
      &::before {
        position: absolute;
        content: "";
        left: 0;
        top: 0;
        width: 8px;
        height: 20px;
        background: #5066dc;
      }
    }
    .value {
      flex: 1;
    }
  }
}
</style>
