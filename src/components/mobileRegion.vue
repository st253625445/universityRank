<template>
  <div class="selectBox regionSelectBox">
    <p class="gloupLabel">
      {{ locale === "zh" ? "全球排名" : "Global Ranking" }}
    </p>
    <div class="selectGloup">
      <div
        class="selectItem"
        @click="changeRegion($t('mobilePage.globalText'))"
        :class="{ active: activeValue === $t('mobilePage.globalText') }"
      >
        {{ $t("mobilePage.globalText") }}
      </div>
    </div>
    <p class="gloupLabel">{{ locale === "zh" ? "热门地区" : "Hot Regions" }}</p>
    <div class="selectGloup">
      <div
        class="selectItem"
        v-for="(item, index) in hotRegion"
        :key="index"
        @click="changeRegion(item)"
        :class="{ active: activeValue === item }"
      >
        {{ item }}
      </div>
    </div>
    <p class="gloupLabel">
      {{ locale === "zh" ? "按洲查找" : "Search by Region" }}
    </p>
    <el-collapse accordion>
      <el-collapse-item
        v-for="(item, index) in regionList"
        :key="index"
        :title="item && item.label"
      >
        <div class="selectGloup" v-if="item.children">
          <div
            class="selectItem"
            v-for="(item2, index2) in item.children"
            :key="index2"
            @click="changeRegion(item2.label)"
            :class="{ active: activeValue === item2.label }"
          >
            {{ item2.label }}
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  props: ["continentList", "countryList"],
  data() {
    return {
      activeValue: "",
      regionList: [],
      hotRegion: []
    };
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    }
  },
  mounted() {
    this.activeValue = this.locale === "zh" ? "全球" : "Global";
  },
  watch: {
    locale: {
      handler(val) {
        if (val === "zh") {
          this.hotRegion = [
            "中国",
            "美国",
            "英国",
            "澳大利亚",
            "中国香港",
            "加拿大",
            "新西兰",
            "日本",
            "德国",
            "法国"
          ];
        } else {
          this.hotRegion = [
            "China",
            "United States",
            "United Kingdom",
            "Australia",
            "China - HongKong",
            "Canada",
            "New Zealand",
            "Japan",
            "Germany",
            "France"
          ];
        }
      },
      immediate: true
    },
    countryList: {
      handler(val) {
        this.regionList = [];
        this.continentList.forEach(item => {
          this.regionList.push({
            value: item,
            label: item,
            children: []
          });
        });
        val.forEach(item => {
          for (let i = 0; i < this.regionList.length; i++) {
            if (item.continent === this.regionList[i].label) {
              this.regionList[i].children.push({
                value: item.country_cn || item.country_en,
                label: item.country_cn || item.country_en
              });
              break;
            } else {
              continue;
            }
          }
        });
      }
    }
  },
  methods: {
    changeRegion(data) {
      this.activeValue = data;
      this.$emit("changeRegion", data);
    }
  }
};
</script>
