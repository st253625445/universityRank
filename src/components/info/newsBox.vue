<template>
  <el-col :span="16" class="toolItem newsBox">
    <div class="toolTitle">{{ $t("infoPage.newsTitle") }}</div>
    <div class="topSelect" v-if="isChinaUnvi">
      <el-select size="mini" v-model="newsType">
        <el-option
          v-for="(item, index) in newsOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="toolItemCount">
      <ul class="newsList">
        <li
          class="newsItem"
          v-for="(item, index) in newsList"
          :key="index"
          @click="newsLink(item.url)"
        >
          <p class="newsTitle">{{ item.title }}</p>
          <p class="newsInfo">
            <span class="newsSource">{{ item.source }}</span>
            <span class="newsTime"> {{ item.time }}</span>
          </p>
        </li>
      </ul>
    </div>
  </el-col>
</template>

<script>
export default {
  name: "newsBox",
  props: ["isChinaUnvi", "newsData"],
  data: function() {
    return {
      newsType: "",
      newsOptions: [
        {
          label: "中文资讯",
          value: "zh"
        },
        {
          label: "英文资讯",
          value: "en"
        }
      ]
    };
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    },
    newsList: function() {
      if (this.newsType && this.newsData[this.newsType]) {
        let _list = this.newsData[this.newsType].slice(0, 6);
        return _list;
      }
      return [];
    }
  },
  watch: {
    locale: {
      handler: function(val) {
        if (this.isChinaUnvi) {
          this.newsType = val;
        }
      }
    },
    isChinaUnvi: {
      handler: function(val) {
        if (val) {
          this.newsType = "zh";
        } else {
          this.newsType = "en";
        }
      },
      immediate: true
    }
  },
  methods: {
    newsLink(val) {
      if (val) {
        window.open(val, "_blank");
      }
    }
  }
};
</script>

<style lang="less">
.newsBox {
  .topSelect {
    position: absolute;
    top: 5px;
    left: 100px;
  }
  .el-select--mini {
    width: 120px;
  }
  .toolItemCount {
    min-height: 220px !important;
  }
  .newsList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .newsItem {
    width: 48%;
    &:nth-child(2n) {
      margin-left: 4%;
    }
    &:hover {
      .newsTitle {
        color: #007aff;
      }
    }
  }
  .newsTitle {
    width: 100%;
    font-size: 16px;
    line-height: 24px;
    color: #101010;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 12px;
  }
  .newsInfo {
    font-size: 12px;
    color: #888888;
    line-height: 18px;
    margin-bottom: 12px;
    .newsTime {
      display: inline-block;
      margin-left: 20px;
    }
  }
}
</style>
