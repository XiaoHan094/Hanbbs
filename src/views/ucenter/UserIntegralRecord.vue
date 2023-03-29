<template>
    <Dialog :show="diaglogConfig.show" 
    :title="diaglogConfig.title" 
    :buttons="diaglogConfig.buttons"        
    @close="diaglogConfig.show = false"       
    :showCancel="false"
    width="600px"
    >
        <el-form :model="formData" 
        ref="formDataRef" 
        label-width="40px">
            <el-form-item label="日期" props="createTimeInfo">
                    <el-date-picker 
                    v-model="formData.createTimeInfo" 
                    type="datetimerange" 
                    range-separator="~"
                    start-placeholder="开始日期" 
                    end-placeholder="结束日期" 
                    @change="getIntegralRecord"
                    align="right">
                    </el-date-picker>
            </el-form-item>
        </el-form>           
                <div class="data-item">
                    <div class="record-panel">类型</div>
                    <div class="intergl-panel">积分</div>
                    <div class="time-panel">时间</div>
                </div>
                <DataList 
                :dataSource="intergalRecord"
                :loading="loading"
                @loadData="getIntegralRecord"
                 noDataMsg="暂无相关记录"
               >
                 <template #default="{ data }">
                    <div class="data-item">
                    <div class="record-type">{{ data.operTypeName }}</div>
                    <div :class="['record-count',data.operType>0?'add':'low']">
                        <span v-if="data.operType>0">+</span>
                        <span v-else>-</span>
                        {{ data.integral }}</div>
                    <div class="record-time">{{ data.createTime }}</div>

                    </div>
                </template>             
       
            </DataList>
           
    </Dialog>
</template>

<script setup>
// import { nextTick } from "process";
import { ref, reactive, getCurrentInstance,nextTick, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex"


const store = useStore();

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const formData = ref({})
const formDataRef = ref(null)

const api={
    getIntegralRecord:"/ucenter/loadUserIntegralRecord"

}

const loading = ref(false);

const diaglogConfig = reactive({
    show: false,
    title: "用户积分记录",
    buttons: [{
        type: "primary",
        text: "确认",
        click: (e) => {
            diaglogConfig.show = false
        }
    }
        ,]

})

const showRecord = () => {
    diaglogConfig.show = true
    nextTick(()=>{
        formDataRef.value.resetFields();
        getIntegralRecord();

    })

}

// 定义积分记录的数组
const intergalRecord=ref({})
const getIntegralRecord=async()=>{
  loading.value = true;

    let params={
        pageNo: intergalRecord.value.pageNo

    }

    if(formData.value.createTimeInfo){
        params.createTimeStart=formData.value.createTimeInfo[0]
        params.createTimeEnd=formData.value.createTimeInfo[1]
        // console.log(formData.value.createTime[0],formData.value.createTime[1])
        // debugger
        // console.log(params)

    }
    let result=await proxy.Request({
        url:api.getIntegralRecord,
        params:params,
        showLoading: false,


    })
  loading.value = false;

    if(!result){
        return;
    }

    intergalRecord.value=result.data

}
defineExpose({ showRecord });


</script>
<style lang="scss">
.data-item{
    display: flex;
    flex-direction:row;
    margin-top: 15px;
    // background-color: aqua;
    .record-panel{
        flex: 1;
        // margin-left: -39px;
    }
    .intergl-panel{
        flex: 1;
        // padding-left: 90px;

    }
    .time-panel{
        flex: 1;
        // padding-left: 250px;
    }
}


.record-count{
    padding-left: 135px;


}

.record-time{
    padding-left: 120px;


}
.add{
        color: rgb(42, 223, 14);

    }
    .low{
        color: rgb(213, 31, 65);

    }



</style> 

