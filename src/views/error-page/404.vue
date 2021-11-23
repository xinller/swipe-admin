<template>
  <div class="error404">
    <div class="error404-body-con">
      <a-card>
        <div class="error404-body-con-title">
          4
          <span>
            <a-icon type="frown"></a-icon>
          </span>
          4
        </div>
        <p class="error404-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
        <div class="error404-btn-con">
          <a-button @click="goHome" size="large" style="width: 200px;" type="text">返回首页</a-button>
          <a-button
            @click="backPage"
            size="large"
            style="width: 200px;margin-left: 40px;"
            type="primary"
          >返回上一页</a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error404",
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push({
        name: this.appConfig.homepage.name
      });
    }
  }
};
</script>
 <style lang="less" scoped>
@import "./404.less";
</style>
