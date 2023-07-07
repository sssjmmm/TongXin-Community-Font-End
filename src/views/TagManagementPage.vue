<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.type" placeholder="查找方式" class="handle-select mr10">
                    <el-option key="1" label="ID" value="ID"></el-option>
                    <el-option key="2" label="日期" value="日期"></el-option>
                    <el-option key="2" label="帖文内容" value="帖文内容"></el-option>
                </el-select>
                <el-input v-model="query.content" placeholder="" class="handle-input mr10"></el-input>
                <el-button type="" :icon="Search" @click="handleSearch">搜索</el-button>
                <el-button type="" :icon="Refresh" @click="pullPosts">刷新</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="name" width="150" label="用户名" align="center"></el-table-column>
                <el-table-column width="130" label="状态" align='center'>
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.state === '通过' ? 'success' : (scope.row.state === '待审核' ? 'info' : (scope.row.state === '不通过' ? 'danger' : ''))">
                            {{ scope.row.state }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="图片内容" align="center">
                    <template #default="scope">
                        <div class="image-container">
                            <el-image v-for="(url, index) in scope.row.picture" :key="index" class="table-td-thumb"
                                :src="url" :z-index="10" :preview-src-list="[url]" preview-teleported></el-image>
                        </div>
                    </template>
                </el-table-column>


                <el-table-column prop="content" label="内容" width="300" align="center"
                    :show-overflow-tooltip="true"></el-table-column>
                <el-table-column label="标签" align="center">
                    <template #default="scope">
                        <div class="tag-container">
                            <el-tag v-for="(tag, index) in scope.row.tags" :key="index" type="primary">{{ tag
                            }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="time" label="发布时间" align="center"></el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)"
                            v-if="scope.row.state === '通过'" v-permiss="15">
                            编辑
                        </el-button>
                        <el-button class="green" :icon="SuccessFilled" v-if="scope.row.state === '待审核'" text>
                            通过
                        </el-button>
                        <el-button class="red" :icon="CircleCloseFilled" v-if="scope.row.state === '待审核'" text>
                            不通过
                        </el-button>

                        <el-button class="red" :icon="CircleCloseFilled" v-if="scope.row.state === '通过'" text>
                            驳回
                        </el-button>

                        <el-button class="green" :icon="SuccessFilled" v-if="scope.row.state === '不通过'" text>
                            重新通过
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" v-model="editVisible" width="30%">
            <el-form label-width="100px">
                <el-form-item label="用户ID">
                    {{ form.id }}
                </el-form-item>
                <el-form-item label="内容">
                    <el-input type="textarea" rows="10" v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="指定点赞数量">
                    <el-select v-model="likeNumber" class="handle-select mr10">
                        <el-option key="1" label="不限" value="不限"></el-option>
                        <el-option key="7" label="不允许点赞" value="不允许点赞"></el-option>
                        <el-option key="2" label="10" value="10"></el-option>
                        <el-option key="3" label="100" value="100"></el-option>
                        <el-option key="4" label="500" value="500"></el-option>
                        <el-option key="5" label="1k" value="1k"></el-option>
                        <el-option key="6" label="5k" value="5k"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指定阅读数量">
                    <el-select v-model="readingNumber" class="handle-select mr10">
                        <el-option key="1" label="不限" value="不限"></el-option>
                        <el-option key="7" label="不允许阅读" value="不允许阅读"></el-option>
                        <el-option key="2" label="100" value="100"></el-option>
                        <el-option key="3" label="1k" value="1k"></el-option>
                        <el-option key="4" label="5k" value="5k"></el-option>
                        <el-option key="5" label="1w" value="1w"></el-option>
                        <el-option key="6" label="5w" value="5w"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="指定收藏数量">
                    <el-select v-model="readingNumber" class="handle-select mr10">
                        <el-option key="1" label="不限" value="不限"></el-option>
                        <el-option key="7" label="不允许收藏" value="不允许收藏"></el-option>
                        <el-option key="2" label="10" value="10"></el-option>
                        <el-option key="3" label="50" value="50"></el-option>
                        <el-option key="4" label="100" value="100"></el-option>
                        <el-option key="5" label="500" value="500"></el-option>
                        <el-option key="6" label="1000" value="1000"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="" @click="saveEdit">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, User, Refresh, SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue';
import { fetchTableData } from '../api/index';

interface TableItem {
    id: number;
    name: string;
    state: string;
    content: string;
    time: string;
}
const likeNumber = ref()
const readingNumber = ref()
const query = reactive({
    address: '',
    name: '',
    pageIndex: 1,
    pageSize: 10,
    type: '',
    content: ''
});


const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
    fetchTableData().then(res => {
        tableData.value = res.data.list;
        pageTotal.value = res.data.pageTotal || 50;
    });
};
getData();
// 后端获取帖子
const pullPosts = () => {

}


// 查询操作
const handleSearch = () => {
    query.pageIndex = 1;
    getData();
};
// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    getData();
};

// 删除操作
const handleDelete = (index: number) => {
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(() => {
            ElMessage.success('删除成功');
            tableData.value.splice(index, 1);
        })
        .catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
    id: '',
    content: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
    idx = index;
    form.id = row.id;
    form.content = row.content;
    editVisible.value = true;
};
const saveEdit = () => {
    editVisible.value = false;
    ElMessage.success(`修改第 ${idx + 1} 行成功`);
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
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

:deep() .el-popper {
    max-width: 40% !important;
}
</style>

