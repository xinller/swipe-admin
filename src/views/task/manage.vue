<template>
    <!-- 任务管理 -->
    <div class="pt-15">
        <div class="tabs-container">
            <a-tabs type="card" :animated="true" size="small" @change="changeTab">
                <a-tab-pane key="1" tab="已发布任务">
                    <taskList :isRefresh="isRefresh"></taskList>
                </a-tab-pane>
                <a-tab-pane key="2" tab="未发布任务">
                    <unTaskList :isRefresh="isRefresh"></unTaskList>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import taskList from './taskList'
import unTaskList from './unTaskList'
export default {
    name: 'taskManage',
    components: {
        taskList,
        unTaskList,
    },
    data() {
        return {
            isRefresh: false,
        }
    },
    methods: {
        changeTab() {
            this.isRefresh = !this.isRefresh
        },
    },
}
</script>

<style lang="less" scoped></style>
