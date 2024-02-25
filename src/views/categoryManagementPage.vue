<template>
    <div>
        <div class="container">
            <div class="handle-box">
                
                <el-select v-model="query.type" placeholder="查找方式" style="flex:2">
                    <el-option key="1" label="关键词" value="关键词"></el-option>
                </el-select>
                <el-input v-model="query.content" style="flex: 10"></el-input>
                <el-button type="" :icon="Search" @click="performSearch" style="flex: 1">搜索</el-button>
                <el-button type="" :icon="Refresh" @click="getCategories" style="flex: 1;margin-left: 0;">刷新</el-button>
                <el-button type="" :icon="CirclePlus" @click="addNewCategory" style="flex: 1;margin-left: 0;">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="name" width="250" label="类别名" align="center"></el-table-column>
                <el-table-column prop="createtime" label="发布时间" align="center"></el-table-column>
                <el-table-column prop="status" label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button class="blue" :icon="Edit" text @click="DialogFlag=true" style="margin-left: 0;">
                            修改
                        </el-button>
                        <el-button class="red" :icon="CircleCloseFilled" text
                            @click="deleteCategory(scope.row)" style="margin-left: 0;">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, dialogEmits } from 'element-plus';
import { Delete, Edit, Search, CirclePlus, User, Refresh, CircleCloseFilled, Document, Clock } from '@element-plus/icons-vue';
import { fetchTableData } from '../api/index';
import txcRequest from '../service/index.js';
import searchbar from '../components/searchbar.vue';
import axios from "axios";

// 表格中的项目
interface CategoryItem {
    id: number;              // 类别ID
    name: string;            // 类别名
    createtime: string;      // 发布时间
}
// const tableData = ref<Array<CategoryItem>>([]);
const tableData = ref([{
    id: 1,
    name: "交通",
    createtime: "2021-12-12 23:23:23"
},
{
    id: 2,
    name: "学习",
    createtime: "2024-12-12 03:13:24"
}]);

const DialogFlag = ref(false);

const size = 25;
const query = reactive({
    pageIndex: 1,
    pageSize: size,
    type: '',
    content: ''
});

const performSearch = () => {
    query.pageIndex = 1;
    getCategories();
}

// 获取所有类别列表
const getCategories = () => {

}

// 添加新类别
const addNewCategory = (name: String) => {

}


</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.handle-select {
    width: 120px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #F56C6C;
}

.green {
    color: #5cbf63
}

.blue {
    color: rgb(63, 158, 255)
}

.mr10 {
    margin-right: 10px;
}

.image-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px;
}

.tag-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 3px;
}

.table-td-thumb {
    width: calc(33.33% - 10px);
    height: auto;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.table-title {
    text-align: center;
}

:deep(.el-form-item__label) {
    font-weight: 600;
}


:deep() .el-popper {
    max-width: 40% !important;
}
.el-button+.el-button {
    margin-left: 0px;
}


</style>

