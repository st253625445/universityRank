<template>
  <div class="selectBox subjectSelectBox">
    <p class="gloupLabel">
      {{ locale === "zh" ? "综合排名" : "Overall Ranking" }}
    </p>
    <div class="selectGloup">
      <div
        class="selectItem"
        :class="{ active: activeIndex === 0 }"
        @click="changeSubject(0)"
      >
        {{ subjectList[0] && subjectList[0].value }}
      </div>
    </div>
    <p class="gloupLabel">
      {{ locale === "zh" ? "学科分类" : "Subject Rankings" }}
    </p>
    <div class="selectGloup">
      <div
        class="selectItem"
        v-for="(item, index) in subjectList.slice(1)"
        :key="index"
        :class="{ active: activeIndex === index + 1 }"
        @click="changeSubject(index + 1)"
      >
        {{ item && item.value }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["subjectList"],
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
    locale: function() {
      return this.$i18n.locale;
    }
  },
  watch: {
    subjectList: {
      handler(nVal) {
        console.log(nVal);
        this.activeIndex = 0;
      }
    }
  },
  methods: {
    changeSubject(data) {
      this.activeIndex = data;
      this.$nextTick(() => {
        this.$emit("changeSubject", data);
      });
    }
  }
};
</script>
<style lang="less"></style>
