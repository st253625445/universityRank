<template>
  <div class="infoPage">
    <div class="page-container">
      <div class="infoBox">
        <p class="name">{{ infoData.name }}</p>
        <p class="title">基本信息</p>
        <ul>
          <li>
            <span class="infoTitle">中文名</span>
            <p>{{ infoData.infobox.name }}</p>
          </li>
          <li>
            <span class="infoTitle">外文名</span>
            <p>Tsinghua University</p>
          </li>
          <li>
            <span class="infoTitle">简称</span>
            <p>清华</p>
          </li>
          <li>
            <span class="infoTitle">创办时间</span>
            <p>1911年</p>
          </li>
          <li>
            <span class="infoTitle">类别</span>
            <p>公立大学</p>
          </li>
          <li>
            <span class="infoTitle">类型</span>
            <p>综合</p>
          </li>
          <li>
            <span class="infoTitle">属性</span>
            <p>综合</p>
          </li>
        </ul>
        <img src="" alt="" class="logoImg" />
        <p class="desText">{{ infoData.des }}</p>
      </div>
      <div class="newsBox"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { getDetailBySch } from "@/API/getData";
export default {
  name: "info",
  data() {
    return {
      infoData: {}
    };
  },
  components: {},
  mounted() {
    let query = this.$route.query;
    if (query.name) {
      this.getDetailBySch(query);
    }
  },
  methods: {
    // 请求大学信息
    getDetailBySch(data) {
      getDetailBySch(data).then(res => {
        console.log(res);
        this.infoData = res.data;
      });
    }
  }
};
</script>

<style lang="less">
.infoPage {
  min-height: calc(100% - 260px);
  .infoBox {
    position: relative;
    width: 900px;
    padding: 20px;
    text-align: left;
    .name {
      font-size: 30px;
      color: rgb(0, 0, 0);
    }
    .title {
      font-size: 14px;
      line-height: 50px;
      color: rgb(0, 0, 0);
    }
    ul {
      width: 600px;
    }
    li {
      display: flex;
      font-size: 14px;
      line-height: 24px;
      color: rgb(102, 102, 102);
    }
    .infoTitle {
      width: 80px;
      color: rgb(51, 51, 51);
    }
    .logoImg {
      position: absolute;
      width: 200px;
      height: 200px;
      right: 20px;
      top: 20px;
      border: 1px solid #eeeeee;
    }
    .desText {
      margin-top: 30px;
      text-indent: 2em;
      font-size: 14px;
      color: rgb(102, 102, 102);
    }
  }
  .newsBox {
    flex: 1;
    margin: 20px 0;
    border: 1px solid #eeeeee;
  }
}
</style>
