<template>
	<div>
		<!-- 第一行 -->
		<!-- 子元素之间将有20个单位的间距 -->
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style="height: 252px">
					<div class="user-info">
						<el-avatar :size="120" src="" >
						<img
							src="../assets/img/img.jpg"
						/>
						</el-avatar>
						<div class="user-info-cont">
							<div class="user-info-name">{{ name }}</div>
							<div>{{ role }}</div>
						</div>
					</div>
					<div class="user-info-list">
						上次登录时间：
						<span>2023-05-30</span>
					</div>
					<div class="user-info-list">
						上次登录地点：
						<span>上海</span>
					</div>
				</el-card>
				<el-card shadow="hover" style="height: 252px">
					<template #header>
						<div class="clearfix">
							<span>校区帖子分布</span>
						</div>
					</template>
					四平路校区
					<el-progress :percentage="79.4" color="#42b983"></el-progress>
					嘉定校区
					<el-progress :percentage="14" color="#f1e05a"></el-progress>
					彰武校区
					<el-progress :percentage="5.6"></el-progress>
					沪西校区
					<el-progress :percentage="1" color="#f56c6c"></el-progress>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon">
									<Edit />
								</el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">14895</div>
									<div>用户访问量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon">
									<ChatDotRound />
								</el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">3521</div>
									<div>帖子总数</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon">
									<User />
								</el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">5234</div>
									<div>用户总数</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>

				<!-- 待办事项 -->
				<el-card shadow="hover" style="height: 403px;position: relative;">
					<template #header>
						<div class="clearfix">
							<span>待办事项</span>
							<el-button style="float: right; padding: 3px 0" text @click="showAddTodoDialogfunc">添加</el-button>
						</div>
					</template>

					<el-table :show-header="false" :data="pagedTodoList" style="width: 100%">
						
						<el-table-column width="40">
							<template #default="scope">
								<el-checkbox v-model="scope.row.status"></el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<div class="todo-item" :class="{
									'todo-item-del': scope.row.status
								}">
									{{ scope.row.title }}
								</div>
							</template>
						</el-table-column>
					</el-table>
					<div class="pagination-container">
					<el-pagination
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
							:current-page="currentPage"
							:page-sizes="[5, 10, 15, 20]"
							:page-size="pageSize"
							layout="total, sizes, prev, pager, next, jumper"
							:total="todoList.length">
					</el-pagination>
					</div>
				</el-card>
				<!-- 添加待办事项的弹窗 -->
				<el-dialog title="添加待办事项" v-model="showAddTodoDialog" @close="handleAddTodoDialogClose">
					<!-- 在这里添加待办事项的表单 -->
					<el-input v-model="newTodo" placeholder="请输入待办事项"></el-input>
					<!-- 你可以根据需要添加其他表单项，比如截止日期、优先级等 -->
					<template #footer>
					<span class="dialog-footer">
						<el-button @click="showAddTodoDialog = false">取 消</el-button>
						<el-button type="primary" @click="addTodo">确 定</el-button>
					</span>
					</template>
				</el-dialog>
			</el-col>
		</el-row>

		<!-- 第二行 -->
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import Schart from 'vue-schart'
// import {imgurl} from '../assets/img/img.jpg';
import { Search } from '@element-plus/icons-vue';

export default {
  data() {
    return {
	  imgurl: '../assets/img/img.jpg',
      name: localStorage.getItem('ms_username'),
      role: this.name === 'admin' ? '超级管理员' : '普通用户',
      options: {
        type: 'bar',
        title: {
          text: '最近一周各类帖子发布数量'
        },
        xRorate: 25,
        labels: ['周一', '周二', '周三', '周四', '周五'],
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        datasets: [
          {
            label: '运动',
            data: [234, 278, 270, 190, 230]
          },
          {
            label: '约饭',
            data: [164, 178, 190, 135, 160]
          },
          {
            label: '自修',
            data: [144, 198, 150, 235, 120]
          }
        ]
      },
      options2: {
        type: 'line',
        title: {
          text: '最近几个月用户总数变化趋势图'
        },
        labels: ['6月', '7月', '8月', '9月', '10月'],
        colors: ['#0000ff'],
        datasets: [
          {
            label: '用户',
            data: [2340, 2480, 2706, 1940, 2330]
          }
		// {
		// 	label: '百货',
		// 	data: [164, 178, 150, 135, 160]
		// },
		// {
		// 	label: '食品',
		// 	data: [74, 118, 200, 235, 90]
		// }
        ]
      },
      todoList: [
        {
          title: '审核新用户注册申请，批准合格用户加入社区。',
          status: false
        },
        {
          title: '监控社区活动和帖子，确保内容合规和用户体验。',
          status: false
        },
        {
          title: '发表系统维护系统公告。',
          status: false
        },
        {
          title: '策划和组织社区活动，制定活动方案和日程。',
          status: false
        },
        {
          title: '统计社区帖子热度和互动情况，进行数据报告。',
          status: false
        },
        {
          title: '解答用户对社区功能的使用疑问。',
          status: true
        },        
		{
          title: '测试新接口。',
          status: true
        },

      ],
      showAddTodoDialog: false,

	  pagedTodoList: [], // 当前页的待办事项数据
      currentPage: 1, // 当前页码
      pageSize: 5, // 每页显示的条目数

	  newTodo: '',//新增的一条待办事项
    };
  },
  components:{
    Schart
  },
  methods: {
	// 点击“添加”按钮，打开添加待办事项的弹窗
    showAddTodoDialogfunc() {
      this.showAddTodoDialog = true;
      console.log(1);
    },
    handleAddTodoDialogClose() {
	  // 关闭添加待办事项弹窗后的逻辑处理
      this.showAddTodoDialog = false;
    },
    addTodo() {
      // 处理添加待办事项的逻辑
      // 例如，将新的待办事项内容添加到待办事项列表
	  // 把newTodo放到todoList中

		// 向数组的开头添加一个新元素
		this.todoList.unshift({
		title: this.newTodo,
		status: false
		});

	//发送给数据库
	//...

      // 添加完成后关闭弹窗
      this.showAddTodoDialog = false;
    },


	// 当用户改变每页显示的数据条数时触发
    handleSizeChange(newSize) {
		console.log("handleSizeChange");
      this.pageSize = newSize;
      this.currentPage = 1; // 重置为第一页
      this.updatePagedTodoList();
    },

    // 当用户改变当前页码时触发
    handleCurrentChange(newPage) {
		console.log("handleCurrentChange");
      this.currentPage = newPage;
      this.updatePagedTodoList();
    },

    // 更新当前页的待办事项数据
    updatePagedTodoList() {
		console.log("updatePagedTodoList");
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pagedTodoList = this.todoList.slice(startIndex, endIndex);
    },
  },
  created() {
    // 这里可以获取和设置待办事项数据，例如从后端API获取数据
    // 然后在获取数据后，调用updatePagedTodoList()方法初始化第一页的数据
    // 示例：this.todoList = 获取的待办事项数据;
    this.updatePagedTodoList();
  },
};
</script>
<style scoped>
.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}

.pagination-container {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;

}
</style>
