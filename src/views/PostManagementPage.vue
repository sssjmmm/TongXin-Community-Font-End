<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="queryStatus" style="flex: 2">
                    <el-option key="1" label="待审核" value="待审核" @click="getNewStatusPosts(0)"></el-option>
                    <el-option key="2" label="已通过" value="已通过" @click="getNewStatusPosts(0)"></el-option>
                    <el-option key="3" label="未通过" value="未通过" @click="getNewStatusPosts(0)"></el-option>
                </el-select>
                <el-select v-model="query.type" placeholder="查找方式" style="flex:2">
                    <el-option key="1" label="日期" value="日期"></el-option>
                    <el-option key="2" label="帖子内容" value="帖子内容"></el-option>
                    <el-option key="3" label="一级目录" value="一级目录"></el-option>
                    <el-option key="4" label="二级目录" value="二级目录"></el-option>
                    <el-option key="5" label="校区" value="校区"></el-option>
                    <el-option key="6" label="标题" value="标题"></el-option>
                    <el-option key="7" label="用户id" value="用户id"></el-option>
                </el-select>
                <el-input v-model="query.content" style="flex: 10"></el-input>
                <el-button type="" :icon="Search" @click="performSearch" style="flex: 1">搜索</el-button>
                <el-button type="" :icon="Clock" @click="resetSearch" style="flex: 1;margin-left: 0;">重置</el-button>
                <el-button type="" :icon="Refresh" @click="pullPosts" style="flex: 1;margin-left: 0;">刷新</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="name" width="150" label="用户名" align="center"></el-table-column>
                <el-table-column prop="status" width="130" label="状态" align='center'>
                    <template #default="scope">
                        <el-tag
                            :type="scope.row.status === 1 ? 'success' : (scope.row.status === 0 ? 'info' : (scope.row.status === 2 ? 'danger' : ''))">
                            {{ scope.row.status === 1 ? '通过' : (scope.row.status === 0 ? '待审核' : (scope.row.status === 2 ?
                                '不通过' : '')) }}
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
                        <el-button class="green" :icon="SuccessFilled" v-if="scope.row.status === 0" text
                            @click="modifyStatus(1, scope.row)" style="margin-left: 0;">
                            通过
                        </el-button>

                        <el-button class="red" :icon="CircleCloseFilled" v-if="scope.row.status === 0" text
                            @click="modifyStatus(2, scope.row)" style="margin-left: 0;">
                            不通过
                        </el-button>

                        <el-button class="red" :icon="CircleCloseFilled" v-if="scope.row.status === 1" text
                            @click="modifyStatus(2, scope.row)" style="margin-left: 0;">
                            驳回
                        </el-button>

                        <el-button class="green" :icon="SuccessFilled" v-if="scope.row.status === 2" text
                            @click="modifyStatus(1, scope.row)" style="margin-left: 0;">
                            重新通过
                        </el-button>

                        <el-button class="blue" :icon="Document" text @click="showMoreInfo(scope.row)" style="margin-left: 0;">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
                <!-- 
                <el-table-column prop="campus"  label="校区" align="center">
                </el-table-column>
                <el-table-column prop="likenum"  label="点赞量" align="center">
                </el-table-column>
                <el-table-column prop="collectnum"  label="收藏量" align="center">
                </el-table-column>
                <el-table-column prop="readingnum" label="阅读量" align="center">
                </el-table-column> -->
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
        <el-dialog v-model="DialogFlag" :inline="true" @close="editFlag = false">
            <el-form label-position="left" label-width="80px">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="uid">
                            {{ detailData?.id }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="用户名">
                            {{ detailData?.name }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="帖子状态" v-if="editFlag === false">
                            {{ detailData?.status === 1 ? '通过' : (detailData?.status === 0 ? '待审核' : (detailData?.status === 2 ? '不通过' : '' ))}}
                        </el-form-item>
                        <el-form-item label="帖子状态" v-if="editFlag === true">
                            <el-select v-model="editData.status" style="width: 80%;">
                                <el-option key="1" label="待审核" value="待审核" @click="editData.status = '待审核'"></el-option>
                                <el-option key="2" label="已通过" value="已通过" @click="editData.status = '已通过'"></el-option>
                                <el-option key="3" label="未通过" value="未通过" @click="editData.status = '未通过'"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="一级目录" v-if="editFlag=== false">
                            {{ detailData?.category1 }}
                        </el-form-item>
                        <el-form-item label="一级目录" v-if="editFlag=== true">
                            <el-input v-model="editData.category1" style="width: 80%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="二级目录" v-if="editFlag=== false">
                            {{ detailData?.category2 }}
                        </el-form-item>
                        <el-form-item label="二级目录" v-if="editFlag=== true">
                            <el-input v-model="editData.category2" style="width: 80%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="校区" v-if="editFlag=== false">
                            {{ detailData?.campus }}
                        </el-form-item>
                        <el-form-item label="校区" v-if="editFlag=== true">
                            <el-input v-model="editData.campus" style="width: 80%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="发布时间">
                            {{ detailData?.createtime }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="阅读量">
                            {{ detailData?.readingnum }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="点赞量">
                            {{ detailData?.likenum }}
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="收藏量">
                            {{ detailData?.collectnum }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="标题" v-if="editFlag === false">
                            {{ detailData?.title }}
                        </el-form-item>
                        <el-form-item label="标题" v-if="editFlag === true">
                            <el-input v-model="editData.title" style="width: 80%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="帖文内容" v-if="editFlag === false">
                            {{ detailData?.content }}
                        </el-form-item>
                        <el-form-item label="帖文内容" v-if="editFlag === true">
                            <el-input   :rows="5" type="textarea" v-model="editData.content" style="width: 80%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button v-if="editFlag === false" style="position: relative;left: 50%;transform: translateX(-50%);" @click="editFlag = true">编辑</el-button>
            <el-button v-if="editFlag === true" style="position: relative;left: 33.3%;transform: translateX(-50%);" @click="submit">完成</el-button>
            <el-button v-if="editFlag === true" style="position: relative;left: 66.6%;transform: translateX(-50%);" @click="editFlag = false">取消</el-button>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, dialogEmits } from 'element-plus';
import { Delete, Edit, Search, Plus, User, Refresh, SuccessFilled, CircleCloseFilled, Document, Clock } from '@element-plus/icons-vue';
import { fetchTableData } from '../api/index';
import txcRequest from '../service/index.js';
import searchbar from '../components/searchbar.vue';
import axios from "axios";


// 表格中的项目
interface TableItem {
    id: number;              // 用户ID
    name: string;            // 用户名
    content: string;         // 帖子内容
    status: number;           // 帖子的状态(0为待审核，1为已通过，2为未通过)
    category1: string;       // 一级目录
    category2: string;       // 二级目录
    picture: Array<string>;  // 图片url数组
    createtime: string;      // 发布时间
    campus: string;          // 在哪个校区
    title: string;           // 帖子的标题
    likenum: number;          // 被点赞的数量
    collectnum: number;       // 被收藏的数量
    readingnum: number;       // 阅读量
    post_id: string;
}

const likeNumber = ref()
const readingNumber = ref()
const DialogFlag = ref(false);
const queryStatus = ref("待审核");
const editFlag = ref(false);
const size = 25;

const query = reactive({
    pageIndex: 1,
    pageSize: size,
    type: '',
    content: ''
});


const tableData = ref<Array<TableItem>>([]);
const pageTotal = ref(0);
const detailData = ref<TableItem>();

let queryData = {
    "campus": null,
    "category1": null,
    "category2": null,
    "content": null,
    "date": null,
    "id": null,
    "status": 0,
    "title": null
}

const editData = reactive({
    status: "",
    content: "",
    title: "",
    campus: "",
    category1: "",
    category2: ""
})

const restQueryData = () => {
    queryData.campus = null;
    queryData.category1 = null;
    queryData.category2 = null;
    queryData.content = null;
    queryData.date = null;
    queryData.id = null;
    queryData.status = 0;
    queryData.title = null;
}

const modifyStatus = (status: number, row: any) => {
    let pictureArray = row.picture;
    console.log(pictureArray);
    if(pictureArray[0] == ""){
        pictureArray = [];
    }
    txcRequest.request({
        url: 'manage/baike/alter',
        method: 'PATCH',
        data: {
            status: status,
            post_id: row.post_id,
            category2: row.category2,
            createtime: row.createtime,
            campus: row.campus,
            category1: row.category1,
            collectnum: row.collectnum,
            title:row.title,
            content:row.content,
            picture: pictureArray,
            likenum: row.likenum,
            name: row.name,
            readingnum:row.readingnum,
            id: row.id,
        }
    }).then((res: any) => {
        pullPosts();
        if (res.code) {

        }
    })
}

const getNewStatusPosts =(status: number) =>{
    query.pageIndex = 1;
    pullPosts();
}

const submit = ()=>{
    let requestStatus = editData.status === '待审核'? 0 : (editData.status === '已通过'? 1:2); 
    txcRequest.request({
        url:'manage/baike/alter',
        method: 'PATCH',
        data: {
            status: requestStatus,
            post_id: detailData.value?.post_id,
            category2: editData.category2,
            createtime: detailData.value?.createtime,
            campus: editData.campus,
            category1: editData.category1,
            collectnum: detailData.value?.collectnum,
            title: editData.title,
            content:editData.content,
            picture: detailData.value?.picture,
            notes: "",
            likenum: detailData.value?.likenum,
            name: detailData.value?.name,
            readingnum:detailData.value?.readingnum,
            id: detailData.value?.id
        }

    }).then((res:any)=>{
        if(!res.code){
            DialogFlag.value = false;
            pullPosts();
        }
    })
}

/**
* searchbar组件定义的事件
* 根据用户提供关键词查找帖子
*/
const performSearch = () => {
    query.pageIndex = 1;
    pullPosts();
}


/**
 * 从后端获取新的帖子
 */

const pullPosts = () => {
    let requestStatus = queryStatus.value === '待审核'? 0 : (queryStatus.value === '已通过'? 1:2); 
    txcRequest.request({
        url: 'manage/page/baike',
        method: 'POST',
        params: {
            pageNum: query.pageIndex,
            pageSize: size
        },
        data: {
            campus: query.type === "校区" ? query.content: null,
            category1: query.type === "一级目录" ? query.content: null,
            category2: query.type === "二级目录" ? query.content: null,
            content: query.type === "帖子内容" ? query.content: null,
            date: query.type === "日期" ? query.content: null,
            id: query.type === "用户id" ? query.content: null,
            title: query.type === "标题" ? query.content: null,
            status: requestStatus,
        }
    }).then((res: any) => {
        if (!res.code) {
            tableData.value = res.baike_result;
            pageTotal.value = res.totalNum;
            let i =0;
            for(let item of tableData.value){
                if(item.picture[0] === ""){
                    tableData.value[i].picture = [];                   
                }
                i++;
            }
        }
    });
}
pullPosts();

const resetSearch = () => {
    query.pageIndex= 1;
    query.pageSize= size;
    query.type= '';
    query.content= '';
    pullPosts();
}

const handlePageChange = (val: number) => {
    query.pageIndex = val;
    pullPosts();
}

const showMoreInfo = (row: any) => {
    editFlag.value = false;
    DialogFlag.value = true;
    detailData.value = row;
    editData.status = row.status === 0? "待审核" : ( row.status === 1? "已通过":"未通过"); 
    editData.category1 = row.category1;
    editData.category2 = row.category2;
    editData.content = row.content;
    editData.title = row.title;
    editData.campus = row.campus;
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

