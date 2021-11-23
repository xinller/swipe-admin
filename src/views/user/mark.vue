<template>
    <!-- 打标神器 -->
    <div class="mark-container">
        <div class="tabs-container">
            <a-tabs type="card" :animated="true" size="small">
                <a-tab-pane key="1" tab="单宝贝打标">
                    <MarkSigle></MarkSigle>
                </a-tab-pane>
                <a-tab-pane key="2" tab="批量打标">
                    <MarkAll></MarkAll>
                </a-tab-pane>
                <a-tab-pane key="3" tab="手淘搜索打标说明">
                    <MarkExplain></MarkExplain>
                </a-tab-pane>
                <a-tab-pane key="4" tab="打标记录">
                    <MarkRecord></MarkRecord>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import MarkSigle from './MarkSigle'
import MarkAll from './MarkAll'
import MarkExplain from './MarkExplain'
import MarkRecord from './MarkRecord'
export default {
    name: 'mark',
    components: {
        MarkSigle,
        MarkAll,
        MarkExplain,
        MarkRecord,
    },
    data() {
        return {}
    },
}
</script>

<style lang="less" scoped></style>
