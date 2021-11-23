<template>
    <!-- 等待转账 -->
    <div class="index-container">
        <div class="tabs-container">
            <a-tabs type="card" :animated="true" size="small">
                <a-tab-pane key="0" tab="等待转账">
                    <WaitTransfer></WaitTransfer>
                </a-tab-pane>
                <a-tab-pane key="1" tab="转账结果">
                    <TransferRes></TransferRes>
                </a-tab-pane>
                <a-tab-pane key="2" tab="未到账反馈">
                    <UnFeedback></UnFeedback>
                </a-tab-pane>
                <a-tab-pane key="3" tab="卖家已返款">
                    <SellerReturn></SellerReturn>
                </a-tab-pane>
                <a-tab-pane key="4" tab="买家已退款">
                    <BuyerReturn></BuyerReturn>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script>
import WaitTransfer from './WaitTransfer'
import TransferRes from './TransferRes'
import UnFeedback from './UnFeedback'
import BuyerReturn from './BuyerReturn'
import SellerReturn from './SellerReturn'
export default {
    name: 'index',
    components: {
        WaitTransfer,
        TransferRes,
        UnFeedback,
        BuyerReturn,
        SellerReturn,
    },
    data() {
        return {
            visible: true,
        }
    },
}
</script>

<style lang="less" scoped></style>
