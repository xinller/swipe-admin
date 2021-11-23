<template>
    <a-tooltip :placement="placement">
        <template slot="title">
            <span class="size-12">
                <slot name="content"></slot>
            </span>
        </template>
        <slot name="tooltext">
            <img src="../../assets/images/task/ques-black.png" class="ques-icon" />
        </slot>
    </a-tooltip>
</template>

<script>
export default {
    name: 'VTooltip',
    props: {
        placement: {
            type: String,
            default: 'topLeft',
        },
        icon_src: {
            type: String,
            default: require('../../assets/images/task/ques-black.png'),
        },
    },
    data() {
        return {}
    },
}
</script>

<style lang="less" scoped>
.ques-icon {
    width: 20px;
    height: 20px;
}
</style>
