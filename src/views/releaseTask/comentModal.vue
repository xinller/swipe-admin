<template>
    <a-modal
        class="coment_modal_page"
        :title="modalTitle"
        :visible="isVisible"
        :confirm-loading="confirmLoading"
        @ok="modalOk"
        @cancel="modalCancel"
    >
        <div class="coment-wrap">
            <!-- 追评 -->
            <div class="flexct mb-10" v-if="modal_type == 'add'">
                <label class="mr-10">追评类型:</label>
                <a-select style="width:200px" v-model="recoment_type" @change="chooseType">
                    <a-select-option :value="item.id" v-for="item in list" :key="item.id">{{ item.title }}</a-select-option>
                </a-select>
                <span class="c-red ml-10" v-if="recoment_type">{{ add_evaluate_price }}鲸币</span>
            </div>
            <!-- 优质评价 -->
            <div class="coment-list" v-if="modal_type == 3">
                <div class="coment-item" v-for="(item, index) in evaluate_words_list1" :key="index">
                    <label style="width:60px">评价{{ index + 1 }}</label>
                    <a-textarea class="mlr-10" :max-length="500" placeholder="最多500字" v-model="item.comment"></a-textarea>
                    <span class="c-primary" @click="deleteList(index)">删除</span>
                </div>
            </div>
            <!-- 图文评价 -->
            <div v-if="modal_type == 4">
                <div class="coment-list" v-for="(item, index) in evaluate_words_list2" :key="index">
                    <div class="coment-item">
                        <label style="width:60px">评价{{ index + 1 }}</label>
                        <a-textarea class="mlr-10" :max-length="500" placeholder="最多500字" v-model="item.comment"></a-textarea>
                        <span class="c-primary" @click="deleteList(index)">删除</span>
                    </div>
                    <div class="clearfix coment-ft">
                        <ul class="upload-list-container">
                            <li class="upload-item" v-for="(ite, idx) in item.images" :key="idx">
                                <img :src="ite" />
                                <div class="delete"><a-icon @click="deleteImage(index, idx)" type="delete"></a-icon></div>
                            </li>
                            <li class="upload-item upload-box" v-if="item.images.length < 5">
                                <input @change="fileUpload($event, index)" type="file" class="file-input" />
                                <div class="upload-add"><a-icon type="plus"></a-icon></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 追加评价 -->
            <div v-if="modal_type == 'add'">
                <div class="coment-list" v-for="(item, index) in evaluate_words_list3" :key="index">
                    <div class="coment-item">
                        <label style="width:60px">评价{{ index + 1 }}</label>
                        <a-textarea class="mlr-10" :max-length="500" placeholder="最多500字" v-model="item.comment"></a-textarea>
                        <span class="c-primary" @click="deleteList(index)">删除</span>
                    </div>
                    <div class="clearfix coment-ft">
                        <ul class="upload-list-container">
                            <li class="upload-item" v-for="(ite, idx) in item.images" :key="idx">
                                <img :src="ite" />
                                <div class="delete"><a-icon @click="deleteImage(index, idx)" type="delete"></a-icon></div>
                            </li>
                            <li class="upload-item upload-box" v-if="item.images.length < 5">
                                <input @change="fileUpload($event, index)" type="file" class="file-input" />
                                <div class="upload-add"><a-icon type="plus"></a-icon></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="coment-ft ">
                <div class="size-12">
                    注：试客会根据亲提供的评价内容和图片进行评价(图片请勿重复使用，每个评价最多最多可添加5张图片)
                </div>
                <a-button class="mt-15" @click="addList">+新增</a-button>
            </div>
        </div>
    </a-modal>
