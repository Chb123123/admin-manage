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
				:page-change="changePage"
			>
				<template #userPic="userPic">
					<el-image
						style="width: 50px; height: 50px"
						:src="userPic.rows.userPic"
						:zoom-rate="1.2"
						:max-scale="7"
						:min-scale="0.2"
						:initial-index="0"
						fit="cover"
						:z-index="999"
					/>
				</template>
				<template #createTime="createTime">
					<span>{{ getCreateTime(createTime.rows.createTime) }}</span>
				</template>
				<!-- utils -->
				<template #utils="utils">
					<el-button
						type="success"
						size="small"
						:icon="Key"
						@click="setLimit(utils.rows.userId)"
					>
						菜单
					</el-button>
				</template>
			</TableCustom>
		</div>
		<el-dialog
			title="菜单设置"
			v-model="visible"
			width="700px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<div class="limitTree">
				<el-tree
					ref="tree"
					style="max-width: 600px"
					:props="props"
					:default-expand-all="true"
					:data="treeData"
					:default-checked-keys="userLimitList"
					node-key="id"
					show-checkbox
					@check="handleCheckChange"
				/>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="visible = false">取 消</el-button>
				<el-button type="primary" @click="save">保 存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="system-user">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Key } from '@element-plus/icons-vue';
import { User } from '@/types/user';
import { getUserList, getAllSysTemTree, editSysTemTree } from '@/api/system';
import { getIdUserLimit } from '@/api/user';
import TableCustom from '@/components/table-custom.vue';
import TableSearch from '@/components/table-search.vue';
import { FormOptionList } from '@/types/form-option';
// getUserLimit
let loading = ref(true);
// 查询相关
const query = reactive({
	name: '',
});
const searchOpt = ref<FormOptionList[]>([
	{ type: 'input', label: '用户名：', prop: 'name' },
]);
const handleSearch = (data: Object) => {
	changePage(1);
};

const props = {
	label: 'title',
	value: 'id',
	children: 'children',
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
let userLimitList = ref([]);
let userObj = ref({
  userId: null,
  list: []
})
const setLimit = async (id: Number) => {
  userObj.value.userId = id
	const res = await getIdUserLimit(id);
	if (res.data.status === 1) {
		userLimitList.value = res.data.queryData.permiss;
		visible.value = true;
	} else {
		ElMessage.error(res.data.message);
	}
	console.log('权限设置');
};
// 表格相关
let columns = ref([
	{ type: 'index', label: '序号', width: 55, align: 'center' },
	{ prop: 'userName', label: '昵称' },
	{ prop: 'userPic', label: '头像' },
	{ prop: 'accountNumber', label: '用户名' },
	{ prop: 'userRankName', label: '角色' },
	{ prop: 'userSignature', label: '用户签名' },
	{ prop: 'createTime', label: '创建时间' },
	{ prop: 'utils', label: '操作', width: 250 },
]);
const page = reactive({
	index: 1,
	size: 10,
	total: 0,
});
const tableData = ref<User[]>([]);
const getData = async () => {
	loading.value = true;
	const res = await getUserList(query.name, page.index, page.size);
	if (res.data.status === 1) {
		tableData.value = res.data.queryData.rows;
		page.total = res.data.queryData.total;
	} else {
		ElMessage.error(res.data.message);
	}
	loading.value = false;
};
getData();

const changePage = (val: number) => {
	page.index = val;
	getData();
};
const treeData = ref([]);
const getAllTree = async () => {
	const res = await getAllSysTemTree();
	if (res.data.status === 1) {
		treeData.value = res.data.queryData;
	} else {
		ElMessage.error(res.data.message);
	}
};
getAllTree();
let tree = ref();

const handleCheckChange = (data: any) => {
  userObj.value.list = []
	let list = tree.value.getCheckedNodes();
	if (list instanceof Array) {
		for (let i = 0; i < list.length; i++) {
      if(list[i].children) continue
      userObj.value.list.push(list[i].id)
		}
	}
};
const visible = ref(false);

const save = async () => {
  const res = await editSysTemTree(userObj.value)
  if(res.data.status === 1) {
		visible.value = false;
		ElMessage.success(res.data.message);
	} else {
		ElMessage.error(res.data.message);
	}
};

const closeDialog = () => {
  userObj.value = {
    userId: null,
    list: []
  }
	visible.value = false;
};
</script>

<style scoped lang="scss">
.limitTree {
	width: 100%;
}
.dialog-footer {
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 20px 0;
}
</style>
