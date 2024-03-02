<template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-select v-model="query.type" placeholder="查找方式" style="flex:2">
                    <el-option key="1" label="用户uid" value="用户uid"></el-option>
                    <el-option key="2" label="用户名" value="用户名"></el-option>
                </el-select>
                <el-input v-model="query.content" style="flex: 10"></el-input>
                <el-button type="" :icon="Search" @click="performSearch" style="flex: 1">搜索</el-button>
                <el-button type="" :icon="Clock" @click="resetSearch" style="flex: 1;margin-left: 0;">重置</el-button>
                <el-button type="" :icon="Refresh" @click="pullUsers" style="flex: 1;margin-left: 0;">刷新</el-button>
            </div>
            
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="uid" label="UID" width="100" align="center"></el-table-column>
                <el-table-column prop="username" width="200" label="用户名" align="center"></el-table-column>
                <el-table-column prop="campus" label="学校" align="center"></el-table-column>
                <el-table-column prop="followednum" label="粉丝数量" width="120" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="info" label="登录信息" width="200" align="center"
                    :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="status" label="操作" width="120" align="center">
                    <template #default="scope">
                        <el-button class="red" :icon="CircleCloseFilled" text
                            @click="removeUserByUid(scope.row.uid)" style="margin-left: 0;">
                            注销
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <!--⭐ 需要修改 -->
                <el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox, dialogEmits } from 'element-plus';
import { Delete, Edit, Search, Plus, User, Refresh, SuccessFilled, CircleCloseFilled,Clock } from '@element-plus/icons-vue';
import { fetchTableData } from '../api/index';
import txcRequest from '../service/index.js';
import searchuser from '../components/searchuser.vue';
import axios from "axios";

// 表格中的项目
interface UserItem {
    uid: number;              // 用户ID
    password: string;
    picture: Array<string>;  // 图片url数组
    nickname: string;
    email: string;           // 邮箱
    campus: string;          // 学校
    birthday: string;
    phone: string;
    info: string;           // 登录信息
    followednum: number    // 被关注的数量
    username: string;            // 用户名
}

const followedNumber = ref()


const size = 25;

const query = reactive({
    pageIndex: 1,
    pageSize: size,
    type: '',
    content: ''
});


const tableData = ref<Array<UserItem>>([]);
const pageTotal = ref(0);
const detailData = ref<UserItem>();

let queryData = {
    "uid": null,
    "username": null
}

const restQueryData = () => {
    queryData.uid = null;
    queryData.username = null;
}

/**
* searchuser组件定义的事件
* 根据关键词查找用户
*/
const performSearch = () => {
    query.pageIndex = 1;
    pullUsers();
}

/**
 * 从后端获取新的用户
 */

const pullUsers = () => {
    txcRequest.request({
        url: 'manage/page/user',
        method: 'POST',
        params: {
            pageNum: query.pageIndex,
            pageSize: size
        },
        data: query.type === "用户uid"? {uid: query.content} : (query.type === "用户名" ? {username: query.content} : {})
        //data: {
          //  uid: query.type === "用户uid" ? query.content: null,
           // username: query.type === "用户名" ? query.content: null,
        //}
    }).then((res: any)=>{
        if (!res.code) {
            tableData.value = res.user_result;
            pageTotal.value = res.totalNum;
            console.log(pageTotal.value);
        }
    });
}

pullUsers();


/*
* 根据uid删除用户
*/

const removeUserByUid = (uid: BigInteger) => {
    txcRequest.request({
        url: 'manage/user/delete',
        method: 'DELETE',
        params: {
            uid: uid
        },
    }).then((res: any)=>{
        if (!res.code) {
            console.log("用户删除成功");
            alert("UID为" + uid + "的用户注销成功");
        }
    });
}


const resetSearch = () => {
    query.pageIndex= 1;
    query.pageSize= size;
    query.type= '';
    query.content= '';
    pullUsers();
}

// 分页导航
const handlePageChange = (val: number) => {
    query.pageIndex = val;
    pullUsers();
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