<style lang="less">
@import "./404.less";
</style>

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
                <p class="error404-body-con-message">{{ msg }}</p>
            </a-card>
        </div>
    </div>
</template>

<script>
export default {
    name: "ErrorConfig",
    methods: {},
    data() {
        return {
            msg: this.$route.params.msg,
        };
    },
    mounted() {
        console.log(this.$route);
    },
};
</script>
