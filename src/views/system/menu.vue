<template>
	<div v-loading="loading">
		<div class="container">
			<TableCustom
				:columns="columns"
				:existQuery="false"
				:tableData="treeData"
				row-key="id"
				tableHeight="calc(100vh - 270px)"
				:has-pagination="false"
				:viewFunc="handleView"
				:delFunc="handleDelete"
				:editFunc="handleEdit"
				:refresh="getTree"
			>
				<template #toolbarBtn>
					<el-button
						type="warning"
						:icon="CirclePlusFilled"
						@click="addFormData"
						>新增</el-button
					>
				</template>
				<template #icon="{ rows }">
					<el-icon>
						<component :is="rows.icon"></component>
					</el-icon>
				</template>
			</TableCustom>
		</div>
		<el-dialog
			:title="isEdit ? '编辑' : '新增'"
			v-model="visible"
			width="700px"
			destroy-on-close
			:close-on-click-modal="false"
			@closed="closeDialog"
		>
			<TableEdit
				:form-data="rowData"
				:options="options"
				:edit="isEdit"
				:update="updateData"
			>
				<template #parentId>
					<el-cascader
						:disabled="isEdit"
						style="width: 100%;"
						v-model="rowData.parentId"
						:options="treeData"
						:props="{
							checkStrictly: true,
							label: 'title',
							value: 'id',
							emitPath: false,
						}"
						clearable
					/>
				</template>
			</TableEdit>
		</el-dialog>
		<el-dialog
			title="查看详情"
			v-model="visible1"
			width="700px"
			destroy-on-close
		>
			<TableDetail :data="viewData">
				<template #icon="{ rows }">
					<el-icon>
						<component :is="rows.icon"></component>
					</el-icon>
				</template>
			</TableDetail>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="system-menu">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { CirclePlusFilled } from '@element-plus/icons-vue';
import { SysTemTree } from '@/types/menu';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import { FormOption } from '@/types/form-option';
import {
	getAllSysTemTree,
	delectTreeNode,
	addTreeNode,
	editTreeNode,
} from '@/api/system';

// 表格相关
let columns = ref([
	{ prop: 'title', label: '菜单名称', align: 'left' },
	{ prop: 'icon', label: '图标' },
	{ prop: 'path', label: '路由路径' },
	{ prop: 'id', label: '权限标识' },
	{ prop: 'operator', label: '操作', width: 250 },
]);

let loading = ref(true)
let treeData = ref();

const getTree = async () => {
	loading.value = true
	const res = await getAllSysTemTree();
	if (res.data.status === 1) {
		treeData.value = res.data.queryData;
	} else {
		ElMessage.error(res.data.message);
	}
	loading.value = false
};
getTree();

// 新增/编辑弹窗相关
let options = ref<FormOption>({
	labelWidth: '100px',
	span: 12,
	list: [
		{ type: 'input', label: '菜单名称', prop: 'title', required: true },
		{ type: 'input', label: '路由路径', prop: 'path', required: true },
		{ type: 'input', label: '图标', prop: 'icon' },
		{ type: 'parent', label: '父菜单', prop: 'parentId' },
	],
});
const visible = ref(false);
const isEdit = ref(false);
const rowData = ref<any>({});

const addFormData = () => {
	rowData.value = {
		title: '',
		path: '',
		parentId: '',
		icon: '',
		zIndex: '',
	};
	isEdit.value = false;
	visible.value = true;
};
const handleEdit = (row: SysTemTree) => {
	rowData.value = JSON.parse(JSON.stringify(row));
	isEdit.value = true;
	visible.value = true;
};
const updateData = async (form: Object) => {
	let res = null;
	if (isEdit.value) {
		res = await editTreeNode(form);
	} else {
		const formDate: Object = { ...form, parentId: rowData.value.parentId };
		res = await addTreeNode(formDate);
	}
	try {
		if (res.data.status === 1) {
			getTree();
			closeDialog();
			ElMessage.success(res.data.message);
		} else {
			ElMessage.error(res.data.message);
		}
	} catch (error) {
		ElMessage.error('获取数据失败');
	}
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
const handleView = (row: SysTemTree) => {
	viewData.value.row = { ...row };
	viewData.value.list = [
		{
			prop: 'id',
			label: '菜单ID',
		},
		{
			prop: 'parentId',
			label: '父菜单ID',
		},
		{
			prop: 'title',
			label: '菜单名称',
		},
		{
			prop: 'path',
			label: '路由路径',
		},
		{
			prop: 'id',
			label: '权限标识',
		},
		{
			prop: 'icon',
			label: '图标',
		},
	];
	visible1.value = true;
};

// 删除相关
const handleDelete = async (row: SysTemTree) => {
	const res = await delectTreeNode(row.id);
	if (res.data.status === 1) {
		getTree();
		ElMessage.success(res.data.message);
	}
	ElMessage.error(res.data.message);
};
</script>

<style scoped></style>
