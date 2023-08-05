<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <searchbar @search="performSearch"/>
                <el-button type="" :icon="Refresh" @click="pullPosts">刷新</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="name" width="150" label="用户名" align="center"></el-table-column>
                <el-table-column prop="status" width="130" label="状态" align='center'>
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.status === '通过' ? 'success' : (scope.row.status === '待审核' ? 'info' : (scope.row.status === '不通过' ? 'danger' : ''))">
                            {{ scope.row.status }}
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
                <el-table-column prop="category1" label="一级目录" align="center">
                    <!-- <template #default="scope">
                        <div class="tag-container">
                            <el-tag v-for="(tag, index) in scope.row.tags" :key="index" type="primary">{{ tag
                            }}</el-tag>
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="category2" label="二级目录" align="center">
                </el-table-column>
                <el-table-column prop="createtime" label="发布时间" align="center"></el-table-column>
                <el-table-column prop="status" label="操作" width="220" align="center">
                    <template #default="scope">
                        <el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)"
                            v-if="scope.row.status === '通过'" v-permiss="15">
                            编辑
                        </el-button>
                        <el-button class="green" :icon="SuccessFilled" v-if="scope.row.status === '待审核'" text>
                            通过
                        </el-button>
                        <el-button class="red" :icon="CircleCloseFilled" v-if="scope.row.status === '待审核'" text>
                            不通过
                        </el-button>

                        <el-button class="red" :icon="CircleCloseFilled" v-if="scope.row.status === '通过'" text>
                            驳回
                        </el-button>

                        <el-button class="green" :icon="SuccessFilled" v-if="scope.row.status === '不通过'" text>
                            重新通过
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="campus"  label="校区" align="center">
                </el-table-column>
                <el-table-column prop="likenum"  label="点赞量" align="center">
                </el-table-column>
                <el-table-column prop="collectnum"  label="收藏量" align="center">
                </el-table-column>
                <el-table-column prop="readingnum" label="阅读量" align="center">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <!--⭐ 需要修改 -->
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
import txcRequest from '../service/index.js';
import searchbar from '../components/searchbar.vue';

// 表格中的项目
interface TableItem {
    id: number;              // 用户ID
    name: string;            // 用户名
    content: string;         // 帖子内容
    status: string           // 帖子的状态(0为待审核，1为已通过，2为未通过)
    category1: string;       // 一级目录
    category2: string;       // 二级目录
    picture: Array<string>;  // 图片url数组
    createtime: string;      // 发布时间
    campus: string;          // 在哪个校区
    title: string;           // 帖子的标题
    likenum: number          // 被点赞的数量
    collectnum: number       // 被收藏的数量
    readingnum: number    // 阅读量
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


const tableData = ref<Array<TableItem>>([]);
const pageTotal = ref(0);

/**
* searchbar组件定义的事件
* 根据用户提供关键词查找帖子
*/
const performSearch = (query: {type: string, content: string})=>{
    txcRequest.request({
        url: 'baike/searchByKey',
        method: 'GET',
        params: {
            type: query.type,
            keyword: query.content,
            pageSize: 1,
            pageNum: 25,
        }
    }).then((res: any)=>{
        console.log(query);
        tableData.value =[];
        tableData.value = res.data;
    });
}

/**
 * 从后端获取新的帖子
 */

const pullPosts = () => {
    txcRequest.request({
        url: 'baike/page',
        method: 'GET',
        params: {
            pageNum: 1,
            pageSize: 25
        }
    }).then((res: any)=>{
        tableData.value = res.data;
    });
}
pullPosts();

// 获取表格数据
const getData = () => {
    fetchTableData().then(res => {
        tableData.value = res.data.list;
        pageTotal.value = res.data.pageTotal || 50;
    });
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