</template>
<script>
import * as api from '@/api/api'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}
export default {
    props: {
        visible: {
            type: Boolean,
        },
        modalType: {
            type: String,
        },
        evaluate_type_list: {
            type: Array,
        },
        add_evaluate_words: {
            type: Array,
        },
        buyer_words: {
            type: Array,
        },
        add_evaluate_type: {
            type: String,
        },
    },
    watch: {
        visible(val) {
            this.isVisible = val
            if (val) {
                this.list = this.evaluate_type_list
                this.chooseType()
            }
        },
        modalType(val) {
            this.modal_type = this.modalType
            this.getModalTitle(val)
        },
        add_evaluate_words(val) {
            console.log('val', val)
            _.each(val, (v) => {
                if (v.images) {
                    v.images = typeof v.images == 'string' ? v.images.split(',') : v.images
                } else {
                    v.images = []
                }
            })
            console.log(val)
            this.evaluate_words_list3 = val
        },
        buyer_words(val) {
            console.log('val', val)
            _.each(val, (v) => {
                if (v.images) {
                    v.images = typeof v.images == 'string' ? v.images.split(',') : v.images
                } else {
                    v.images = []
                }
            })
            this.evaluate_words_list1 = val
            this.evaluate_words_list2 = val
        },
        add_evaluate_type(val) {
            this.recoment_type = Number(val)
        },
    },
    data() {
        return {
            BASE_URL: this.BASE_URL,
            modalTitle: '', //评价类型
            modal_type: this.modalType,
            list: this.evaluate_type_list,
            recoment_type: '', //请选择追评时间
            add_evaluate_price: 0, //追平价格
            ModalText: 'Content of the modal',
            isVisible: this.visible,
            confirmLoading: false,

            previewVisible: false,
            previewImage: '',
            fileList: [], //图片列表

            buyer_evaluate_words: [],

            evaluate_words_list1: [{ comment: '', images: [] }],
            evaluate_words_list2: [{ comment: '', images: [] }],
            evaluate_words_list3: [{ comment: '', images: [] }],
            hasEpt: false,
        }
    },
    methods: {
        // 获取标题
        getModalTitle(type) {
            if (type == 3) {
                this.modalTitle = '添加优质好评'
            } else if (type == 4) {
                this.modalTitle = '添加图文评价'
            } else if (type == 'add') {
                this.modalTitle = '添加追加评价'
            }
        },
        // 新增
        addList() {
            if (this.modal_type == 3) {
                this.evaluate_words_list1.push({ comment: '', images: [] })
            } else if (this.modal_type == 4) {
                this.evaluate_words_list2.push({ comment: '', images: [] })
            } else if (this.modal_type == 'add') {
                this.evaluate_words_list3.push({ comment: '', images: [] })
            }
        },
        // 删除
        deleteList(index) {
            if (this.modal_type == 3) {
                this.evaluate_words_list1.splice(index, 1)
            } else if (this.modal_type == 4) {
                this.evaluate_words_list2.splice(index, 1)
            } else if (this.modal_type == 'add') {
                this.evaluate_words_list3.splice(index, 1)
            }
        },
        // 删除图片
        deleteImage(index, idx) {
            if (this.modal_type == 4) {
                this.evaluate_words_list2[index]['images'].splice(idx, 1)
            } else if (this.modal_type == 'add') {
                this.evaluate_words_list3[index]['images'].splice(idx, 1)
            }
        },
        // 上传图片
        async fileUpload(e, index) {
            let file = e.target.files[0]
            console.log('file', e)
            if (!file) return
            let fileBase64 = await getBase64(file)
            api.image_upload({ base_str: fileBase64, type: 2 }).then((res) => {
                if (res.success) {
                    console.log(res)
                    let url = this.BASE_URL + res.data
                    if (this.modal_type == 4) {
                        let list = this.evaluate_words_list2[index]
                        list.images.push(url)
                        this.$set(this.evaluate_words_list2, index, list)
                    } else if (this.modal_type == 'add') {
                        let list = this.evaluate_words_list3[index]
                        list.images.push(url)
                        this.$set(this.evaluate_words_list3, index, list)
                    }
                }
            })
        },
        // 切换追评类型
        chooseType() {
            let obj = _.find(this.list, (v) => v.id == this.recoment_type)
            console.log('obj', obj)
            this.add_evaluate_price = obj ? obj['parameter_val'] : 0
        },
        // 确定
        modalOk() {
            let buyer_evaluate_words = []
            if (this.modal_type == 3) {
                var list = [...this.evaluate_words_list1]
                buyer_evaluate_words = this.hasEmpty(list)
            } else if (this.modal_type == 4) {
                var list = [...this.evaluate_words_list2]
                buyer_evaluate_words = this.hasEmpty(list)
            } else if (this.modal_type == 'add') {
                if (!this.recoment_type) return this.$message.warning('请选择追评类型')
                var list = [...this.evaluate_words_list3]
                buyer_evaluate_words = this.hasEmpty(list)
            }
            this.$emit('toggleModal', {
                type: this.modal_type,
                buyer_evaluate_words: buyer_evaluate_words,
                add_evaluate_price: this.add_evaluate_price,
                add_evaluate_type: this.recoment_type,
            })
        },
        hasEmpty(list) {
            _.each(list, (v) => {
                if (!v.comment) {
                    return this.$message.warning('请完善评价内容')
                }
                v.images = v.images ? v.images.join() : ''
            })
            return list
        },
        // 取消
        modalCancel() {
            this.$emit('toggleModal', { cancel: true })
        },
    },
}
</script>
<style lang="less" scoped></style>
