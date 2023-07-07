<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<!-- <div class="block"> -->
				<span class="demonstration">请选择需要审核的日期范围: </span>
				<el-date-picker v-model="value2" type="datetimerange" :shortcuts="shortcuts" range-separator="To"
					start-placeholder="Start date" end-placeholder="End date" />
				<!-- </div> -->
				<el-button type="primary" :icon="Search" @click="handleSearch" class="button-search">搜索</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="messageDate" sortable label="发帖日期"></el-table-column>
				<el-table-column prop="messageTime" sortable label="发帖时间"></el-table-column>
				<el-table-column prop="name" label="用户名"></el-table-column>
				<el-table-column prop="date" label="注册时间"></el-table-column>
				<el-table-column prop="classify" label="帖子分类" ></el-table-column>
				<el-table-column prop="content" label="内容">
					<template #default="scope">
						<el-col :span="16">
							<el-text truncated>{{ scope.row.content }}</el-text>
						</el-col>
					</template>
				</el-table-column>
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.state === '通过' ? 'success' : scope.row.state === '未通过' ? 'danger' : ''">
							{{ scope.row.state }}
						</el-tag>
					</template>
				</el-table-column>


				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							审核
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
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

		<!-- 审核弹出框 -->
		<el-dialog title="详情内容" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="用户名">
					{{ form.name }}
				</el-form-item>
				<el-form-item label="帖子分类">
					{{ form.classify }}
				</el-form-item>
				<el-form-item label="帖子内容">
					{{ form.content }}
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="Pass">审核通过</el-button>
					<el-button type="danger" @click="Refuse">驳回</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
// import type { TableColumnCtx, TableInstance } from 'element-plus'
// const tableRef = ref<TableInstance>()
interface TableItem {
	id: number;
	name: string;
	money: string;
	state: string;
	date: string;
	content: string;
	classify:string;
}

const query = reactive({
	content: '',
	name: '',
	pageIndex: 1,
	pageSize: 10
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// const resetDateFilter = () => {
// 	tableRef.value!.clearFilter(['classify'])
// }
// TODO: improvement typing when refactor table
// const clearFilter = () => {
// 	tableRef.value!.clearFilter()
// }
// const filterHandler = (
// 	value: string,
// 	row: TableItem,
// 	column: TableColumnCtx<TableItem>
// ) => {
// 	const property = column['property'] || column['prop'];
//       return row[property] === value;
// }
const value1 = ref<[Date, Date]>([
	new Date(2000, 10, 10, 10, 10),
	new Date(2000, 10, 11, 10, 10),
])
const value2 = ref('')

const shortcuts = [
	{
		text: 'Last week',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			return [start, end]
		},
	},
	{
		text: 'Last month',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
			return [start, end]
		},
	},
	{
		text: 'Last 3 months',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
			return [start, end]
		},
	},
]

// 获取表格数据
const getData = () => {
	fetchData().then(res => {
		tableData.value = res.data.list;
		pageTotal.value = res.data.pageTotal || 50;
	});
};
getData();

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
	name: '',
	content: '',
	classify: ''
});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.name = row.name;
	form.content = row.content;
	form.classify = row.classify;
	editVisible.value = true;
};
const Pass = () => {
	editVisible.value = false;
	ElMessage.success(`审核通过`);
	tableData.value[idx].state = "通过";
};
const Refuse = () => {
	editVisible.value = false;
	ElMessage.success(`驳回成功`);
	tableData.value[idx].state = "未通过";
}
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

.mr10 {
	margin-right: 10px;
}

.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}

.block {
	padding: 30px 0;
	text-align: center;
	border-right: solid 1px var(--el-border-color);
	flex: 1;
	display: inline-block;
}

.block:last-child {
	border-right: none;
}

.demonstration {
	display: block;
	color: var(--el-text-color-secondary);
	font-size: 14px;
	margin-bottom: 20px;
}

.button {
	margin-left: 20px;
}
</style>
