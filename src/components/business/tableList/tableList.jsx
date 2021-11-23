import './index.less';
import request from "@/api/request.js";

import columnSelection from "./columnSelection.jsx";
import filterConfig from "./filterConfig.jsx";

import Uuid from "uuid";
import Vue from 'vue';
const draggingMap = {};
const draggingState = Vue.observable(draggingMap);

export default {
  name: "tableList",
  components: {
    columnSelection,
    filterConfig
  },
  props: {
    filterFormData: {
      type: Object,
      default: () => { }
    },
    exportExcelUrl: {
      type: String,
      default: ""
    },
    isManualControl: {
      type: Boolean,
      default: false
    },
    operatePosition: {
      type: String,
      default: "top"
    },
    ajaxType: {
      type: String,
      default: "POST"
    },
    operateLeftBeforeSlot: {
      type: Function
    },
    operateLeftAfterSlot: {
      type: Function
    },
    operateRightSlot: {
      type: Function
    },
    operateShow: {
      type: Boolean,
      default: false
    },
    operateOptions: {
      type: Object,
      default: () => { }
    },
    isShowIndexs: {
      type: Boolean,
      default: false
    },
    customDirectives: {
      type: Array,
      default: () => []
    },
    tipsSlot: {
      type: Function
    },
    isSelection: {
      type: Boolean,
      default: false
    },
    selectionOptions: {
      type: Object,
      default: () => { }
    },
    footerTotal: {
      type: Boolean,
      default: false
    },
    footerTotalDatas: {
      type: Array,
      default: () => []
    },
    footer: {
      type: Function
    },
    title: {
      type: Function
    },
    customRow: {
      type: Function
    },
    locking: {
      type: Boolean,
      default: false
    },
    resizable: {
      type: Boolean,
      default: true
    },
    resizableMinWidth: {
      type: Number,
      default: 60
    },
    stripe: {
      type: [Boolean, Function],
      default: false
    },
    tableWrapWidth: {
      type: Number
    },
    tableWidth: {
      type: String,
      default: "100%"
    },
    tableHeight: {
      type: Number
    },
    isLazy: {
      type: Boolean,
      default: false
    },
    lazyLimit: {
      type: Number,
      default: 10
    },
    pagination: {
      type: [Boolean, Object],
      default: false
    },
    columnsSource: {
      type: Array,
      default: () => []
    },
    datasSource: {
      type: Array,
      default: () => []
    },
    loadOptions: {
      type: Object,
      default: () => { }
    },
    size: {
      type: String,
      default: "default"
    },
    rowkeyname:{
      type:String,
      default:""
    }
  },
  watch: {
    columnsSource(columns) {
      this.loading = false;
      this.tableColumns = [...columns]
      this.columnSelectionFull = [...columns]
    },
    datasSource(data) {
      this.loading = false;
      this.tableDatas = data
    },
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val
        this.timer = true
        let that = this
        setTimeout(function () {
          // console.log(that.screenWidth)
          that.$forceUpdate();
          that.timer = false
        }, 400)
      }
    }
  },
  computed: {
    pager() {
      if (this.pagination === false) return false
      let option = {
        current: 1,
        total: 0,
        pageSize: 10
      }
      return _.merge({}, option, this.pagination);
    },
    options() {
      let option = {
        headUrl: "",
        pageUrl: "",
        headerFormData: {},
        pageFormData: {}
      };
      return _.merge({}, option, this.loadOptions);
    },
    operateOption() {
      let option = {
        columnSelection: {
          show: true
        },
        filter: {
          show: true
        },
        restore: {
          show: true
        },
        export: {
          show: true
        }
      };
      return _.merge({}, option, this.operateOptions);
    },

    filterFormDatas() {
      let option = {
        filterFindUrl: "",
        filterFindUrlPrefix: {
          find: "dataq/filter/find/",
          save: "dataq/filter/save/",
          delete: "dataq/filter/delete/"
        },
        filterSaveFormData: {
          module: (new Date()).getTime(),
          window: (new Date()).getTime(),
          deptNo: this.$store.state.user.organizationEntity ? this.$store.state.user.organizationEntity.user.dlbmbh : "",
          staffNo: this.$store.state.user.organizationEntity ? this.$store.state.user.organizationEntity.user.ygbh00 : ""
        },
        filterFindFormData: {
          deptNo: this.$store.state.user.organizationEntity ? this.$store.state.user.organizationEntity.user.dlbmbh : ""
        },
        operationUrl: "dataq/api/dict",
        operationFormData: {
          zdmc: "运算符"
        },
        relationUrl: "dataq/api/dict",
        relationFormData: {
          zdmc: "关系符"
        }
      }
      return _.merge({}, option, this.filterFormData);
    }
  },
  data() {
    this.tableComponents = {
      header: {
        cell: this.resizeableTitle
      },
    };
    return {
      tableColumns: [],
      tableDatas: [],
      lazyCurrent: 1,
      lazyCount: 0,
      loading: false,
      uuid: "",
      columnSelectionVisible: false,
      columnSelectionFull: null,
      exportBtnLoading: false,
      filterVisible: false,
      operationLists: [],
      relationLists: [],
      filterParameter: null,
      screenWidth: document.body.clientWidth,
      timer: false
    };
  },
  render() {
    const {
      loading,
      $scopedSlots,
      filterFormDatas,
      operationLists,
      relationLists,
      handleSubmitFilter,
      handleReductionFilter,
      tableWidth,
      operatePosition,
      operateLeftBeforeSlot,
      operateLeftAfterSlot,
      operateRightSlot,
      operateShow,
      operateOption,
      customDirectives,
      footerTotal,
      footerTotalDatas,
      tipsSlot,
      footer,
      title,
      customRow,
      stripe,
      tableWrapWidth,
      tableColumns,
      handleScrollCallback,
      tableHeight,
      pager,
      handleTableChange,
      isLazy,
      tableDatas,
      tableComponents,
      resizable,
      isSelection,
      selectionOptions,
      columnSelectionFull,
      handleChangeColumns,
      isManualControl,
      util,
      uuid,
      size,
      rowkeyname
    } = this;

    let isScrollWidthStatus = this.isScrollWidth();

    const wrapProps = {
      class: ["tableList"],
      style: { width: tableWrapWidth ? `${tableWrapWidth}px` : '100%' }
    }
    const tableProps = {
      ref: 'tableListDom',
      key: uuid,
      refInFor: true,
      props: {
        bordered: true,
        rowKey: (record, index) => rowkeyname?record[rowkeyname]:index,
        columns: tableColumns,
        dataSource: tableDatas,
        size: util.tableChangeSize(size),
        scroll: { x: isScrollWidthStatus ? 10 : 0, y: tableHeight ? tableHeight : 0 }
      },
      attrs: {},
      on: {
        change: handleTableChange
      }
    }

    const tableDirectives = {
      directives: []
    }

    /* 自定义页脚 */
    if (_.isFunction(footer)) {
      tableProps.props.footer = footer
    }

    /* 页脚合计 */
    if (footerTotal && isScrollWidthStatus) {
      tableDirectives.directives.push({
        name: "table-footer-scroll"
      })
    }

    /* 自定义页头 */
    if (_.isFunction(title)) {
      tableProps.props.title = title
    }

    /* 拖拽缩放 */
    if (resizable) {
      tableProps.props.components = tableComponents
    }

    /* 斑马纹 */
    if (_.isBoolean(stripe) && stripe) {
      tableProps.props.rowClassName = util.tableZebraStripe
    } else if (_.isFunction(stripe)) {
      tableProps.props.rowClassName = stripe
    }

    /* 分页 */
    if (this.pagination !== false) {
      tableProps.props.pagination = { ...pager }
    } else {
      tableProps.props.pagination = false
    }

    /* 懒加载 */
    if (isLazy) {
      //防止分页冲突
      tableProps.props.pagination = false
      if (!tableHeight) {
        console.error("props is tableHeight cannot be empty!!!")
      } else {
        tableDirectives.directives.push({
          name: "table-lazy",
          value: handleScrollCallback
        })
      }
    }

    /* 自定义指令 */
    if (customDirectives.length) {
      customDirectives.forEach(item => {
        if (item.name == "hotkey") {
          tableProps.attrs["data-hotkey-enable"] = true
        }
      })
      tableDirectives.directives = _.concat(tableDirectives.directives, customDirectives)
    }

    /* 可选择 */
    if (isSelection) {
      tableProps.props.rowSelection = selectionOptions
    }

    /* 行事件 */
    if (_.isFunction(customRow)) {
      tableProps.props.customRow = customRow
    }

    /* 列选择 */
    const columnSelectionProps = {
      ref: 'columnSelectionDom',
      props: {
        columnSelectionFull,
        tableColumns,
        size
      },
      on: {
        onChangeColumns: handleChangeColumns
      }
    }

    /* 过滤 */
    const filterConfigProps = {
      ref: 'filterConfigDom',
      props: {
        size,
        filterFormData: filterFormDatas,
        operationList: operationLists ? operationLists : [],
        relationList: relationLists ? relationLists : [],
        tableColumns: columnSelectionFull ? columnSelectionFull : tableColumns
      },
      on: {
        onSubmit: handleSubmitFilter,
        onReduction: handleReductionFilter
      }
    }

    //操作区
    const operateRender = () => {
      return (
        <div class={{ "clearfix": true, "mb-5": operatePosition == "top", "mt-5": operatePosition == "bottom" }}>
          <div class="fl">
            {_.isFunction(operateLeftBeforeSlot) ? operateLeftBeforeSlot() : null}
            {$scopedSlots.operateLeftBefore ? $scopedSlots.operateLeftBefore() : null}
            {operateShow ? <div class="fl"><a-button-group size={size}>
              {operateOption.columnSelection.show ? <a-button onClick={this.onShowColumnSelection}>列选择</a-button> : null}
              {operateOption.filter.show ? <a-button onClick={this.filters}>过滤</a-button> : null}
              {operateOption.restore.show ? <a-button onClick={this.operateRestore}>还原</a-button> : null}
              {operateOption.export.show ? <a-button loading={this.exportBtnLoading} onClick={this.exportExcel}>导出</a-button> : null}
            </a-button-group></div> : null}
            {_.isFunction(operateLeftAfterSlot) ? operateLeftAfterSlot() : null}
            {$scopedSlots.operateLeftAfter ? $scopedSlots.operateLeftAfter() : null}
          </div>
          <div class="fr">
            {_.isFunction(operateRightSlot) ? operateRightSlot() : null}
            {$scopedSlots.operateRight ? $scopedSlots.operateRight() : null}
          </div>
        </div>
      )
    }
    // console.info(2222, isScrollWidthStatus)
    let isShowHandleSlot = operateShow || operateLeftBeforeSlot || operateLeftAfterSlot || operateRightSlot || $scopedSlots.operateLeftBefore || $scopedSlots.operateLeftAfter || $scopedSlots.operateRight
    return (
      <div ref="tablelistWrap" {...wrapProps}>
        <a-spin size={size} spinning={loading}>
          {isShowHandleSlot && operatePosition == "top" ? operateRender() : null}
          <div style={{ width: tableWidth }}>
            <a-table
              {...tableProps}
              {...{ ...tableDirectives }}
            >
              {this.footerTotal ? <template slot="footer">
                <a-table
                  class="footer-total-table"
                  rowKey={Math.random}
                  bordered={false}
                  pagination={false}
                  columns={tableColumns}
                  dataSource={footerTotalDatas}
                  showHeader={false}
                  size={size}
                  scroll={{ x: isScrollWidthStatus ? 100 : 0 }}
                ></a-table>
              </template> : ""}

            </a-table>
          </div>
          {$scopedSlots.tips ? $scopedSlots.tips() : null}
          {_.isFunction(tipsSlot) ? tipsSlot() : null}
          {isShowHandleSlot && operatePosition == "bottom" ? operateRender() : null}
        </a-spin>
        {isShowHandleSlot && operateOption.columnSelection.show || isManualControl ? <columnSelection v-model={this.columnSelectionVisible} {...columnSelectionProps}></columnSelection> : null}
        {isShowHandleSlot && operateOption.filter.show || isManualControl ? <filterConfig v-model={this.filterVisible} {...filterConfigProps}></filterConfig> : null}
      </div >
    )
  },
  mounted() {
    this.uuid = Uuid.v1();
    this.init();
    const that = this;
    window.onresize = () => {
      return (function () {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    async init() {
      this.loading = true;
      if (this.options.headUrl != "") {
        await this.getTableHeaderData();
      }
      if (!this.locking) {
        if (this.options.pageUrl != "") {
          await this.getTableListData();
        }
      }
      if ((this.operateShow && this.operateOption.filter.show) || this.isManualControl) {
        await this.getFilterDict()
      }
      this.loading = false;
    },
    isScrollWidth() {
      let b = false;
      let width = 0;
      this.tableColumns.forEach(item => {
        if (item.width != undefined) {
          width = width + parseInt(item.width)
        }
      })
      if (width != NaN || width > 0) {
        let _refs = this.$refs.tablelistWrap
        if (_refs && width > _refs.offsetWidth) {
          b = true
        }
      }
      return b;
    },
    //生成表头数据
    renderColumns(res) {
      let customRender = this.options.customRender ? this.options.customRender : null
      let customCell = this.options.customCell ? this.options.customCell : null
      let columns = res
        .map(item => {
          if (item.hidden == undefined || !item.hidden) {
            let _item = {
              title: item.title,
              fixed: item.fixed,
              dataIndex: item.key,
              key: item.key,
              ora_name: item.ora_name,
              filter_name: item.filter_name,
              align: item.align,
              width: item.width == "" ? "" : parseInt(item.width),
              sorter: item.sortable,
              ellipsis: item.ellipsis,
              className: item.className
            };

            if (_.isArray(customRender)) {
              let defaultIndex = _.findIndex(customRender, function (o) { return o.key == 'defaultRender'; });
              customRender.forEach(itemRender => {
                if (itemRender.key == "defaultRender" && defaultIndex > -1) {
                  _item.customRender = customRender[defaultIndex].render
                }
                if (item.key == itemRender.key) {
                  _item.customRender = itemRender.render
                }
              })
            }

            if (_.isArray(customCell)) {
              customCell.forEach(itemRender => {
                if (item.key == itemRender.key) {
                  _item.customCell = itemRender.cell
                }
              })
            }

            return _item
          }
        })
        .filter(item => {
          return item != undefined;
        });
      if (this.isSelection) {
        let selectItem = [{
          title: "",
          fixed: "",
          dataIndex: "selection-column",
          key: "selection-column",
          width: 40
        }]
        columns = _.concat(selectItem, columns)
      }
      if (this.isShowIndexs) {
        let isFixed = "";
        columns.forEach(item => {
          if (item.fixed == "left") {
            isFixed = "left"
          }
        })
        let indexItem = [{
          title: "序号",
          fixed: isFixed,
          align: "center",
          dataIndex: "column-indexs",
          key: "column-indexs",
          width: 40,
          customRender: (value, row, index) => {
            return {
              children: (
                <span>{++index}</span>
              )
            }
          }
        }]
        columns = _.concat(indexItem, columns)
      }
      if (this.resizable) {
        columns.forEach(col => {
          draggingMap[col.key] = col.width;
        });
      }
      return columns;
    },
    //获取列表表头数据
    async getTableHeaderData() {
      let params = this.options.headerFormData;
      try {
        let _data =
          _.toUpper(this.ajaxType) == "POST" ? { data: params } : { params };
        let res = await request({
          method: this.ajaxType,
          url: this.options.headUrl,
          ..._data
        });
        let _columns = this.renderColumns(res.data);
        this.tableColumns = [..._columns]
        this.columnSelectionFull = [..._columns]
        this.$emit("onHeaderLoad", this.tableColumns);
      } catch (err) { }
    },
    //获取列表数据
    async getTableListData(isRest) {
      this.loading = true;
      let params = {
        page: this.isLazy ? isRest && isRest == true ? this.lazyCurrent = 1 : this.lazyCurrent : this.pager.current,
        rows: this.isLazy ? this.lazyLimit : this.pager.pageSize
      };
      //过滤条件
      if (this.filterParameter != null) {
        params.filterParameter = JSON.stringify(this.filterParameter)
      }
      if (!this.isLazy && this.pagination && isRest && isRest == true) {
        params.page = this.pager.current = 1
      }
      params = _.merge({}, params, this.options.pageFormData);
      try {
        let _data =
          _.toUpper(this.ajaxType) == "POST" ? { data: params } : { params };
        let res = await request({
          method: this.ajaxType,
          url: this.options.pageUrl,
          ..._data
        });
        let resData = res.data.list
        if (this.isLazy) {
          if (isRest && isRest == true) {
            this.$refs.tableListDom[0].$el.getElementsByClassName('ant-table-body')[0].scrollTop = 0
            this.lazyCurrent = 1;
            this.tableDatas = resData;
          } else {
            this.tableDatas = _.concat(this.tableDatas, resData);
          }
          this.lazyCount = res.data.total;
        } else {
          this.tableDatas = resData;
          if (this.pagination !== false) {
            this.pager.total = res.data.total;
          }
        }
        this.$emit("onPageLoad", this.isLazy ? this.lazyCurrent : this.pager, this.isLazy ? this.tableDatas : res.data.list, res);
      } catch (err) { }
      this.loading = false;
    },
    //表格发生变化
    handleTableChange(pagination, filters, sorter) {
      if (this.options.pageUrl != "") {
        if (!_.isEmpty(pagination)) {
          this.pager.current = pagination.current;
          this.pager.pageSize = pagination.pageSize;
        }
        if (!_.isEmpty(sorter) && sorter.column) {
          let key = sorter.column.key;
          let type = _.replace(sorter.order, 'end', '');
          this.options.pageFormData.orderBy = `${key} ${type}`;
        } else {
          this.options.pageFormData.orderBy = undefined;
        }
        this.getTableListData();
      } else {
        this.loading = true;
      }
      this.$emit("onTableCheng", pagination, filters, sorter);
    },
    //懒加载数据
    handleScrollCallback() {
      if (this.options.pageUrl != "") {
        if (this.lazyCount < this.lazyCurrent * this.lazyLimit) return;
        this.lazyCurrent++
        this.getTableListData();
      } else {
        this.loading = true;
      }
      this.$emit("onLazyCheng", this.lazyCurrent);
    },
    //显示列选择
    onShowColumnSelection() {
      this.columnSelectionVisible = true
    },
    //列选择回调
    handleChangeColumns(list) {
      this.tableColumns = this.columnSelectionFull.map(item => {
        if (_.indexOf(list, item.key) != -1) {
          return item
        }
      }).filter(item => { return item != undefined })
      if (!this.isScrollWidthStatus) {
        this.tableColumns = this.tableColumns.map(item => {
          let _item = { ...item }
          if (item.fixed != "") _item.fixed = ""
          return _item
        })
      }
    },
    //还原
    operateRestore() {
      this.tableColumns = [...this.columnSelectionFull]
      this.handleReductionFilter()
    },
    //拖拽缩放
    resizeableTitle(h, props, children) {
      try {
        let thDom = null;
        const { key, ...restProps } = props;
        const col = this.tableColumns.find(col => {
          const k = col.dataIndex || col.key;
          return k === key;
        });
        if (!col.width) {
          return <th {...restProps}>{children}</th>;
        }
        const onDrag = x => {
          draggingState[key] = 0;
          if (Math.max(x, 1) < this.resizableMinWidth) return;
          col.width = Math.max(x, 1);
        };

        const onDragstop = () => {
          if (thDom.getBoundingClientRect().width < this.resizableMinWidth) return;
          draggingState[key] = thDom.getBoundingClientRect().width;
        };
        return (
          <th
            {...restProps}
            v-ant-ref={r => (thDom = r)}
            width={col.width}
            class="resize-table-th"
          >
            {children}
            <draggable-resizable
              key={col.key}
              class="table-draggable-handle"
              w={10}
              x={draggingState[key] || col.width}
              z={1}
              axis="x"
              draggable={true}
              resizable={false}
              onDragging={onDrag}
              onDragstop={onDragstop}
            ></draggable-resizable>
          </th>
        );
      } catch (err) { 
        // console.info(err)
      }
    },
    //导出Excel
    async exportExcel() {
      if (this.exportExcelUrl == "") {
        console.error('参数：exportExcelUrl; 导出接口地址不能为空！！！')
      } else {
        this.exportBtnLoading = true
        let params = _.merge({}, this.options.pageFormData);
        try {
          let _title = []
          this.tableColumns.forEach(item => {
            if (item.key != "action") {
              _title.push({
                "titleName": item.title,
                "titleKey": item.key
              })
            }
          })
          _title = JSON.stringify(_title)
          let _data = null;
          if (_.toUpper(this.ajaxType) == "POST") {
            _data = { data: params }
            _data.data.title = _title
          } else {
            _data = { params }
            _data.params.title = _title
          }

          let res = await request({
            responseType: 'blob',
            method: this.ajaxType,
            url: this.exportExcelUrl,
            ..._data
          });
          if (res) {
            const time = (new Date()).getTime()
            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            const link = document.createElement('a')
            const href = window.URL.createObjectURL(blob)
            link.href = href
            link.download = time + '.xls'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link) // 下载完成移除元素
            window.URL.revokeObjectURL(href) // 释放掉blob对象
            this.exportBtnLoading = false
            this.$emit("onExportBack", true)
          } else {
            this.$message.error("导出失败！！！")
            this.exportBtnLoading = false
            this.$emit("onExportBack", false)
          }
        } catch (err) {
          this.exportBtnLoading = false
          this.$emit("onExportBack", false)
          this.$message.error("导出失败！！！")
        }
      }
    },
    //加载过滤字典
    async getFilterDict() {
      //获取运算符字典
      let operationdata = { zdmc: this.filterFormDatas.operationFormData.zdmc }
      let operationListsRes = await this.requestFilterDict("POST", this.filterFormDatas.operationUrl, operationdata)
      this.operationLists = operationListsRes ? operationListsRes : []
      //获取关系符字典
      let relationdata = { zdmc: this.filterFormDatas.relationFormData.zdmc }
      let relationListsRes = await this.requestFilterDict("POST", this.filterFormDatas.relationUrl, relationdata)
      this.relationLists = relationListsRes ? relationListsRes : []
    },
    async requestFilterDict(method, url, data) {
      try {
        let res = await request({ method, url, data });
        return res.data.payload;
      } catch (err) {
        return [];
      }
    },
    //显示过滤弹窗
    filters() {
      this.filterVisible = true;
    },
    //过滤确认
    handleSubmitFilter(res) {
      this.filterParameter = res
      this.getTableListData(true)
    },
    //过滤还原
    handleReductionFilter() {
      this.filterParameter = null
      this.getTableListData(true)
    },
    //清空表格数据
    emptyTableLists() {
      this.tableDatas = []
      if (this.isLazy) {
        this.lazyCurrent = 1;
      } else if (this.pagination) {
        this.pager.current = 1;
        this.pager.total = 0;
      }
      this.$emit("onPageLoad", this.isLazy ? this.lazyCurrent : this.pager, this.tableDatas, null);
    }
  }
};