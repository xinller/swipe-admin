<template functional>
  <a-sub-menu
    v-on="listeners"
    v-bind="data.attrs"
    :key="data.attrs.menuInfo.name"
  >
    <span slot="title">
      <a-icon v-if="data.attrs.menuInfo.icon" :type="data.attrs.menuInfo.icon" />
      <!-- <icon-font v-else-if="data.attrs.menuInfo.iconfont" :type="data.attrs.menuInfo.iconfont" class="menu-iconfont"/> -->
      <span>{{data.attrs.menuInfo.meta.title}}</span>
    </span>
    <template v-for="item in data.attrs.menuInfo.children">
      <a-menu-item
        v-if="!item.children"
        :key="item.name"
      >
        <a-icon v-if="item.icon" :type="item.icon" />
        <!-- <icon-font v-else-if="item.iconfont" :type="item.iconfont" class="menu-iconfont"/> -->
        <span>{{item.meta.title}}</span>
      </a-menu-item>
      <sub-menu
        v-else
        :menuInfo="item"
        :key="item.name"
      />
    </template>
  </a-sub-menu>
</template>
