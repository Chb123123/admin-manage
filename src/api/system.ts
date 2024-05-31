import request from '../utils/request';
import { SysTemTree } from '@/types/menu'

// 获取所有树形节点 管理员查看
export const getAllSysTemTree = () => {
  return request({
      url: '/api/getSystemTree',
      method: 'get'
  });
};

// 删除树节点
export const delectTreeNode = (id: Number) => {
  return request({
    url: '/api/delectTreeNode',
    method: 'delete',
    data: {
      id: id
    }
  })
}

// 获取用户能查看的树形节点
export const getSysTemTree = () => {
  return request({
      url: '/api/getUserLimitTree',
      method: 'get'
  });
};

// 新增节点
export const addTreeNode = (data: Object) => {
  return request({
      url: '/api/addTreeNode',
      method: 'post',
      data: data
  });
};

// 修改节点
export const editTreeNode = (data: Object) => {
  return request({
      url: '/api/editTreeNode',
      method: 'post',
      data: data
  });
};