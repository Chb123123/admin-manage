import request from '../utils/request';

// 分页查询文章列表
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

// 删除文章
export const delectArticle = (id: String) => {
  return request({
    url: "",
    method: "delete",
    data: {
      id: id
    }
  })
}