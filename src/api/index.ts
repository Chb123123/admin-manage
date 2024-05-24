import request from '../utils/request';

export const fetchData = (page?: Number, size?: Number) => {
    return request({
        url: './mock/table.json',
        method: 'get',
        params: {
            page: page,
            size: size
        },
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
