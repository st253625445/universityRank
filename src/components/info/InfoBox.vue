<template>
  <div class="infoBox" ref="infoBox" :style="{ height: infoBoxHeight }">
    <div class="infoItem" v-for="(value, key) in infoData" :key="key">
      <span class="infiItemLabel">{{ key }}</span>
      <span class="infiItemContent" v-html="value"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: ["infoData"],
  data() {
    return {
      infoBoxHeight: "auto"
    };
  },
  watch: {
    infoData() {
      this.$nextTick(() => {
        let _height = this.$refs.infoBox.clientHeight;
        let _childNodes = this.$refs.infoBox.childNodes;
        let _childHeights = [];
        _childNodes.forEach(item => {
          _childHeights.push(item.clientHeight);
        });
        let defaultH = (_height - 0) / 2;
        let boxH = 0;
        for (let i = 0; i < _childHeights.length; i++) {
          boxH += _childHeights[i] - 0;
          if (boxH >= defaultH) {
            let _leftH = boxH;
            let _rightH = 0;
            _childHeights.slice(i + 1).forEach(item => {
              _rightH += item;
            });
            this.infoBoxHeight = `${_leftH > _rightH ? _leftH : _rightH}px`;
            break;
          } else {
            continue;
          }
        }
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less"></style>
