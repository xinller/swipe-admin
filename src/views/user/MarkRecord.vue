<template>
    <div class="mark-container">
        <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="手动打标">
                <MarkRecordPeople></MarkRecordPeople>
            </a-tab-pane>
            <a-tab-pane key="2" tab="任务打标">
                <MarkRecordTask></MarkRecordTask>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script>
import MarkRecordPeople from './MarkRecordPeople'
import MarkRecordTask from './MarkRecordTask'
export default {
    name: 'MarkRecord',
    components: {
        MarkRecordPeople,
        MarkRecordTask,
    },
    data() {
        return {}
    },
}
</script>

<style lang="less" scoped></style>
