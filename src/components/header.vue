<template>
  <header>
    <div class="app-header">
      <div class="logo">{{ $t("message.title") }}</div>
      <div class="headerNav">
        <!-- <ul>
          <li>首页</li>
          <li>全球大学</li>
          <li>学院</li>
        </ul> -->
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
    <div class="adcolumn"></div>
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
  },
  methods: {
    //语言切换
    langChange(e) {
      // console.log(e)
      localStorage.setItem("lang", e);
      this.$i18n.locale = e;
    }
  }
};
</script>

<style lang="less">
header {
  width: 100%;
  background: #303483;
  .app-header {
    width: 1200px;
    height: 60px;
    margin: 0 auto;
    display: flex;
  }
  .logo {
    flex: 1;
    font-size: 30px;
    text-align: left;
    color: rgb(255, 255, 255);
    line-height: 60px;
  }
  .headerNav {
    display: flex;
    font-size: 16px;
    color: rgb(255, 255, 255);
    line-height: 50px;
    padding-top: 10px;
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
  .adcolumn {
    width: 100%;
    height: 200px;
    background: #ffe63e;
  }
}
</style>
