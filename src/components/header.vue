<template>
  <header>
    <div class="app-header">
      <div class="backHome" @click="backHome" v-if="$route.name !== 'home'">
        {{ $t("message.backHome") }}
      </div>
      <div class="logo">{{ $t("message.title") }}</div>
      <div class="headerNav">
        <span @click="langChange">{{ languageText }}</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      languageText: "English",
      language: "zh"
    };
  },
  created() {
    this.language = localStorage.lang == undefined ? "zh" : localStorage.lang;
  },
  watch: {
    language: {
      handler(nVal) {
        document.title =
          nVal === "zh"
            ? "2020年由你排世界大学排名"
            : "2020 UniRank Global University Rankings";
        this.languageText = nVal === "zh" ? "English" : "中文";
      },
      immediate: true
    }
  },
  methods: {
    //语言切换
    langChange() {
      let _lan = this.language === "zh" ? "en" : "zh";
      localStorage.setItem("lang", _lan);
      this.$i18n.locale = _lan;
      this.language = _lan;
    },
    // 返回首页
    backHome() {
      this.$router.push({
        path: "/"
      });
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
  .backHome {
    position: absolute;
    left: 50%;
    margin-left: -570px;
    font-size: 14px;
    color: rgb(255, 255, 255);
    line-height: 50px;
    cursor: pointer;
  }
  .headerNav {
    position: absolute;
    right: 50%;
    margin-right: -570px;
    display: flex;
    font-size: 14px;
    color: rgb(255, 255, 255);
    line-height: 50px;
    span {
      cursor: pointer;
    }
  }
}
</style>
