<template>
    <div
      v-if="!loading && dataSource.list != null && dataSource.list.length == 0"
    >
      <NoData :msg="noDataMsg"></NoData>
    </div>
    <div class="skeleton" v-if="loading">
      <el-skeleton :row="2" animated></el-skeleton>
    </div>
    <div v-for="item in dataSource.list" >
      <slot :data="item"></slot>
    </div>
    <div class="pagination">
      <el-pagination
        v-if="dataSource.pageTotal > 1"
        background
        layout="prev, pager, next"
        :total="dataSource.totalCount"
        :current-page.sync="dataSource.pageNo"
       
        @current-change="handlePageNoChange"
        style="text-align: right"
        :page-size="15"
      ></el-pagination>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    dataSource: {
      type: Object,
    },
    loading: {
      type: Boolean,
    },
    noDataMsg: {
      type: String,
      default: "空空如也",
    },
  });
  
  const emit = defineEmits(["loadData"]);
  const handlePageNoChange = (pageNo) => {
    props.dataSource.pageNo = pageNo;
    emit("loadData");
    // console.log(pageNo)
  };
  </script>
  
  <style lang="scss">
  .pagination {
    padding: 10px 0px 10px 10px;
  }
  .skeleton {
    padding: 15px;
  }
  </style>