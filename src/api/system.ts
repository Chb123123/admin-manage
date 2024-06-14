import request from '../utils/request';
import { SysTemTree } from '@/types/menu';

// 获取所有树形节点 管理员查看
export const getAllSysTemTree = () => {
	return request({
		url: '/api/getSystemTree',
		method: 'get',
	});
};

// 删除树节点
export const delectTreeNode = (id: Number) => {
	return request({
		url: '/api/delectTreeNode',
		method: 'delete',
		data: {
			id: id,
		},
	});
};

// 获取用户能查看的树形节点
export const getSysTemTree = () => {
	return request({
		url: '/api/getUserLimitTree',
		method: 'get',
	});
};
// 修改用户树形节点
export const editSysTemTree = (data: Object) => {
	return request({
		url: '/api/userLimit/edit',
		method: 'post',
		data: data
	});
};

// 新增节点
export const addTreeNode = (data: Object) => {
	return request({
		url: '/api/addTreeNode',
		method: 'post',
		data: data,
	});
};

// 修改节点
export const editTreeNode = (data: Object) => {
	return request({
		url: '/api/editTreeNode',
		method: 'post',
		data: data,
	});
};

// 获取用户列表
export const getUserList = (
	name: String,
	page: Number,
	size: Number
) => {
	return request({
		url: '/api/user/page',
		method: 'get',
		params: {
			name: name,
			page: page,
			size: size,
		},
	});
};

// 删除用户
export const delectUserInfo = (id: Number) => {
	return request({
		url: '/api/user/del',
		method: 'delete',
		data: {
			id: id,
		},
	});
};

// 修改用户
export const editUserInfo = (data: Object) => {
	return request({
		url: '/api/user/edit',
		method: 'post',
		data: data,
	});
};

// 获取角色列表
export const getRoleList = () => {
	return request({
		url: '/api/role/list',
		method: 'get',
	});
};
