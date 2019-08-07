<template>
  <div class="selectBox subjectSelectBox">
    <template v-if="subjectList[0]">
      <p class="gloupLabel">
        {{ subjectList[0].value }}
      </p>
      <div class="selectGloup">
        <div
          class="selectItem"
          :class="{
            active: !activeSelect || activeSelect === subjectList[0].value
          }"
          @click="changeSubject(subjectList[0])"
        >
          {{ subjectList[0].value }}
        </div>
      </div>
    </template>
    <template v-if="subjectList[1]">
      <div v-for="(item, key) in subjectList[1]" :key="key">
        <p class="gloupLabel">
          {{ key }}
        </p>
        <div class="selectGloup">
          <div
            class="selectItem"
            v-for="(item, index) in item"
            :key="index"
            :class="{ active: activeSelect === item.value }"
            @click="changeSubject(item)"
          >
            {{ item && item.value }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  props: ["subjectList"],
  data() {
    return {
      activeSelect: ""
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
        this.activeSelect = "";
      }
    }
  },
  methods: {
    changeSubject(data) {
      this.activeSelect = data.value;
      this.$nextTick(() => {
        this.$emit("changeSubject", data);
      });
    }
  }
};
</script>
<style lang="less"></style>
