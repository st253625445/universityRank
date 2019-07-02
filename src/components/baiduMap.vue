<template>
  <baidu-map
    class="toolMapCount baiduMapBox"
    @ready="map_handler"
    :zoom="map_zoom"
  >
    <bm-panorama anchor="BMAP_ANCHOR_BOTTOM_RIGHT"></bm-panorama>
  </baidu-map>
</template>
<script>
export default {
  data() {
    return {
      map_zoom: 15
    };
  },
  methods: {
    map_handler({ BMap, map }) {
      map.enableScrollWheelZoom(true);
      let local = new BMap.LocalSearch(map, {
        renderOptions: { map: map }
      });
      local.search(this.$route.query.cnName);
      local.setPageCapacity(5);
      local.disableFirstResultSelection();
      local.setSearchCompleteCallback(res => {
        if (res.Ar.length) {
          let _point = res.Ar[0].point;
          this.$nextTick(() => {
            map.centerAndZoom(_point, 15);
          });
        }
      });
    }
  }
};
</script>
<style lang="less">
.baiduMapBox {
  width: 348px;
}
</style>
