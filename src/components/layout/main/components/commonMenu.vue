<template>
  <a-menu mode="inline" :selectedKeys="[$route.name]" @click="handleClickMenu" :inlineIndent="14">
    <template v-for="item in menuList">
      <a-menu-item
        :key="!item.children ? item.name : item.children[0].name"
        v-if="!item.children || item.children.length <= 1 && item.children[0].name.indexOf('_index') >= 0"
      >
        <a-icon v-if="item.icon" :type="item.icon"></a-icon>
        <!-- <icon-font v-else-if="item.iconfont" :type="item.iconfont" class="menu-iconfont" /> -->
        <span>{{ item.meta.title }}[{{item.meta.keycode}}]</span>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
export default {
  props: {
    menuList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    handleClickMenu({ item, key, keyPath }) {
      this.$emit("on-click",{ item, key, keyPath })
    }
  },
  watch: {},
  mounted() {}
};
</script>
<style lang="less" scoped>
.menu-iconfont {
  font-size: 14px;
  min-width: 14px;
  margin-right: 10px;
}

.ant-menu-inline-collapsed {
  li.ant-menu-item,
  li.ant-menu-submenu {
    .menu-iconfont + span {
      display: inline-block;
      max-width: 0;
      opacity: 0;
    }
  }
}
</style>