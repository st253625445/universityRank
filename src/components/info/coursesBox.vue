<template>
  <el-row class="toolItem coursesBox">
    <div class="toolTitle">{{ $t("infoPage.coursesTitle") }}</div>
    <div class="topSelect" v-if="locale === 'zh'">
      <el-select size="mini" v-model="coursesType">
        <el-option
          v-for="(item, index) in coursesOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="moreButton" @click="moreLink">
      {{ $t("infoPage.moreButton") }}
    </div>
    <div class="toolItemCount">
      <div
        class="coursesItem"
        v-for="(item, index) in coursesLists"
        :key="index"
        @click="coursesLink(item.url)"
      >
        <div class="coursesItemImg">
          <el-image :src="item.image_url"></el-image>
        </div>
        <p class="coursesTitle">{{ item.title }}</p>
      </div>
    </div>
  </el-row>
</template>

<script>
export default {
  name: "coursesBox",
  props: ["coursesData"],
  data: function() {
    return {
      coursesType: "course_163",
      coursesOptions: [
        {
          label: "网易公开课",
          value: "course_163",
          url: "https://open.163.com/ocw/"
        },
        {
          label: "edX",
          value: "course_edx",
          url: "https://www.edx.org/schools-partners"
        }
      ]
    };
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    },
    coursesLists: function() {
      if (this.coursesType && this.coursesData[this.coursesType]) {
        let _list = this.coursesData[this.coursesType].slice(0, 4);
        return _list;
      }
      return [];
    }
  },
  watch: {
    locale: {
      handler: function(val) {
        if (val === "en") {
          this.coursesType = "course_edx";
        }
        if (val === "zh") {
          this.coursesType = "course_163";
        }
      },
      immediate: true
    }
  },
  methods: {
    coursesLink(val) {
      if (val) {
        window.open(val, "_blank");
      }
    },
    moreLink() {
      let urls = "";
      if (this.coursesType === "course_163") {
        urls = this.coursesOptions[0].url;
      } else if (this.coursesType === "course_edx") {
        urls = this.coursesOptions[1].url;
      } else {
        urls = "";
      }
      window.open(urls, "_blank");
    }
  }
};
</script>

<style lang="less">
.coursesBox {
  .topSelect {
    position: absolute;
    top: 5px;
    left: 100px;
  }
  .moreButton {
    position: absolute;
    width: 90px;
    top: 5px;
    right: 0;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background: #5066dc;
    border-radius: 4px;
  }
  .toolItemCount {
    display: flex;
    flex-direction: row;
    width: calc(100% + 20px) !important;
    min-height: 200px !important;
    left: -10px;
  }
  .coursesItem {
    width: 25%;
    padding: 0 10px;
  }
  .coursesItemImg {
    height: 150px;
  }
  .coursesTitle {
    font-size: 12px;
    line-height: 20px;
    margin-top: 12px;
    color: #101010;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
