<template>
    <div class="layout-content">
        <div class="header" v-if="showHeader">
            <div class="header-content" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
                <!-- LOGO -->
                <span class="logo" v-for="item in logInfo" :style="{ color: item.color }">
                    {{ item.letter }}
                </span>

                <!-- 板块信息 -->
                <div class="menu-panel">
                    <span class="menu-item">
                        <router-link :class="[
                            'menu-item home',
                            activePboardId == undefined ? 'active' : '',
                        ]" to="/">首页</router-link>
                    </span>

                    <template v-for="board in boardList">
                        <el-popover placement="bottom-start" :width="300" trigger="hover" v-if="board.children.length > 0">
                            <template #reference>
                                <span :class="[
                                    'menu-item',
                                    board.boardId == activePboardId ? 'active' : '',
                                ]" @click="boardClickHander(board)">{{ board.boardName }}</span>
                            </template>
                            <div class="sub-board-list">
                                <span :class="[
                                    'sub-board',
                                    subBoard.boardId == activeBoardId ? 'active' : '',
                                ]" @click="subBoardClickHander(subBoard)" v-for="subBoard in board.children">{{
    subBoard.boardName
}}</span>
                            </div>
                        </el-popover>
                        <span :class="[
                            'menu-item',
                            board.boardId == activePboardId ? 'active' : '',
                        ]" v-else @click="boardClickHander(board)">{{ board.boardName }}</span>

                    </template>
                </div>

                <!-- 用户登录注册信息 -->
                <div class="user-info-panel">
                    <el-button type="primary" class="panel-icon" @click="newPost">
                        发帖<span class="iconfont icon-add"></span>
                    </el-button>
                    <el-button type="primary" class="panel-icon" @click="goSearch">
                        搜索<span class="iconfont icon-search"></span>
                    </el-button>

                    <template v-if="userInfo.userId">
                        <div class="message-info">
                            <el-dropdown>
                                <el-badge :value="messageCountInfo.total" class="item count-tag" :hidden="
                                    messageCountInfo.total == null ||
                                    messageCountInfo.total == 0
                                ">
                                    <div class="iconfont icon-message"></div>
                                </el-badge>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="gotoMessage('reply')" class="message-item">
                                            <span class="text">回复我的</span>
                                            <span class="count-tag" v-if="messageCountInfo.reply > 0">{{
                                                messageCountInfo.reply > 99
                                                ? "99+"
                                                : messageCountInfo.reply
                                            }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('likePost')" class="message-item">
                                            <span class="text">赞了我的文章</span>
                                            <span class="count-tag" v-if="messageCountInfo.likePost > 0">{{
                                                messageCountInfo.likePost > 99
                                                ? "99+"
                                                : messageCountInfo.likePost
                                            }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('downloadAttachment')" class="message-item">
                                            <span class="text">下载了我的附件</span>
                                            <span class="count-tag" v-if="messageCountInfo.downloadAttachment > 0">{{
                                                messageCountInfo.downloadAttachment > 99
                                                ? "99+"
                                                : messageCountInfo.downloadAttachment
                                            }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('likeComment')" class="message-item">
                                            <span class="text">赞了我的评论</span>
                                            <span class="count-tag" v-if="messageCountInfo.likeComment > 0">{{
                                                messageCountInfo.likeComment > 99
                                                ? "99+"
                                                : messageCountInfo.likeComment
                                            }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('sys')" class="message-item">
                                            <span class="text">系统消息</span>
                                            <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                                                messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys
                                            }}</span>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>

                        <div class="user-info">
                            <el-dropdown>
                                <Avatar :userId="userInfo.userId" :width="40"></Avatar>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="gotoUcenter(userInfo.userId)">我的主页</el-dropdown-item>
                                        <el-dropdown-item @click="logout">退出</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>

                    </template>
                    <el-button-group :style="{ 'margin-left': '10px' }" v-else>
                        <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>
                        <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>
                    </el-button-group>
                </div>
            </div>
        </div>
        <div class="body-content">
            <router-view />
        </div>
        <div class="footer" v-if="showFooter">
            <div class="footer-content" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
                <el-row>
                    <el-col :span="6" class="item">
                        <div class="logo">
                            <div class="logo-letter">
                                <span v-for="item in logInfo" :style="{ color: item.color }">{{
                                    item.letter
                                }}</span>
                            </div>
                            <div class="info">Han的编程社区</div>
                        </div>
                    </el-col>
                    <el-col :span="6" class="item">
                        <div class="title">联系方式</div>
                        <div>
                            <a href="####">Email:1320764010@qq.com</a>
                        </div>
                        <div><a href="####">WeChat:13670336603</a></div>
                    </el-col>
                    <el-col :span="6" class="item">
                        <!-- <div class="title"></div>
             -->
                        <!-- <div class="info">Han的编程社区</div> -->

                    </el-col>
                    <el-col :span="6" class="item">
                        <div class="title"></div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <LoginAndRegister ref="loginAndRegisterRef"></LoginAndRegister>


    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginAndRegister from "./LoginAndRegister.vue"
import { useStore } from "vuex"


const store = useStore();

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
// 登录注册
const loginAndRegisterRef = ref()

const loginAndRegister = (type) => {
    loginAndRegisterRef.value.showPanel(type);
}

const showHeader = ref(true)
const api = {
    getUserInfo: "/getUserInfo",
    loadBord: "/board/loadBoard",
    loadMessageCount: "/ucenter/getMessageCount",

    logout: "/logout",


}

// 获取用户信息
const getUserInfo = async () => {
    let result = await proxy.Request({
        url: api.getUserInfo
    });
    if (!result) {
        return;
    }
    store.commit("updateLoginUserInfo", result.data)

}


//获取滚动条滚动距离
const getScrollTop = () => {
    let scrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
    return scrollTop;
}



const initScroll = () => {

    let initScrollTop = getScrollTop()//这里拿到了scrollTop是进入页面时最开始的
    let scrollType = 0;
    window.addEventListener("scroll", () => {
        // 重新赋值，因为会改变
        let currentScrollTop = getScrollTop();
        // console.log(currentScrollTop);
        if (currentScrollTop > initScrollTop) {
            // 往下移动
            scrollType = 1;
        } else {
            // 往上移动
            scrollType = 0;
        }
        initScrollTop = currentScrollTop;//把当前的赋值回去给initScrollTop,下次滚动才可以用上
        // console.log(scrollType);
        if (scrollType == 1 && currentScrollTop > 100) {
            showHeader.value = false;
        } else {
            showHeader.value = true;

        }
    });


}

onMounted(() => {
    initScroll();
    getUserInfo();
})


const gotoUcenter = (id) => {
    router.push(`/user/${id}`);

}


const logInfo = ref([
    {
        letter: "H",
        color: "#3285FF",

    },
    {
        letter: "a",
        color: "#FB3624",

    },
    {
        letter: "n",
        color: "#FFBA02",

    },
    {
        letter: "-",
        color: "#3285FF",

    },
    {
        letter: "M",
        color: "#FFBA02",

    },
    {
        letter: "a",
        color: "#25B24E",

    },
    {
        letter: "d",
        color: "#FD3224",

    },
    {
        letter: "e",
        color: "#3285FF",

    }
])

// 监听用户登录信息
const userInfo = ref({})

watch(
    () => store.state.loginUserInfo, (newVal, oldVal) => {
        if (newVal != undefined && newVal != null) {
            userInfo.value = newVal
        } else {
            userInfo.value = {}
        }
    },
    { immediate: true, deep: true }
);

// 监听是否展示登录框
watch(
    () => store.state.showLogin, (newVal, oldVal) => {
        if (newVal) {
            loginAndRegister(1)
        }
    },
    { immediate: true, deep: true }
)


// 获取板块信息
const boardList = ref([])
const loadBoard = async () => {
    let result = await proxy.Request({
        url: api.loadBord
    })
    if (!result) {
        return;
    }
    boardList.value = result.data
    store.commit("saveBoardList", result.data)



}
loadBoard()


// 一级板块点击
const boardClickHander = (board) => {
    router.push(`/forum/${board.boardId}`)

}
// 二级板块点击
const subBoardClickHander = (subBoard) => {
    router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`)


}

//当前选中的板块
const activePboardId = ref(0);
watch(
    () => store.state.activePboardId,
    (newVal, oldVal) => {
        if (newVal !== 0) {
            activePboardId.value = newVal;
        }
    },
    { immediate: true, deep: true }
);

const activeBoardId = ref(0);
watch(
    () => store.state.activeBoardId,
    (newVal, oldVal) => {
        activeBoardId.value = newVal;
    },
    { immediate: true, deep: true }
);

//退出
const logout = () => {
    proxy.Confirm("确定要退出吗?", async () => {
        let result = await proxy.Request({
            url: api.logout,
        });
        if (!result) {
            return;
        }
        store.commit("updateLoginUserInfo", null);
    });
};


// // 去发帖
// const toEditPost=()=>{
//     // 判断用户是否登录
//     if(!store.getters.getUserLoginInfo){
//         loginAndRegister(1)
//     }
//     else{
//     router.push("/newPost");

//     }

// }

//发帖
const newPost = () => {
    if (!store.getters.getLoginUserInfo) {
        loginAndRegister(1);
    } else {
        router.push("/newPost");
    }
};

//消息相关
const gotoMessage = (type) => {
    router.push(`/user/message/${type}`);
};

const messageCountInfo = ref({});
const loadMessageCount = async () => {
    let result = await proxy.Request({
        url: api.loadMessageCount,
    });
    if (!result) {
        return;
    }
    messageCountInfo.value = result.data;
    store.commit("updateMessageCountInfo", result.data);
};

watch(
    () => store.state.messageCountInfo,
    (newVal, oldVal) => {
        messageCountInfo.value = newVal || {};
    },
    { immediate: true, deep: true }
);

watch(
    () => store.state.loginUserInfo,
    (newVal, oldVal) => {
        if (newVal) {
            loadMessageCount();
        }
    },
    { immediate: true, deep: true }
);

// 去搜索页
const goSearch = () => {
    router.push("/search");
}

//是否展示底部
const showFooter = ref(true);
watch(
    () => route.path,
    (newVal, oldVal) => {
        if (newVal.indexOf("newPost") != -1 || newVal.indexOf("editPost") != -1) {
            showFooter.value = false;
        } else {
            showFooter.value = true;
        }
    },
    { immediate: true, deep: true }
);

</script>

<style lang="scss">
.header {

    top: 0px;
    position: fixed;
    width: 100%;
    box-shadow: 0 2px 6px 0 #ddd; //x偏移量，y偏移量  阴影模糊半径 阴影扩散半径
    // background-color: aqua;
    height: 60px;

    .header-content {
        height: 60px;
        // background-color: aqua;
        align-items: center;
        margin: 0 auto;
        display: flex;

        .logo {
            font-size: 35px;
        }

        .menu-panel {
            flex: 1;

            .menu-item {
                flex: 1;
                margin-left: 10px;
                font-size: 17px;
                cursor: pointer;
                text-decoration: none;


            }


        }

        .user-info-panel {
            width: 300px;
            display: flex;
            align-items: center;

            .op-btn {
                .iconfont {
                    margin-left: 5px;
                }

                .el-button+.el-button {
                    margin-left: 5px;
                }
            }

            .message-info {
                margin-left: 5px;
                margin-right: 25px;
                cursor: pointer;

                .icon-message {
                    padding-left: 10px;
                    font-size: 25px;
                    color: rgb(147, 147, 147);
                }
            }
        }

    }
}

.sub-board-list {
    display: flex;

    .sub-board {
        padding: 0px 10px;
        border-radius: 20px;
        margin-right: 10px;
        background: rgb(239, 239, 239);
        border: 1px solid #ddd;
        color: rgb(119, 118, 118);
        margin-top: 10px;
        cursor: pointer;
    }



    .sub-board:hover {
        color: var(--link);
    }

    .active {
        background: var(--link);
        color: #fff;
    }

    .active:hover {
        color: #fff;
    }

    .message-item {
        display: flex;
        justify-content: space-around;

        .text {
            flex: 1;
        }

        .count-tag {
            height: 15px;
            line-height: 15px;
            min-width: 20px;
            display: inline-block;
            background: #f56c6c;
            border-radius: 10px;
            font-size: 13px;
            text-align: center;
            color: #fff;
            margin-left: 10px;
        }
    }
}

.body-content {
    flex: 1;
    margin-top: 60px;
    // margin:0px;
    position: relative;
}

.layout-content {


    .footer {

        background: #e9e9e9;
        height: 140px;
        margin-top: calc(100vh - 400px);

        .footer-content {
            margin: 0px auto;
            padding-top: 10px;

            .item {
                text-align: left;

                .title {
                    font-size: 18px;
                    margin-bottom: 10px;
                }

                a {
                    font-size: 14px;
                    text-decoration: none;
                    color: var(--text2);
                    line-height: 25px;
                }
            }

            .logo {
                .logo-letter {
                    font-size: 30px;
                }

                .info {
                    margin-top: 10px;
                    color: rgb(93, 91, 91);
                }
            }
        }
    }
}</style>