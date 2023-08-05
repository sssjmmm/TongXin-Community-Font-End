<template>
    <el-select v-model="query.type" placeholder="查找方式" class="handle-select mr10">
        <el-option key="1" label="ID" value="ID"></el-option>
        <el-option key="2" label="日期" value="日期"></el-option>
        <el-option key="2" label="帖文内容" value="帖文内容"></el-option>
    </el-select>
    <el-input v-model="query.content" placeholder="" class="handle-input mr10"></el-input>
    <el-button type="" :icon="Search" @click="handleSearch">搜索</el-button>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, defineComponent } from 'vue';
import { Search } from '@element-plus/icons-vue';

const query = reactive({
    type: '',
    content: ''
});

const emit = defineEmits<{
  (e: 'search', query: {type: string, content: string}): void
}>();

const handleSearch = () => {
    emit("search", query);
}

</script>


<style scoped>

</style>