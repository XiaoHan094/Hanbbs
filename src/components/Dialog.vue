<template>
    <el-dialog 
    :model-value="show" 
    :title="title" 
    :draggable="true" 
    :close-on-press-escape="false" 
    :show-close="showClose"       
    :top="top" 
    :width="width"  
    @closed="close" 
    class="cust-dialog">

        <div class="dialog-body">
            <slot></slot>
        </div>
        <template v-if="buttons && buttons.length > 0 || showCancel">
            <div class="dialog-footer">
                <el-button v-if="showCancel" link @click="close">取消</el-button>
                <el-button v-for="btn in buttons" 
                :type="btn.type" @click="btn.click">
                    {{ btn.text }}
                </el-button>
            </div>
        </template>

    </el-dialog>
</template>
  
<script setup>
const proxy = defineProps({
    show: {
        type: Boolean,
        default: true

    },
    title: {
        type: String,
        default: "title"
    },
    draggable: {
        type: Boolean,
        default: true
    },
    showClose: {
        type: Boolean,
        default: true
    },
    width: {
        type: String,
        default: "30%"
    },
    top: {
        type: String,
        default: "10%"
    },
    showCancel: {
        type: Boolean,
        default: true
    },
    buttons: {
        type: Array,
    }

})

// const buttons=[
//     {
//         text:"确定",
//         type:"primary"
//     }
// ]

const emit=defineEmits()
// 把close事件通过emit传给父组件
const close = () => {
    emit("close")

}

</script>

<style lang="scss">
.cust-dialog {
    margin-bottom: 10px;
    .el-dialog__body {
        padding: 5px;
    }

    .dialog-body {
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        padding: 15px;
        min-height: 100px;
        max-height: calc(100vh - 200px);
        overflow: auto;
        // padding: 15px;

      


    }
    .dialog-footer {
            text-align: right;
            padding: 10px 20px;
            // background-color: aquamarine;
        }

}
</style>