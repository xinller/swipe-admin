<template>
    <!-- 查看账单 -->
    <a-spin :spinning="spinning" class="bill-container">
        <div class="page-title">筛选</div>
        <div class="bill-form">
            <a-row>
                <a-col class="bill-form-item">
                    <label for="">起止日期</label>
                    <a-range-picker class="v-picker mr-10" @change="dateChange" />
                    <ul class="chs-list">
                        <li :class="['chs-item', { active: date_type == 1 }]" @click="selectDate(1)"><span>今天</span></li>
                        <li :class="['chs-item', { active: date_type == 2 }]" @click="selectDate(2)"><span>昨天</span></li>
                        <li :class="['chs-item', { active: date_type == 3 }]" @click="selectDate(3)"><span>最近一个月</span></li>
                        <li :class="['chs-item', { active: date_type == 4 }]" @click="selectDate(4)"><span>全部</span></li>
                    </ul>
                </a-col>
                <a-col class="bill-form-item">
                    <label for="">交易类型</label>
                    <ul class="chs-list">
                        <li :class="['chs-item', { active: type == '' }]" @click="type = ''"><span>全部</span></li>
                        <li
                            :class="['chs-item', { active: type == item.id }]"
                            v-for="item in trans_list"
                            :key="item.id"
                            @click="type = item.id"
                        >
                            <span>{{ item.type_name }}</span>
                        </li>
                    </ul>
                </a-col>
                <a-col class="bill-form-item">
                    <label for="">任务编号</label>
                    <a-input class="mr-10" v-model="order_code"></a-input>
                    <a-button type="primary" @click="queryEvent">搜索</a-button>
                </a-col>
            </a-row>
        </div>
        <!-- <div class="page-title mt-20">交易汇总</div>
        <div class="bill-collect">
            <span class="bill-collect-item">活动: 货款 +215.98 -41764.00 ， 鲸币 +12.50 -3139.50</span>
            <span class="bill-collect-item">充值: 货款 +40649.00</span>
        </div> -->
        <div class="page-title mt-20">资金流水</div>
        <!-- <a-table :rowKey="(record) => record.id" :pagination="pagination" :columns="dataColumns" :dataSource="dataSource" :scroll="{ x: 1200 }">
            <span class="c-primary pointer" slot="action">详情</span>
        </a-table> -->

        <tableList
            ref="mytableList"
            :pagination="pagination"
            :loadOptions="options"
            :columnsSource="dataColumns"
            rowkeyname="id"
            class="mt-20"
        >
        </tableList>
    </a-spin>
</template>

<script>
import * as api from '@/api/api'
import moment from 'moment'
import tableList from '../../components/business/tableList/index'
export default {
    name: 'bill',
    components: {
        tableList,
    },
    data() {
        return {
            dataColumns: [],
            options: {
                pageUrl: 'member/tradingRecord',
                pageFormData: {},
            },
            pagination: {
                current: 1,
                total: 0,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showSizeChanger: true,
                showQuickJumper: true,
            },
            spinning: false,
            start_time: null,
            end_time: null,
            order_code: '', //任务编号
            type: '',
            date_type: '',
            trans_list: [], //交易类型
        }
    },
    mounted() {
        this.getColums()
        this.queryEvent()
        this.tradingRecordType()
    },
    methods: {
        getColums() {
            this.dataColumns = [
                { dataIndex: 'update_time', title: '交易时间', align: 'center', width: 100 },
                { dataIndex: 'type_name', title: '交易类型', align: 'center', width: 100 },
                { dataIndex: 'amount', title: '交易金额', align: 'center', width: 100 },
                { dataIndex: 'after_amount', title: '余额', align: 'center', width: 100 },
                { dataIndex: 'remark', title: '备注', align: 'center', width: 100 },
                // {
                //     dataIndex: 'action',
                //     title: '操作',
                //     align: 'center',
                //     width: 100,
                //     customRender: (value, row, index) => {
                //         return {
                //             children: <span>详情</span>,
                //         }
                //     },
                // },
            ]
        },
        dateChange(date, dateString) {
            this.start_time = dateString[0]
            this.end_time = dateString[1]
        },
        selectDate(type) {
            this.date_type = type
            if (type == 1) {
                this.start_time = moment().format('YYYY-MM-DD')
                this.end_time = moment()
                    .add(1, 'days')
                    .format('YYYY-MM-DD')
            } else if (type == 2) {
                this.end_time = moment().format('YYYY-MM-DD')
                this.start_time = moment()
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD')
            } else if (type == 3) {
                this.start_time = moment()
                    .subtract(31, 'days')
                    .format('YYYY-MM-DD')
                this.end_time = moment().format('YYYY-MM-DD')
            } else if (type == 4) {
                this.start_time = ''
                this.end_time = ''
            }
        },
        tradingRecordType() {
            api.tradingRecordType().then((res) => {
                if (res.success) {
                    this.trans_list = res.data
                }
            })
        },
        queryEvent() {
            let param = {
                start_time: this.start_time,
                end_time: this.end_time,
                order_code: this.order_code, //任务编号
                type: this.type,
                // page: this.pagination.current,
                // rows: this.pagination.pageSize,
            }
            this.options.pageFormData = { ...param }

            this.refresh_table()
        },
        // 刷新表格
        refresh_table() {
            this.$refs.mytableList.getTableListData(true)
        },
    },
}
</script>

<style lang="less" scoped></style>
