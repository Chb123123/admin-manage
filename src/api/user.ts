import request from '../utils/request';


interface LoginInfo {
	accountNumber: string;
	password: string;
}

// 登入账号
export const loginUser = (info: LoginInfo) => {
  return request({
      url: '/my/loginFunction',
      method: 'post',
      data: info
  });
};

// 获取用户权限
export const getUserLimit = () => {
  return request({
      url: '/api/getUserLimit'
  });
};