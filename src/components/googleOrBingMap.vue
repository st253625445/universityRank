<template>
  <gmap-map
    ref="gmapRef"
    class="toolMapCount baiduMapBox"
    :center="center"
    :zoom="map_zoom"
    :scroll-wheel-zoom="true"
  >
    <gmap-marker :position="center" :dragging="true"></gmap-marker>
  </gmap-map>
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
  mounted() {},
  methods: {}
};
</script>
