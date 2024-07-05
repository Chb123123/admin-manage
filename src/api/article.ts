import request from '../utils/request';

export const getArticlePage = (page?: Number, size?: Number) => {
  return request({
      url: '/api/article/page',
      method: 'get',
      params: {
          page: page,
          size: size
      },
  });
};