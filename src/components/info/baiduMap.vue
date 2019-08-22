<template>
  <baidu-map
    class="toolMapCount baiduMapBox"
    @ready="map_handler"
    :center="center"
    :zoom="map_zoom"
  >
    <bm-marker :position="center"> </bm-marker>
    <bm-panorama anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-panorama>
  </baidu-map>
</template>
<script>
export default {
  props: ["center"],
  data() {
    return {
      map_zoom: 15
    };
  },
  created() {},
  methods: {
    map_handler({ BMap, map }) {
      console.log(BMap);
      map.enableScrollWheelZoom(true);
    }
  }
};
</script>
<style lang="less">
.baiduMapBox {
  width: 348px;
}
</style>
