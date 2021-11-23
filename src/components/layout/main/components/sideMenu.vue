<template>
    <a-menu mode="inline" :selectedKeys="[$route.name]" @click="handleClickMenu" :inlineIndent="14" :openKeys="openKeys" @openChange="onOpenChange">
        <template v-for="item in menuList">
            <a-menu-item
                :key="!item.children ? item.name : item.children[0].name"
                v-if="!item.children || (item.children.length <= 1 && item.children[0].name.indexOf('_index') >= 0)"
            >
                <!-- <a-icon v-if="item.icon" :type="item.icon"></a-icon> -->
                <img v-if="!item.children" :src="$route.name == item.name ? item.icon_on : item.icon" class="menu-icon" />
                <img v-else :src="$route.name == item.children[0].name ? item.icon_on : item.icon" class="menu-icon" />
                <span>{{ item.meta.title }}</span>
            </a-menu-item>
            <sub-menu v-else :menuInfo="item" :key="item.name" />
        </template>
    </a-menu>
</template>

<script>
import SubMenu from './SubMenu'
export default {
    components: {
        'sub-menu': SubMenu,
    },
    props: {
        menuList: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            rootSubmenuKeys: [],
            openKeys: [],
        }
    },
    computed: {
        collapsed() {
            return this.$store.state.app.collapsed
        },
    },
    methods: {
        onOpenChange(openKeys) {
            const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1)
            if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                this.openKeys = openKeys
            } else {
                this.openKeys = latestOpenKey ? [latestOpenKey] : []
            }
        },
        updateOpenKeys() {
            this.openKeys = this.$route.matched.map((item) => item.name)
        },
        handleClickMenu({ item, key, keyPath }) {
            this.$emit('on-click', { item, key, keyPath })
        },
    },
    watch: {
        $route(to) {
            this.updateOpenKeys()
        },
        collapsed(val) {
            if (val) this.openKeys = []
        },
    },
    mounted() {
        this.updateOpenKeys()
    },
}
</script>
<style lang="less" scoped>
.menu-icon {
    width: 20px;
    margin-right: 14px;
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
