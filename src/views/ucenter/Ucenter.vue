<template>
    <div class="container-body ucenter" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
        <div class="user-banner">
            <router-link to="/" class="a-link">
                首页
            </router-link>
            <span class="iconfont icon-right"></span>
            <span>个人中心</span>

        </div>
        <div class="ucenter-panel">
            <div class="user-side">
                <!--头像信息-->
                <div class="avatar-panel">

                    <div class="edit-btn a-link" v-if="isCurrentUser" @click="updateUserInfo">
                        修改资料
                    </div>

                    <div class="avatar-inner">
                        <Avatar :userId="userInfo.userId" :width="120"></Avatar>
                    </div>
                    <div class="nick-name">
                        <span>{{ userInfo.nickName }}</span>
                        <span v-if="userInfo.sex == 0" class="women iconfont icon-woman"></span>
                        <span v-if="userInfo.sex == 1" class="man iconfont icon-man"></span>
                    </div>

                    <div class="desc">
                       {{ userInfo.personDescription }}
                    </div>

                </div>

                <!-- 拓展信息 -->
                <div class="user-extend-panel">
                    <div class="info-item" @click="showIntegralrecord()">
                        <div class="label iconfont icon-integral">积分</div>
                        <div class="value">{{ userInfo.currentIntegral }}</div>
                    </div>
                    <div class="info-item">
                        <div class="label iconfont icon-like">获赞</div>
                        <div class="value">{{ userInfo.likeCount }}</div>
                    </div>
                    <div class="info-item">
                        <div class="label iconfont icon-post">发帖</div>
                        <div class="value">{{ userInfo.postCount }}</div>
                    </div>
                    <div class="info-item">
                        <div class="label iconfont icon-register">加入</div>
                        <div class="value">{{ userInfo.joinTime }}</div>
                    </div>
                    <div class="info-item">
                        <div class="label iconfont icon-login">最后登录</div>
                        <div class="value">{{ userInfo.lastLoginTime }}</div>
                    </div>
                </div>
            </div>


            <!-- 文章，评论，点赞 -->
            <div class="article-right">
                <div class="article-panel">
                    <el-tabs :model-value="activeTabName" @tab-change="changeTab">
                        <el-tab-pane label="发帖" :name="0"></el-tab-pane>
                        <el-tab-pane label="评论" :name="1"></el-tab-pane>
                        <el-tab-pane label="点赞" :name="2"></el-tab-pane>
                    </el-tabs>
                </div>

                <div class="article-list">
                    <DataList :loading="loading" :dataSource="articleInfo" @loadData="loadUserArticle"
                        noDataMsg="没有发现帖子，赶紧发布一个吧">
                        <template #default="{ data }">
                            <ArticleListItem :data="data"></ArticleListItem>
                        </template>
                    </DataList>
                </div>
            </div>
        </div>
        <UserIntegralRecord ref="userIntegralrecordRef"></UserIntegralRecord>
        <UcenterEditUserInfo
         ref="ucenterEditUserInfoRef" 
         @resterUserInfo="resetUserList"
        ></UcenterEditUserInfo>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useStore } from "vuex"
import UserIntegralRecord from "./UserIntegralRecord.vue"
import UcenterEditUserInfo from "./UcenterEditUserInfo.vue"
import ArticleListItem from "../forum/ArticelListItem.vue"

const store = useStore();

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();


const userId = ref(null)
const userInfo = ref({})

const api = {
    getUserInfo: "/ucenter/getUserInfo",
    loadUserArticle: "/ucenter/loadUserArticle",
};

const loading = ref(false)


const loadUserInfo = async () => {
    let result = await proxy.Request({
        url: api.getUserInfo,
        params: {
            userId: userId.value
        },
        errCallback: () => {
            setTimeout(() => {
                router.push("/");
            }, 1500)
        }
    })


    if (!result) {
        return;
    }
    userInfo.value = result.data

}

onMounted(() => {
    userId.value = route.params.userId;
    loadUserInfo()
    loadUserArticle()

}
)

// 用户查看积分
const userIntegralrecordRef = ref(null)
const showIntegralrecord = () => {
    userIntegralrecordRef.value.showRecord()

}

const activeTabName = ref(0)
const changeTab = (type) => {
    activeTabName.value = type
    loadUserArticle()
}

// 获取用户文章
const articleInfo = ref({})

const loadUserArticle = async () => {
    loading.value = true

    let params = {
        pageNo: articleInfo.value.pageNo,
        type: activeTabName.value || 0,
        userId: userId.value,
    }

    let result = await proxy.Request({
        url: api.loadUserArticle,
        params: params,
        showLoading: false
    })
    loading.value = false
    if (!result) {
        return;
    }
    articleInfo.value = result.data
}


const isCurrentUser = ref(false)
// 确认进入此页面的用户是否为本人
const resetCurrentUser = () => {
    const loginUserInfo = store.getters.getLoginUserInfo;
    if (loginUserInfo && loginUserInfo.userId == userId.value) {
        isCurrentUser.value = true;
    }
    else {
        isCurrentUser.value = false;
    }
}

watch(
    () => store.state.loginUserInfo
    , (newVal, oldVal) => {
        resetCurrentUser()


    }, { immediate: true, deep: true }
)


watch(
    () => route.params.userId
    , (newVal, oldVal) => {
        if (newVal) {
            userId.value = newVal
            loadUserArticle()
            loadUserInfo()
            resetCurrentUser()
        }

    }, { immediate: true, deep: true }
)


const ucenterEditUserInfoRef=ref(null)
// 修改用户资料
const updateUserInfo = (data) => {
    ucenterEditUserInfoRef.value.showEdit(userInfo.value)
}


// 用户在子组件修改资料后返回
const resetUserList=(data)=>{
    userInfo.value=data
    loadUserInfo()
}




</script>
<style lang="scss">
.ucenter {
    .user-banner {
        color: #9ba7b9;
        padding-top: 10px;


        .icon-right {
            padding: 0px 5px;
        }

    }

    .ucenter-panel {
        display: flex;
        padding-top: 10px;

        .user-side {
            width: 300px;
            padding-right: 10px;

            .avatar-panel {
                background: #fff;
                text-align: center;
                padding: 10px;
                // margin-top: 10px;
                // background-color: aqua;


                .edit-btn {
                    text-align: right;
                    font-size: 14px;
                }

                .avatar-inner {
                    display: flex;
                    justify-content: center;
                    // text-align: center;
                    // flex-direction: column;

                }

                .nick-name {
                    text-align: center;
                    // background-color: #9ba7b9;
                    flex: 1;
                    padding-top: 20px;
                    padding-bottom: 30px;
                    color: black;
                    font-size: 20px;
                             .women{
            color: #eb08ba;

          }
          .man{
            color: #1a10da;

          }



                }
                .desc {
        //   margin-top: 5px;
          text-align: center;
          font-size: 14px;
          color: #929393;
          padding-bottom: 30px;

        }


            }

            .user-extend-panel {
                width: 300px;
                margin-top: 10px;


                .info-item {
                    justify-content: space-between;
                    display: flex;
                    background: #fff;
                    padding: 10px;

                    .label {
                        font-size: 15px;

                    }

                    .label::before {
                        font-size: 18px;
                        color: #888888;
                        padding-right: 5px;
                    }

                    .value {
                        font-size: 13px;
                    }
                }
            }
        }


        .article-right {
            background-color: #fff;
            flex: 1;
            // padding-left: 5px;
            .article-panel {
                // display: flex;
                // width: 100;
                padding-left: 15px;
                padding-right: 15px;
            }
        }
    }
}
</style>