<template>
  <div class="tags-nav">
    <div class="close-con">
      <a-dropdown placement="bottomRight" style="margin-top:7px;">
        <a-button size="small" type="text">
          <a-icon type="down" />
        </a-button>
        <a-menu slot="overlay" @click="handleTagsOption">
          <a-menu-item key="all">关闭所有</a-menu-item>
          <a-menu-item key="others">关闭其他</a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="btn-con left-btn">
      <a-button type="text" @click="handleScroll(240)">
        <a-icon type="left" />
      </a-button>
    </div>
    <div class="btn-con right-btn">
      <a-button type="text" @click="handleScroll(-240)">
        <a-icon type="right" />
      </a-button>
    </div>
    <div
      class="scroll-outer"
      ref="scrollOuter"
      @DOMMouseScroll="handlescroll"
      @mousewheel="handlescroll"
    >
      <div ref="scrollBody" class="scroll-body" :style="{left: tagBodyLeft + 'px'}">
        <template v-for="(item, index) in list">
          <span
            ref="tagsPageOpened"
            :key="item.name"
            :name="item.name"
            class="page-tags"
            @click="handleClick(item)"
            :class="isCurrentTag(item)? 'closable':''"
          >
            {{itemTitle(item)}}
            <a-icon
              type="close"
              v-if="item.name===appConfig.homepage.name? false:true"
              @click.stop="handleClose(item,index)"
            />
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    list: {
      required: true,
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tagBodyLeft: 0,
      rightOffset: 40,
      outerPadding: 10,
      menuList: {
        others: "关闭其他",
        all: "关闭所有"
      }
    };
  },
  computed: {
    currentRouteObj() {
      const { name, params, query } = this.value;
      return { name, params, query };
    }
  },
  watch: {
    $route(to) {
      this.getTagElementByName(to.name);
    }
  },
  methods: {
    handlescroll(e) {
      var type = e.type;
      let delta = 0;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      this.handleScroll(delta);
    },
    handleScroll(offset) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft;
          } else {
            this.tagBodyLeft = Math.max(
              this.tagBodyLeft + offset,
              outerWidth - bodyWidth
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
    },
    handleTagsOption(type) {
      if (type.key == "all") {
        // 关闭所有，除了home
        let res = this.list.filter(
          item => item.name === this.appConfig.homepage.name
        );
        this.$store.commit("setTagNavList", res);
        this.$router.push({
          name: this.appConfig.homepage.name
        });
      } else {
        // 关闭除当前页和home页的其他页
        let res = this.list.filter(
          item =>
            this.util.routeEqual(this.currentRouteObj, item) ||
            item.name === this.appConfig.homepage.name
        );
        this.$store.commit("setTagNavList", res);
        setTimeout(() => {
          this.getTagElementByName(this.currentRouteObj.name);
        }, 100);
      }
    },
    handleClose(route, index) {
      let res = this.list.filter(item => !this.util.routeEqual(route, item));
      this.$store.commit("setTagNavList", res);
      if (this.$route.name === route.name) {
        let item = res.length == index ? res[index - 1] : res[index];
        this.$router.push(item);
      }
    },
    handleClick(item) {
      this.$router.push(item);
    },
    isCurrentTag(item) {
      return this.util.routeEqual(this.value, item);
    },
    getTagElementByName(name) {
      this.$nextTick(() => {
        this.refsTag = this.$refs.tagsPageOpened;
        this.refsTag.forEach((item, index) => {
          if (name === item.getAttribute("name")) {
            this.moveToView(item);
          }
        });
      });
    },
    moveToView(tag) {
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      const bodyWidth = this.$refs.scrollBody.offsetWidth;
      if (bodyWidth < outerWidth) {
        this.tagBodyLeft = 0;
      } else if (tag.offsetLeft < -this.tagBodyLeft) {
        // 标签在可视区域左侧
        this.tagBodyLeft = -tag.offsetLeft + this.outerPadding;
      } else if (
        tag.offsetLeft > -this.tagBodyLeft &&
        tag.offsetLeft + tag.offsetWidth < -this.tagBodyLeft + outerWidth
      ) {
        // 标签在可视区域
        this.tagBodyLeft = Math.min(
          0,
          outerWidth - tag.offsetWidth - tag.offsetLeft - this.outerPadding
        );
      } else {
        // 标签在可视区域右侧
        this.tagBodyLeft = -(
          tag.offsetLeft -
          (outerWidth - this.outerPadding - tag.offsetWidth)
        );
      }
    },
    itemTitle(item) {
      return this.util.showTitle(item, this);
    }
  },
  mounted() {
    setTimeout(() => {
      this.getTagElementByName(this.$route.name);
    }, 200);
  }
};
</script>
<style lang="less">
.tag-nav-wrapper {
  background: #f0f0f0;
  height: 40px;
  overflow: hidden;
  padding: 0;
}
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.size {
  width: 100%;
  height: 100%;
}
.tags-nav {
  position: relative;
  .no-select;
  .size;
  .close-con {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 32px;
    background: #f0f0f0;
    text-align: center;
    z-index: 10;
    button {
      position: relative;
      top: -4px;
      border: 0;
      border-radius: 2px;
      background: #fff;
      &:hover {
        color: #000;
      }
    }
  }
  .btn-con {
    position: absolute;
    top: 0px;
    height: 100%;
    background: #f0f0f0;
    z-index: 10;
    button {
      position: relative;
      top: -4px;
      padding: 12px 4px;
      line-height: 14px;
      text-align: center;
      color: #999;
      border: 0;
      background-color: #f0f0f0;
      box-shadow: none;
      &:hover {
        color: #000;
      }
    }
    &.left-btn {
      left: 0px;
    }
    &.right-btn {
      right: 32px;
      /* border-right: 1px solid #f0f0f0; */
    }
  }
  .scroll-outer {
    position: absolute;
    left: 21px;
    right: 54px;
    top: 0;
    bottom: 0;
    /* box-shadow: 0px 0 3px 2px rgba(100, 100, 100, 0.1) inset; */
    .scroll-body {
      height: ~"calc(100% - 1px)";
      display: inline-block;
      padding: 3px 10px 0;
      position: absolute;
      overflow: visible;
      white-space: nowrap;
      transition: left 0.3s ease;
      .page-tags {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-size: 14px;
        font-variant: tabular-nums;
        line-height: 1.5;
        list-style: none;
        font-feature-settings: "tnum";
        display: inline-block;
        height: 22px;
        margin-right: 5px;
        padding: 0 7px;
        font-size: 12px;
        line-height: 20px;
        white-space: nowrap;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        opacity: 1;
        transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        &.closable {
          color: #fff;
        }
      }
    }
  }
}
</style>