<template>
    <div class="cover" :style="{width:width +'px',height:width+'px'}">
        <el-image
      :style="{ width: width + 'px', height: width + 'px' }"
      fit="scale-down"
      loading="lazy"

      :src="cover ? proxy.globalInfo.imageUrl + cover : localCover"
    >
    </el-image>
    
    </div>
    

</template>

<script setup>
import { getCurrentInstance } from "vue"
const{ proxy }=getCurrentInstance();
const props=defineProps({
    cover:{
        type:String,
    },
    width:{
        type:Number,
        default:60
    }
})

const localCover = new URL("@/assets/default_cover.jpg", import.meta.url).href;

</script>

<style lang="scss">
</style>