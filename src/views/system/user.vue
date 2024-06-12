<template>
	<div>
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
				:viewFunc="handleView"
				:delFunc="handleDelete"
				:page-change="changePage"
				:editFunc="handleEdit"
			>
				<template #toolbarBtn>
					<el-button
						type="warning"
						:icon="CirclePlusFilled"
						@click="visible = true"
						>新增</el-button
					>
				</template>
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
				<template #createTime="createTime">
					<span>{{ getCreateTime(createTime.rows.createTime) }}</span>
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
				:update="updateData"
			/>
		</el-dialog>

		<el-dialog
			title="查看详情"
			v-model="visible1"
			width="700px"
			destroy-on-close
		>
			<TableDetail :data="viewData"></TableDetail>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage, ImageProps } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import { getUserList } from '@/api/system';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOption, FormOptionList } from '@/types/form-option';

// 查询相关
const query = reactive({
	name: '',
});
const searchOpt = ref<FormOptionList[]>([
	{ type: 'input', label: '用户名：', prop: 'accountNumber' },
]);
const handleSearch = (data: Object) => {
	changePage(1);
	console.log(data);
};

const getCreateTime = (str: String) => {
	let timeStr = str.replace('.000Z', '')
	let timeList = timeStr.split('T')
	let hour = parseInt(timeList[1].split(':')[0])
	hour += 8
	let newHour = hour > 10? hour + '':'0'+hour
	console.log(timeList)
	console.log(newHour)
	return str
}

// 表格相关
let columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'userName', label: '昵称' },
	{ prop: 'userPic', label: '头像' },
	{ prop: 'accountNumber', label: '用户名' },
	{ prop: 'userRankName', label: '角色' },
	{ prop: 'createTime', label: '创建时间' },
	{ prop: 'operator', label: '操作', width: 250 },
]);
const page = reactive({
	index: 1,
	size: 10,
	total: 0,
});
const tableData = ref<User[]>([]);
const getData = async () => {
	const res = await getUserList('');
	if (res.data.status === 1) {
		tableData.value = res.data.queryData.rows;
		page.total = res.data.queryData.total;
	} else {
		ElMessage.error(res.data.message);
	}
};
getData();

const changePage = (val: number) => {
	page.index = val;
	// getData();
};

// 新增/编辑弹窗相关
let options = ref<FormOption>({
	labelWidth: '100px',
	span: 12,
	list: [
		{ type: 'input', label: '用户名', prop: 'accountNumber', required: true },
		{ type: 'input', label: '手机号', prop: 'phone', required: true },
		{ type: 'input', label: '密码', prop: 'password', required: true },
		{ type: 'input', label: '邮箱', prop: 'email', required: true },
		{ type: 'input', label: '角色', prop: 'role', required: true },
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
const updateData = () => {
	closeDialog();
	// getData();
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
			prop: 'userId',
			label: '用户ID',
		},
		{
			prop: 'accountNumber',
			label: '用户名',
		},
		{
			prop: 'userName',
			label: '昵称',
		},
		{
			prop: 'userSignature',
			label: '签名',
		},
		{
			prop: 'userRankName',
			label: '角色',
		},
		{
			prop: 'createTime',
			label: '注册日期',
		},
	];
	visible1.value = true;
};

// 删除相关
const handleDelete = (row: User) => {
	ElMessage.success('删除成功');
};
</script>

<style scoped></style>
