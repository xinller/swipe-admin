<template>
    <!-- 黑名单 -->
    <a-spin :spinning="spinning" class="blackList-container">
        <a-row type="flex" align="middle" justify="space-between">
            <a-col :xs="24" :md="12">
                <div>
                    <div class="page-title">黑名单</div>
                    <p>提示：添加黑名单旺旺号，该旺旺号所属账号将永远无法接手自己发布的活动</p>
                </div>
            </a-col>
            <a-col :xs="24" :md="12" class="flexct jus-ed">
                <div class="btn-link mr-10 mt-10" @click="showModal('insert', '批量导入')">批量导入</div>
                <div class="btn-link mr-10 mt-10" @click="exportExcel">批量导出</div>
                <div class="btn-link mt-10" @click="showModal('addBlack', '添加黑名单')">+ 添加黑名单</div>
            </a-col>
        </a-row>
        <tableList
            ref="mytableList"
            isSelection
            :pagination="pagination"
            :loadOptions="options"
            :columnsSource="columns"
            rowkeyname="id"
            operatePosition="bottom"
            :selectionOptions="selectionOptions"
            class="mt-20"
        >
            <a-button :disabled="spinning" slot="operateLeftBefore" @click="DelEvent">批量删除</a-button>
        </tableList>

        <!-- 批量导入 -->
        <a-modal v-model="visible" :footer="null" :title="modal_title">
            <a-spin :spinning="loading">
                <a-row class="upload" :gutter="[16, 16]" v-if="modal_type == 'insert'">
                    <a-col :xs="16">
                        <!-- <input type="file" name="file" @change="fileChange" /> -->
                        <a-upload-dragger name="file" :showUploadList="false" :before-upload="beforeUpload" @change="fileChange">
                            <p class="ant-upload-drag-icon">
                                <a-icon type="cloud-upload" />
                            </p>
                            <p class="ant-upload-hint size-14">将文件拖到此处,或 <span class="c-primary">点击上传</span></p>
                        </a-upload-dragger>
                    </a-col>
                    <a-col :xs="8" class="size-12 c-gray">
                        导入说明： <br />
                        每次最多可导入500条黑名单记录，可导入其他平台的黑号。
                    </a-col>
                    <a-col :xs="24">
                        <p>{{ file.name }}</p>
                        <a href="http://www.aipaymi.online/static/blacklist.xlsx" target="_blank" type="download">下载模版</a>
                    </a-col>
                </a-row>
                <a-form-model v-if="modal_type == 'addBlack'" v-bind="layout" :model="form" :rules="rules" ref="ruleForm">
                    <a-form-model-item label="平台类型" prop="platform_type">
                        <a-select v-model="form.platform_type">
                            <a-select-option value="0">淘宝/天猫</a-select-option>
                            <a-select-option value="1">京东</a-select-option>
                            <a-select-option value="2">拼多多</a-select-option>
                        </a-select>
                    </a-form-model-item>
                    <a-form-model-item label="淘宝账号(旺旺ID)" prop="taobao_account">
                        <a-input v-model="form.taobao_account" />
                    </a-form-model-item>
                    <a-form-model-item label="拉黑原因" prop="black_reason">
                        <a-select placeholder="请选择" v-model="form.black_reason">
                            <a-select-option value="0">评价被删除</a-select-option>
                            <a-select-option value="1">淘宝客</a-select-option>
                            <a-select-option value="2">申请退款</a-select-option>
                            <a-select-option value="3">聊天中提到试用</a-select-option>
                            <a-select-option value="4">垫付金额填错</a-select-option>
                            <a-select-option value="5">拍下未付款</a-select-option>
                            <a-select-option value="6">拍错宝贝</a-select-option>
                            <a-select-option value="7">未按要求评价</a-select-option>
                            <a-select-option value="8">付款方式不对</a-select-option>
                            <a-select-option value="9">预售活动未付款</a-select-option>
                            <a-select-option value="10">预售活动提前付款</a-select-option>
                            <a-select-option value="11">其他</a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-form-model>
                <div class="mt-20 txt-rt">
                    <a-button class="mr-10" type="primary" @click="commitModal">确定</a-button>
                    <a-button @click="visible = false">取消</a-button>
                </div>
            </a-spin>
        </a-modal>
        <ExportTable ref="export_form" :params="params" postUrl="export/blackExport" v-show="false"></ExportTable>
    </a-spin>
</template>

