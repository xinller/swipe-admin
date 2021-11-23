

<template>
  <div class="error403">
    <div class="error403-body-con">
      <a-card>
        <div class="error403-body-con-title">
          4
          <span class="error403-0-span">
            <a-icon type="bell"></a-icon>
          </span>
          <span class="error403-key-span">
            <a-icon size="220" type="thunderbolt-fill"></a-icon>
          </span>
        </div>
        <p class="error403-body-con-message">You don't have permission</p>
        <div class="error403-btn-con">
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
  name: "Error403",
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
@import "./403.less";
</style>