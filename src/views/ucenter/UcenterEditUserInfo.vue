<template>
    <Dialog 
        :show="diaglogConfig.show" 
        :title="diaglogConfig.title" 
        :buttons="diaglogConfig.buttons"
        @close="diaglogConfig.show = false" 
        :showCancel="false" 
        width="600px">
        <el-form :model="formData" ref="formDataRef" label-width="40px">
            <el-form-item label="昵称" prop="nickName">
                {{ formData.nickName }}
            </el-form-item>

            <el-form-item label="头像" prop="avatar">
                     <CoverUpload
                      :imageUlrPrefix="proxy.globalInfo.avatarUrl"
                      v-model="formData.avatar"
                      ></CoverUpload>
            </el-form-item>

            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="formData.sex">
                 <el-radio :label="0">女</el-radio>
                 <el-radio :label="1">男</el-radio>
                </el-radio-group>                
            </el-form-item>

              <!--textarea输入-->
              <el-form-item label="简介" prop="">
                <el-input
                  clearable
                  placeholder="完善个人简介，让大家更了解你哦亲"
                  type="textarea"
                  :rows="5"
                  :maxlength="100"
                  resize="none"
                  show-word-limit
                  v-model="formData.personDescription"
                ></el-input>
              </el-form-item>
        </el-form>



    </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex"


const store = useStore();

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const formData = ref({})
const formDataRef = ref(null)
const api = {
  updateUserInfo: "/ucenter/updateUserInfo",
};

const loading = ref(false);

const emit = defineEmits(["resetUserInfo"]);

const userEitorInfoHandler=()=>{
    formDataRef.value.validate(async(valid)=>{
        if(!valid){
            return;
        }
        let params={};
        console.log(formData.value)

        Object.assign(params,formData.value)
        // debugger
        let result=await proxy.Request({
            url:api.updateUserInfo,
            params
        })
        if(!result){
            return;
        }
        diaglogConfig.show=false
        if (params.avatar instanceof File) {
           router.go(0);
        } else {
        //  emit("resetUserInfo", params);
         router.go(0);

        }
    })
}


const diaglogConfig = reactive({
    show: false,
    title: "编辑个人资料",
    buttons: [{
        type: "primary",
        text: "确认",
        click: (e) => {
            userEitorInfoHandler()
        }
    }
        ,]
})

const showEdit = (userInfo) => {
    diaglogConfig.show = true
    nextTick(() => {
        formDataRef.value.resetFields();
        const CurrentUserInfo=JSON.parse(JSON.stringify(userInfo));
        CurrentUserInfo.avatar={
            imageUrl:CurrentUserInfo.userId
        }
        formData.value=CurrentUserInfo;
    })

}
defineExpose({ showEdit });




</script>
<style lang="scss">
.data-item {
    display: flex;
    flex-direction: row;
    margin-top: 15px;

    // background-color: aqua;
    .record-panel {
        flex: 1;
        // margin-left: -39px;
    }

    .intergl-panel {
        flex: 1;
        // padding-left: 90px;

    }

    .time-panel {
        flex: 1;
        // padding-left: 250px;
    }
}


.record-count {
    padding-left: 135px;


}

.record-time {
    padding-left: 120px;


}

.add {
    color: rgb(42, 223, 14);

}

.low {
    color: rgb(213, 31, 65);

}
</style> 