<script>
import * as api from '@/api/api'
import tableList from '../../components/business/tableList/index'
import ExportTable from '../../components/business/ExportTable'
export default {
    name: 'blackList',
    components: {
        tableList,
        ExportTable,
    },
    data() {
        return {
            loading: false,
            spinning: false,
            visible: false,
            modal_type: '',
            modal_title: '',
            columns: [],
            options: {
                pageUrl: 'member/balckList',
                pageFormData: {},
                customRender: [],
            },
            pagination: {
                current: 1,
                total: 100,
                pageSize: 10,
                pageSizeOptions: ['10', '20', '30', '40', '50'],
                showSizeChanger: true,
                showQuickJumper: true,
            },
            layout: {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 },
            },
            form: {
                platform_type: '',
                taobao_account: '',
                black_reason: '',
            },
            rules: {
                platform_type: [{ required: true, message: '请选择平台类型', trigger: 'blur' }],
                taobao_account: [{ required: true, message: '请输入淘宝账号(旺旺ID)', trigger: 'blur' }],
                black_reason: [{ required: true, message: '请选择拉黑原因', trigger: 'blur' }],
            },
            selectedRowKeys: [], //当前选择
            params: {},
            file: '',
            // downUrl: '/static/blacklist.xlsx',
        }
    },
    computed: {
        selectionOptions() {
            const { selectedRowKeys } = this
            return {
                selectedRowKeys,
                onChange: this.onSelectChange,
                hideDefaultSelections: true,
            }
        },
    },
    filters: {},
    mounted() {
        this.getColums()
        // this.getDownUrl()
    },
    methods: {
        getDownUrl() {
            let env = ''
            switch (process.env.VUE_APP_ENV) {
                case 'build':
                    env = 'invite'
                    break
                case 'dev':
                    env = 'inviteTest'
                    break
                case 'buildTest':
                    env = 'inviteTest'
                    break
            }
            this.downUrl = this.appConfig.BASE_URL[env] + 'static/blacklist.xlsx'
        },
        exportExcel() {
            this.$refs.export_form.$el.submit()
        },
        format_type(value) {
            switch (Number(value)) {
                case 0:
                    return '淘宝/天猫'
                case 1:
                    return '京东'
                case 2:
                    return '拼多多'
            }
        },

        format_reason(value) {
            switch (Number(value)) {
                case 0:
                    return '评价被删除'
                case 1:
                    return '淘宝客'
                case 2:
                    return '申请退款'
                case 3:
                    return '聊天中提到试用'
                case 4:
                    return '垫付金额填错'
                case 5:
                    return '拍下未付款'
                case 6:
                    return '拍错宝贝'
                case 7:
                    return '未按要求评价'
                case 8:
                    return '付款方式不对'
                case 9:
                    return '预售活动未付款'
                case 10:
                    return '预售活动提前付款'
                case 11:
                    return '其他'
            }
        },
        getColums() {
            this.columns = [
                {
                    title: '',
                    fixed: '',
                    dataIndex: 'selection-column',
                    key: 'selection-column',
                    width: 40,
                },
                {
                    dataIndex: 'platform_type',
                    title: '账号类型',
                    align: 'center',
                    customRender: (value, row, index) => {
                        return {
                            children: <span>{this.format_type(value)}</span>,
                        }
                    },
                },
                { dataIndex: 'taobao_account', title: '买家账号', align: 'center' },
                { dataIndex: 'create_time', title: '拉黑时间', align: 'center' },
                {
                    dataIndex: 'black_reason',
                    title: '拉黑原因',
                    align: 'center',
                    customRender: (value, row, index) => {
                        return {
                            children: <span>{this.format_reason(value)}</span>,
                        }
                    },
                },
            ]
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys)
            this.selectedRowKeys = selectedRowKeys
        },
        // 刷新表格
        refresh_table() {
            this.$refs.mytableList.getTableListData(true)
        },
        // 批量导入
        showModal(type, title) {
            this.visible = true
            this.modal_type = type
            this.modal_title = title
        },
        beforeUpload(file) {
            return false
        },
        fileChange({ file, fileList }) {
            // fileChange(e) {

            if (file.status == 'removed') return
            this.file = fileList[fileList.length - 1].originFileObj
        },
        commitModal() {
            if (this.modal_type == 'addBlack') {
                // 添加黑名单
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        api.addBalckList(this.form).then((res) => {
                            this.loading = false
                            if (res.success) {
                                this.$message.success('添加成功')
                                this.refresh_table()
                                this.visible = false
                            }
                        })
                    } else {
                        return false
                    }
                })
            } else {
                let file = this.file
                if (!file) return this.$message.warning('请上传文件')
                // 实例化
                let formdata = new FormData()
                formdata.append('file', file)
                api.blackImport(formdata).then((res) => {
                    if (res.success) {
                        this.$message.success(res.data || '导入成功')
                        this.visible = false
                        this.file = ''
                        this.refresh_table()
                    }
                })
            }
        },
        DelEvent() {
            if (this.selectedRowKeys.length == 0) return this.$message.warning('请选择要删除的名单')

            this.spinning = true
            api.batchDeletionBalckList({ id: this.selectedRowKeys.join(',') }).then((res) => {
                this.spinning = false
                if (res.success) {
                    this.$message.success('删除成功')
                    this.refresh_table()
                }
            })
        },
    },
}
</script>

<style lang="less" scoped></style>
