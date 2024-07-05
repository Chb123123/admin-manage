<template>
	<div v-loading="loading">
		<TableSearch
			:query="query"
			:options="searchOpt"
			:search="handleSearch"
			ref="TableSearchDom"
		/>
		<div class="container" id="container">
			<TableCustom
				tableHeight="calc(100vh - 380px)"
				:columns="columns"
				:tableData="tableData"
				:total="page.total"
				:refresh="getData"
				:viewFunc="handleView"
				:delFunc="handleDelete"
				:page-change="changePage"
				:editFunc="handleEdit"
			>
				<template #coverImg="coverImg">
					<el-image
            v-if="coverImg.rows.coverImg && coverImg.rows.coverImg !== ''"
						style="width: 50px; height: 50px"
						:src="coverImg.rows.coverImg"
						:zoom-rate="1.2"
						:max-scale="7"
						:min-scale="0.2"
						:initial-index="0"
						fit="cover"
						:z-index="999"
					/>
          <span v-else>暂无封面</span>
				</template>
				<template #time="time">
					<span>{{ getCreateTime(time.rows.time) }}</span>
				</template>
			</TableCustom>
		</div>
		<el-dialog
			:title="isEdit ? '编辑' : '新增'"
			v-model="visible"
			width="700px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<TableEdit
				:form-data="rowData"
				:options="options"
				:edit="isEdit"
				imgStr="userPic"
				:update="updateData"
			/>
		</el-dialog>

		<el-dialog
			title="查看详情"
			v-model="visible1"
			width="700px"
			destroy-on-close
		>
			<TableDetail :data="viewData">
				<template #userPic="userPic">
					<el-image
						style="width: 50px; height: 50px"
						:src="userPic.rows.userPic"
						:zoom-rate="1.2"
						:max-scale="7"
						:min-scale="0.2"
						:preview-src-list="[userPic.rows.userPic]"
						:initial-index="0"
						fit="cover"
						:z-index="999"
					/>
				</template>
			</TableDetail>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { User } from '@/types/user';
import { getArticlePage } from '@/api/article';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

let loading = ref(true);
// 查询相关
const query = reactive({
	name: '',
});
const searchOpt = ref<FormOptionList[]>([
	{ type: 'input', label: '用户名：', prop: 'accountNumber' },
]);
const handleSearch = (data: Object) => {
  console.log('搜索')
	changePage(1);
};

const getCreateTime = (str: String) => {
	let timeStr = str.replace('.000Z', '');
	let timeList = timeStr.split('T');
	let hour = parseInt(timeList[1].split(':')[0]);
	hour += 8;
	let newHour = hour >= 10 ? hour + '' : '0' + hour;
	let newTime = timeList[1].split(':');
	newTime[0] = newHour;
	let newHour1 = newTime.join(':');
	let str1 = timeList[0] + ' ' + newHour1;
	return str1;
};

// 表格相关
let columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'title', label: '标题' },
	{ prop: 'coverImg', label: '封面' },
	{ prop: 'time', label: '时间' },
	{ prop: 'userName', label: '发布作者' },
	{ prop: 'operator', label: '操作', width: 250 },
]);
const page = reactive({
	index: 1,
	size: 10,
	total: 0,
});
const tableData = ref<User[]>([]);
const getData = async () => {
	loading.value = true;
	const res = await getArticlePage(page.index, page.size);
	if (res.data.status === 1) {
		tableData.value = res.data.queryData.rows;
		page.total = res.data.queryData.total;
	} else {
		ElMessage.error(res.data.message);
	}
	loading.value = false;
};
getData();
let ruleList = ref([]);

const changePage = (val: number) => {
	page.index = val;
	getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
	labelWidth: '100px',
	span: 24,
	list: [
		{ type: 'input', label: '标题', prop: 'title', required: true },
		{ type: 'input', label: '个性签名', prop: 'userSignature', required: true },
		{ type: 'select', label: '角色', prop: 'userRank', required: true, opts: ruleList, placeholder: '请选择用户角色' },
		{ type: 'upload', label: '头像', prop: 'userPic', required: true },
	],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref({});
const handleEdit = (row: User) => {
	rowData.value = { ...row };
	isEdit.value = true;
	visible.value = true;
};
const updateData = async (data: Object) => {
	console.log(data)
	// const res = await editUserInfo(data)
	// if(res.data.status === 1) {
	// 	getData();
	// 	closeDialog();
	// 	ElMessage.success(res.data.message);
	// } else {
	// 	ElMessage.error(res.data.message);
	// }
};

const closeDialog = () => {
	visible.value = false;
	isEdit.value = false;
};

// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
	row: {},
	list: [],
});
const handleView = (row: User) => {
	viewData.value.row = JSON.parse(JSON.stringify(row));
	viewData.value.list = [
		{
			prop: 'articleId',
			label: '文章ID',
		},
		{
			prop: 'title',
			label: '文章标题',
		},
		{
			prop: 'time',
			label: '发布时间',
		},
		{
			prop: 'userName',
			label: '发布人',
		},
		{ prop: 'coverImg', label: '头像' },
	];
	visible1.value = true;
};

// 删除相关
const handleDelete = async (row: User) => {
	// const res = await delectUserInfo(row.userId);
	// if (res.data.status === 1) {
	// 	getData();
	// 	ElMessage.success(res.data.message);
	// } else {
	// 	ElMessage.error(res.data.message);
	// }
};
</script>

<style scoped lang="scss">
</style>
