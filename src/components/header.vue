<template>
  <header>
    <div class="app-header">
      <div class="logo">{{ $t("message.title") }}</div>
      <div class="headerNav">
        <el-select
          v-model="selectValue"
          size="mini"
          @change="langChange"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option
        ></el-select>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      selectValue: "",
      options: [
        {
          value: "zh",
          label: "中文"
        },
        {
          value: "en",
          label: "English"
        }
      ]
    };
  },
  created() {
    this.selectValue =
      localStorage.lang == undefined ? "zh" : localStorage.lang;
    document.title =
      this.selectValue === "zh"
        ? "2020年你可排世界大学排名"
        : "2020 NKP Global University Rankings";
  },
  methods: {
    //语言切换
    langChange(e) {
      // console.log(document);
      localStorage.setItem("lang", e);
      this.$i18n.locale = e;
      document.title =
        e === "zh"
          ? "2020年你可排世界大学排名"
          : "NKP Global University Rankings 2020";
    }
  }
};
</script>

<style lang="less">
header {
  width: 100%;
  background: #5167dc;
  .app-header {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 0 auto;
    display: flex;
  }
  .logo {
    flex: 1;
    font-size: 28px;
    text-align: center;
    color: rgb(255, 255, 255);
    line-height: 50px;
  }
  .headerNav {
    position: absolute;
    right: 40px;
    display: flex;
    font-size: 14px;
    color: rgb(255, 255, 255);
    line-height: 50px;
    ul {
      display: flex;
    }
    li {
      padding: 0 20px;
      cursor: pointer;
    }
    .el-select {
      width: 90px;
    }
    .el-input__inner {
      background: transparent;
      color: #fff;
    }
  }
}
</style>
