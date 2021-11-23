<template>
    <a-spin :spinning="spinning" class="fundDetail-container">
        <a-row type="flex" justify="center" class="mt-15">
            <a-col :md="24" :xl="20" :xxl="18">
                <a-card class="fund-card">
                    <table class="gridtable">
                        <tr>
                            <th colspan="4">淘宝基础收费标准</th>
                        </tr>
                        <tr>
                            <td colspan="3" class="td-center">活动条件</td>
                            <td class="td-center">鲸币数</td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.base" :key="'base' + index">
                            <td v-if="index > 0">试客基础赏金</td>
                            <td :colspan="index == 0 ? '3' : 2">{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                    </table>
                </a-card>
                <a-card class="fund-card" v-if="dataInfo">
                    <table class="gridtable">
                        <tr>
                            <th colspan="3">免费设置浏览条件</th>
                        </tr>
                        <tr>
                            <td colspan="2" class="td-center">活动条件</td>
                            <td class="td-center">鲸币数</td>
                        </tr>
                        <tr v-if="dataInfo.free.length > 0">
                            <td :rowspan="dataInfo.free.length + 1">主宝贝浏览</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.free" :key="'free' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                    </table>
                </a-card>
                <a-card class="fund-card" v-if="dataInfo">
                    <table class="gridtable">
                        <tr>
                            <th colspan="3">淘宝增值服务收费标准</th>
                        </tr>
                        <tr>
                            <td colspan="2" class="td-center">活动条件</td>
                            <td class="td-center">鲸币数</td>
                        </tr>

                        <tr v-if="dataInfo.value.length > 0">
                            <td :rowspan="dataInfo.value.length + 1">增值服务</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.value" :key="'value' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                        <tr v-if="dataInfo.pre.length > 0">
                            <td :rowspan="dataInfo.pre.length + 1">预售</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.pre" :key="'pre' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                        <tr v-if="dataInfo.member.length > 0">
                            <td :rowspan="dataInfo.member.length + 1">买家等级</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.member" :key="'member' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                        <tr v-if="dataInfo.taovalue.length > 0">
                            <td :rowspan="dataInfo.taovalue.length + 1">淘气值收费标准</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.taovalue" :key="'tq' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                        <tr v-if="dataInfo.confirm.length > 0">
                            <td :rowspan="dataInfo.confirm.length + 1">确认收货</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.confirm" :key="'confirm' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>

                        <tr v-if="dataInfo.confirm_time.length > 0">
                            <td :rowspan="dataInfo.confirm_time.length + 1">完成时间</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.confirm_time" :key="'conf_time' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                        <tr v-if="dataInfo.week.length > 0">
                            <td :rowspan="dataInfo.week.length + 1">周点击</td>
                            <td style="display: none;"></td>
                            <td class="td-center" style="display: none;"></td>
                        </tr>
                        <tr v-for="(item, index) in dataInfo.week" :key="'week' + index">
                            <td>{{ item.title }}</td>
                            <td class="td-center">{{ item.parameter_val }}</td>
                        </tr>
                    </table>
                </a-card>
            </a-col>
        </a-row>
    </a-spin>
</template>

<script>
import * as api from '@/api/api'
export default {
    name: 'fundDetail',
    data() {
        return {
            spinning: false,
            dataInfo: '',
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            this.spinning = true
            api.tariffDescription().then((res) => {
                this.spinning = false
                if (res.success) {
                    this.dataInfo = res.data
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
