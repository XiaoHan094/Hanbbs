<template>
  <div class="container-body search-center" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
    <!-- <div class="search-panel" 
    :style= "{'padding-top:'startSearch ? '0px' : searchPanelHeight + 'px' }"
    > -->
    <div class="search-panel">
      <el-form :model="formData" 
      :rules="rules" 
      ref="formDataRef" 
      @submit.prevent>
        <!--input输入-->
        <el-form-item prop="keyword">
          <el-input 
          size="large" 
          clearable 
          placeholder="输入你想要查找的关键词" 
          v-model="formData.keyword" 
          @keyup.enter="search"
            @focus="startSearchHandler" 
            @change="changeInput">
            <template #suffix>
              <span 
              class="iconfont icon-search" 
              @click="search"
                @blur="formData.keyword = $event.target.value.trim()"></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

      <div class="article-list">
                <DataList 
                :loading="loading" 
                :dataSource="articleListInfo" 
                @loadData="search"
                noDataMsg="此关键词没有相关文章哦">
                    <template #default="{ data }">
                        <ArticleListItem 
                        :data="data"
                        :htmlTitle="true"
                        ></ArticleListItem>
                    </template>
                </DataList>
        
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import ArticleListItem from "./forum/ArticelListItem.vue"

// import ArticleListItem from "@/views/forum/ArticleListItem.vue";


const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const formData = ref({})
const formDataRef = ref()

// const searchPanelHeight = (window.innerHeight - 60 - 140 - 60) / 2;

const startSearch = ref(false);

// 开始搜索
const startSearchHandler = () => {
  startSearch.value = false
  // search()
}

const rules = {
  keyword: [
    { required: true, message: "请输入关键字" },
    { min: 3, message: "关键字太少，至少三个字" },
  ],
};

const api = {
  loadArticle: "/forum/search",
};


//文章列表
const loading = ref(false);
const articleListInfo = ref({});

const search = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    loading.value = true;
    let params = {
      pageNo: articleListInfo.value.pageNo,
      keyword: formData.value.keyword,
    };
    let result = await proxy.Request({
      url: api.loadArticle,
      params: params,
      showLoading: false,
    });
    loading.value = false;
    if (!result) {
      return;
    }
    let list = result.data.list;
    list.forEach((element) => {
      element.title = element.title.replace(
        params.keyword,
        "<span style='color:red'>" + params.keyword + "</span>"
      );
    });
    articleListInfo.value = result.data;
    // console.log(articleListInfo.value)
    // debugger
  });
};

const changeInput = () => {
  if (formData.value.keyword == "") {
    articleListInfo.value = {};
  }
};

</script>

<style lang="scss">
.search-center {
  padding-top: 20px;
  background: #fff;
  min-height: calc(100vh - 210px);

  // min-height: 700px;
  .search-panel {
    display: flex;
    // flex-direction: column;
    justify-content: center;
    // padding-top: 200px;

    .el-input {
      display: flex;
      width: 700px;
      height: 50px;
      // padding: 0px auto;
    }

  
  }
}
</style>