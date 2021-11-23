<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :pagination="pagination"
  >
    <a slot="action" slot-scope="text">action</a>
  </a-table>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array,
    },
    dataSource: {
      type: Array,
    },
  },
  data() {
    return {
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40'],
        showQuickJumper: true,
        showSizeChanger: true,
        size: 'small',
      },
    }
  },
}
</script>
