<template>
  <header>
    <div class="app-header">
      <div class="logo">2019乌镇智库世界大学排名</div>
      <div class="headerNav">
        <ul>
          <li>首页</li>
          <li>全球大学</li>
          <li>学院</li>
        </ul>
      </div>
    </div>
    <div class="adcolumn"></div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="less">
header {
  width: 100%;
  background: #303483;
  .app-header {
    width: 1200px;
    height: 60px;
    margin: 0 auto;
    display: flex;
  }
  .logo {
    flex: 1;
    font-size: 30px;
    text-align: left;
    color: rgb(255, 255, 255);
    line-height: 60px;
  }
  .headerNav {
    font-size: 16px;
    color: rgb(255, 255, 255);
    line-height: 50px;
    padding-top: 10px;
    ul {
      display: flex;
    }
    li {
      padding: 0 20px;
      cursor: pointer;
    }
  }
  .adcolumn {
    width: 100%;
    height: 200px;
    background: #ffe63e;
  }
}
</style>
