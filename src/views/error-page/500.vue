<style lang="less">
@import "./500.less";
</style>

<template>
  <div class="error500">
    <div class="error500-body-con">
      <a-card>
        <div class="error500-body-con-title">
          5
          <span class="error500-0-span">
            <a-icon type="rocket"></a-icon>
          </span>
          <span class="error500-0-span">
            <a-icon type="rocket"></a-icon>
            <a-icon type="social-freebsd-devil"></a-icon>
          </span>
        </div>
        <p class="error500-body-con-message">Oops! the server is wrong</p>
        <div class="error500-btn-con">
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
  name: "Error500",
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
