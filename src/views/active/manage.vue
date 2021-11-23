<template>
    <div class="ac-manage-container pt-15">
        <div class="tabs-container">
            <a-tabs type="card" :animated="true" size="small">
                <a-tab-pane key="1" tab="活动列表">
                    <ActiveList></ActiveList>
                </a-tab-pane>
                <a-tab-pane key="2" tab="模版列表">
                    <TemplateList></TemplateList>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import ActiveList from './ActiveList'
import TemplateList from './TemplateList'
export default {
    name: 'activeManage',
    components: {
        ActiveList,
        TemplateList,
    },
    data() {
        return {}
    },
}
</script>

<style lang="less" scoped></style>
