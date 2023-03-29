<template>
  <div class="container-body article-detail-body" v-if="Object.keys(articleInfo).length > 0"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
    <!--板块导航-->
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">{{
        articleInfo.pBoardName
      }}</router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardId">
        <router-link class="a-link" :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`">{{ articleInfo.boardName
        }}</router-link>
        <span class="iconfont icon-right"></span>
      </template>
      <span>{{ articleInfo.title }}</span>

    </div>

    <!--文章详情-->
    <div class="detail-container" :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }">
      <div class="article-detail">
        <!--标题-->
        <div class="title">
          <span class="tag tag-no-audit" v-if="articleInfo.status == 0">待审核</span>
          {{ articleInfo.title }}
        </div>
        <!--用户信息-->
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50"></Avatar>
          <div class="user-info-detail">
            <router-link class="nick-name a-link" :to="`/user/${articleInfo.userId}`">{{ articleInfo.nickName
            }}</router-link>
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span class="address">&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span>
              <span class="iconfont icon-eye-solid">
                {{
                  articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount
                }}
              </span>

              <router-link
                v-if="articleInfo.userId == currentUserInfo.userId"
                :to="`/editPost/${articleInfo.articleId}`"
                class="a-link btn-edit"
              >
                <span class="iconfont icon-edit">编辑</span>
              </router-link>
            </div>
          </div>
        </div>
        <!--文章详情-->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
      <!--附件-->
      <div class="attachment-panel" v-if="attachment" id="view-attachment">
        <div class="title">附件</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip item"></div>
          <div class="file-name item">{{ attachment.fileName }}</div>
          <div class="size item">
            {{ proxy.Utils.sizeToStr(attachment.fileSize) }}
          </div>
          <div class="item">
            需要<span class="integral">{{ attachment.integral }}</span>积分
          </div>
          <div class="download-count item">
            已下载{{ attachment.downloadCount }}次
          </div>
          <div class="download-btn item">
            <el-button type="primary" size="small" @click="downloadAttachment(attachment.fileId)">下载</el-button>
          </div>
        </div>
      </div>
      <!--评论-->
      <div class="comment-panel" id="view-comment">
        <CommentList v-if="articleInfo.articleId" :articleId="articleInfo.articleId" :articleUserId="articleInfo.userId">
        </CommentList>

      </div>

      <!-- 目录 -->
      <div class="toc-panel">
        <div class="top-containner">
          <div class="toc-title">目录</div>
          <div class="toc-list">
            <template v-if="tocArray.length == 0">
              <div class="no-tac">未解析到目录</div>
            </template>

            <template v-else>
              <div v-for="toc in tocArray">
                <span @click="gotoAnchor(toc.ids)"
                  :class="['toc-item', toc.id = anchorId ? 'active' : '']" 
                  :style="{ 'padding-left': toc.level * 15 + 'px' }">
                  {{ toc.title }}
                </span>
              </div>
            </template>

          </div>
        </div>
      </div>


    </div>
  </div>
  <!--左侧快捷操作-->
  <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }" v-if="quickPanelLeft > 0">
    <!--点赞-->
    <el-badge :value="articleInfo.goodCount" type="info" :hidden="!articleInfo.goodCount > 0">
      <div class="quick-item" @click="doLikeHandler">
        <span :class="['iconfont icon-good', haveLike ? 'have-like' : '']"></span>
      </div>
    </el-badge>

    <!--评论-->
    <el-badge :value="articleInfo.commentCount" type="info" :hidden="!articleInfo.commentCount > 0">
      <div class="quick-item" @click="goToPostion('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>

    <!--附件-->
    <div class="quick-item" @click="goToPostion('view-attachment')">
      <span class="iconfont icon-attachment"></span>
    </div>
    <!--图片预览-->
    <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer>
  </div>
</template>

<script setup>

import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css"; //样式
import { ref, reactive, getCurrentInstance, nextTick, onMounted,onUnmounted ,watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useStore } from "vuex"

import CommentList from "./CommentList.vue"
const store = useStore();

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  getArticleDetail: "/forum/getArticleDetail",
  doLike: "/forum/doLike",
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
  attachmentDownload: "/api/forum/attachmentDownload",
};

// 当前用户的个人信息
const currentUserInfo = ref({});

// 监听用户是否登录的信息
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {}
  }, { immediate: true, deep: true }
)

//监听页面大小
const listenResize = () => {
  quickPanelLeft.value =
    (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110;
  console.log(quickPanelLeft.value);
};



//文章详情
const articleInfo = ref({});

//附件
const attachment = ref({});

//是否已点赞
const haveLike = ref(false);

const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  // articleInfo.value = result.data.forumArticle
  articleInfo.value = result.data.forumArticle;
  attachment.value = result.data.attachment;
  haveLike.value = result.data.haveLike;

  store.commit("setActivePboardId", result.data.forumArticle.pBoardId);
  store.commit("setActiveBoardId", result.data.forumArticle.boardId);
  //图片预览
  imagePreview();
  //代码高亮
  highlightCode();

  // 解析目录
  maketoc();


}

onMounted(() => {
  getArticleDetail(route.params.articleId);
});


// 点击下载附件

const downloadAttachment = async (fileId) => {
  // 判断一下用户是否登录，用store拿到用户信息，检测showLogin(),未登录则弹出
  if (!currentUserInfo.value) {
    store.commit("showLogin", true);
    return;
  }

  // 0积分与用户本人直接可下载
  if (attachment.value.integral == 0 ||
    currentUserInfo.value.userId == articleInfo.value.userId) {
    console.log("me")
    // 下载
    downloadDo(fileId);
    return;
  }

  // 获取用户下载信息，因为有些用户已经下载过想重新下载
  let result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: fileId
    }
  })

  if (!result) {
    return;
  }


  // 判断用户是否下载过
  if (result.data.haveDownload) {
    downloadDo(fileId);
    return;
  }

  // 判断用户积分是否够     用户积分<下载所需积分
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning("你的积分不够，无法下载");
    return;
  }

  proxy.Confirm(
    `你还有${result.data.userIntegral}积分，当前下载会扣除${attachment.value.integral}积分，确定要下载吗？`,
    () => {
      downloadDo(fileId);
    }
  );



}

const downloadDo = (fileId) => {
  document.location.href = api.attachmentDownload + "?fileId=" + fileId;
  attachment.value.downloadCount = attachment.value.downloadCount + 1;
};

//快捷操作，计算距离
const quickPanelLeft = ref(
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110
);

// 去到点赞、评论、附件区域
const goToPostion = (domId) => {
  document.querySelector("#" + domId).scrollIntoView()
}


// 点赞
const doLikeHandler = async () => {

  // 登陆了才可以点赞，没登录不可以点赞
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin", true);
    return;
  }

  let result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleInfo.value.articleId
    }
  })
  if (!result) {
    return;
  }
  haveLike.value = !haveLike.value;//取相反值
  let goodCount = 1;
  if (!haveLike.value) {
    goodCount = -1;
  }
  articleInfo.value.goodCount = articleInfo.value.goodCount + goodCount;

}

// 文章图片预览
const imageViewerRef = ref(null)
const previewImgList = ref([])
const imagePreview = () => {
  const imageList = []
  // 浏览器加载完再进行图片预览
  nextTick(() => {
    const imageNodeList = document.querySelector("#detail").querySelectorAll("img")

    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show()
      })
    })
    previewImgList.value = imageList;


  })
}

//代码高亮
const highlightCode = () => {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((item) => {
      hljs.highlightBlock(item);
    });
  });
};

// 获取目录
const tocArray = ref([])
const maketoc = () => {
  nextTick(() => {
    // 创建一个数组，存放有各个h的标签
    const tocTags = ["H1", "H2", "H3", "H4", "H5", "H6"]
    // 拿到detail节点的所有h标签并放在一个指定的数组中
    const contentDom = document.querySelector("#detail")
    const childNodes = contentDom.childNodes;
    // 遍历
    let index = 0;
    // console.log(childNodes)
    childNodes.forEach((item) => {
      let tagName = item.tagName
      // console.log(tagName)
      // 看看tagName是不是undefined,与togName全部大写后是不是有和tocTag相同的
      if (tagName == undefined || !tocTags.includes(tagName.toUpperCase())) {
        return true
      }

      index++;
      let ids = "toc" + index
      item.setAttribute("id", ids);
      tocArray.value.push({
        
        title: item.innerText,
        level: Number.parseInt(tagName.substring(1)),
        offsetTop: item.offsetTop,
        ids:ids,
      });
    })
    // console.log(tocArray)

    trueUser()

  })



}
// const anchorId = ref(null)
// const gotoAnchor = (domId) => {
//   const todom = document.querySelector("#" + domId)
//   todom.scrollIntoView({
//     behavior: "smooth",
//     block: "start"
//   })

// }
const anchorId = ref(null);
const gotoAnchor = (domId) => {
  // console.log("#"+domId)
  const dom = document.querySelector("#" + domId);
  dom.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

};

const listenerScroll = () => {
  let currentScrollTop = getScrollTop();
  tocArray.value.some((item, index) => {
    if (
      (index < tocArray.value.length - 1 &&
        currentScrollTop >= tocArray.value[index].offsetTop &&
        currentScrollTop < tocArray.value[index + 1].offsetTop) ||
      (index == tocArray.value.length - 1 &&
        currentScrollTop < tocArray.value[index].offsetTop)
    ) {
      anchorId.value = item.id;
      return true;
    }
  });
};

//获取滚动条的高度
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};

onMounted(() => {
  window.addEventListener("scroll", listenerScroll, false);
  window.addEventListener("resize", listenResize, false);
});

onUnmounted(() => {

  window.removeEventListener("scroll", listenerScroll, false);
  window.removeEventListener("resize", listenResize, false);
});

const trueUserHandler=ref(false)
const trueUser=()=>{
  console.log(currentUserInfo.value)
  console.log(articleInfo.value)

}


</script>


<style lang="scss">
.article-detail-body {
  position: relative;

  .board-info {
    line-height: 40px;

    .icon-right {
      margin: 0px 10px;
    }
  }

  .detail-container {
    .article-detail {
      background: #fff;
      padding: 15px;

      .title {
        font-weight: bolder;
      }

      .user-info {
        margin-top: 15px;
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;

        .user-info-detail {
          margin-left: 10px;

          .nick-name {
            text-decoration: none;
            color: #4e5969;
            font-size: 15px;
          }

          .nick-name:hover {
            color: var(--link);
          }

          .time-info {
            margin-top: 5px;
            font-size: 13px;
            color: var(--text2);

            .iconfont {
              margin-left: 10px;
            }

            .iconfont::before {
              padding-right: 3px;
            }

            .btn-edit {
              .iconfont {
                font-size: 14px;
              }
            }
          }
        }
      }

      .detail {
        letter-spacing: 1px;
        line-height: 22px;

        a {
          text-decoration: none;
          color: var(--link);
        }

        img {
          max-width: 90%;
          cursor: pointer;
        }
      }
    }

    .attachment-panel {
      margin-top: 20px;
      background: #fff;
      padding: 20px;

      .title {
        font-size: 18px;
      }

      .attachment-info {
        display: flex;
        align-items: center;
        color: #9f9f9f;
        margin-top: 10px;

        .item {
          margin-right: 10px;
        }

        .icon-zip {
          font-size: 20px;
          color: #6ca1f7;
        }

        .file-name {
          color: #6ca1f7;
        }

        .integral {
          color: red;
          padding: 0px 5px;
        }
      }
    }

    .comment-panel {
      margin-top: 20px;
      background: #fff;
      padding: 20px;
    }
  }


}

.quick-panel {
  position: fixed;
  width: 50px;
  top: 200px;
  text-align: center;

  .el-badge__content.is-fixed {
    top: 5px;
    right: 15px;
  }

  .quick-item {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 30px;
    cursor: pointer;

    .iconfont {
      font-size: 22px;
      color: var(--text2);
    }

    .have-like {
      color: red;
    }
  }
}

.toc-panel {
  position: absolute;
  top: 45px;
  right: 0px;
  width: 285px;

  .top-containner {
    width: 285px;
    position: fixed;
    background: #fff;

    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }

    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;

      .no-toc {
        text-align: center;
        color: #5f5d5d;
        line-height: 40px;
        font-size: 13px;
      }

      .toc-item {
        cursor: pointer;
        display: block;
        line-height: 35px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555666;
        border-radius: 3px;
        font-size: 14px;
        border-left: 2px solid #fff;
      }

      .toc-item:hover {
        background: #eeeded;
      }

      .active {
        border-left: 2px solid #6ca1f7;
        border-radius: 0px 3px 3px 0px;
        background: #eeeded;
      }
    }
  }
}
</style>