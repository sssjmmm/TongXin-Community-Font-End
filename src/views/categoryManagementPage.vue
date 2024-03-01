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
                <el-button type="" :icon="CirclePlus" @click="newCateDialogVisible = true" style="flex: 1;margin-left: 0;">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="categoryId" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="categoryName" width="250" label="类别名" align="center"></el-table-column>
                <el-table-column prop="createTime" label="发布时间" align="center"></el-table-column>
                <el-table-column prop="creatorId" label="创建者" align="center"></el-table-column>
                <el-table-column prop="baikeNum" label="帖子条数" align="center"></el-table-column>
                <el-table-column prop="status" label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button class="blue" :icon="Edit" text @click="showEditDialog(scope.row)" style="margin-left: 0;">
                            修改
                        </el-button>
                        <el-button class="red" :icon="CircleCloseFilled" text
                            @click="deleteCategory(scope.row)" style="margin-left: 0;">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div> -->
        </div>

        <el-dialog v-model="newCateDialogVisible" title="新增类型名称" width="500px" center>
            <el-input v-model="newCategoryName" placeholder="请在输入框内输入新增类型名称"/>
            
            
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="newCateDialogVisible = false" type="primary" style="margin-right: 10px;">关闭</el-button>

                <el-button type="success" @click="addNewCategory">提交</el-button>
            </div>
            </template>
        </el-dialog>

        <el-dialog v-model="editDialogVisible" title="修改类型信息" width="500px">
            <el-form :model="editCateForm">
            <el-form-item label="类型名" >
                <el-input v-model="editCateForm.categoryName"  />
            </el-form-item>
            <el-form-item label="创建时间" >
                <el-date-picker
                    v-model="editCateForm.createTime"
                    type="datetime"
                    placeholder="选择新时间"
                    format="YYYY/MM/DD HH:mm:ss"
                />
            </el-form-item>
            <el-form-item label="创建者ID" >
                <el-input v-model="editCateForm.categoryId" />
            </el-form-item>
            <el-form-item label="百科条数" >
                <el-input v-model="editCateForm.baikeNum" />
            </el-form-item>
            </el-form>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editCategory">
                提交
                </el-button>
            </div>
            </template>
        </el-dialog>
        <el-button @click="getCategories">test</el-button>
    </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, dialogEmits } from 'element-plus';
import { Delete, Edit, Search, CirclePlus, User, Refresh, CircleCloseFilled, Document, Clock } from '@element-plus/icons-vue';
import axios from "axios";


// 表格中的项目
interface CategoryItem {
    id: number;              // 类别ID
    name: string;            // 类别名
    createtime: string;      // 发布时间
}
// const tableData = ref<Array<CategoryItem>>([]);
var tableData = ref([{
            "categoryId": 6,
            "categoryName": "团购",
            "createTime": "2024-02-27T00:55:07.000+00:00",
            "creatorId": 1,
            "baikeNum": 1
        }]);

const editDialogVisible = ref(false);

const size = 25;
const query = reactive({
    pageIndex: 1,
    pageSize: size,
    type: '',
    content: ''
});
const newCateDialogVisible = ref(false)
const newCategoryName = ref('')
const performSearch = () => {
    query.pageIndex = 1;
    getCategories();
}
const editCateForm = reactive({
    categoryId: '123',
    categoryName: '31',
    createTime: '',
    creatorId: '',
    baikeNum: null,
})


// 获取所有类别列表
const getCategories = async () => {
    try {
            await axios.get(`https://tongxinshequ.cn/manage/category/all`)
			.then((response) => {
				// 请求成功时的处理
				console.log(response.data.categoryList);
                tableData.value = response.data.categoryList;
                
			})
			.catch((error) => {
				// 请求失败时的处理
				console.error('Error:', error);
			});
		} catch (error) {
			
		}
}

// 添加新类别
const addNewCategory = () => {
    newCateDialogVisible.value = false

    axios.post(`https://tongxinshequ.cn/manage/category/add?categoryName=${newCategoryName.value}`)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}

const deleteCategory = (row:any) => {
    console.log(row)

    axios.delete(`https://tongxinshequ.cn/manage/category/delete?categoryName=${row.categoryName}`)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error('Error:', error);
    })
}



const showEditDialog = (row: any) => {
    console.log('111', editCateForm)
    editCateForm.categoryId = row.categoryId
    editCateForm.categoryName = row.categoryName
    editCateForm.createTime = row.createTime
    editCateForm.creatorId = row.creatorId
    editCateForm.baikeNum = row.baikeNum

    console.log("sss", editCateForm)
    editDialogVisible.value = true;

}

const params = {
    categoryId: '',
    categoryName: '123',
    createTime: '',
    creatorId: '',
    baikeNum: null,
};
const editCategory = () => {
    params.categoryId = editCateForm.categoryId;
    params.categoryName = editCateForm.categoryName;
    params.createTime = editCateForm.createTime;
    params.creatorId = editCateForm.creatorId;
    params.baikeNum = editCateForm.baikeNum;
    
    console.log('更改对象：', params)
    axios.post(`https://tongxinshequ.cn/manage/category/update`, null, { params })
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.error('Error:', error);
    })
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

<!-- 日期格式，修改类型时字符串能否成功 -->