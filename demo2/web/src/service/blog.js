import BaseService, { postFn } from '../magicPackages/BaseService';

class BlogService extends BaseService {
  constructor() {
    super('blog', {
      getList: `/api/v1/blog/getList`, // 字符串表示只配置url了字段 method使用默认的配置(获取数据使用get 增删改使用post)
      getDetail: {
        url: `/api/v1/blog/getDetail`,
        method: 'get',
        formatParams: ''
      },

      create: `/api/v1/blog/create`,
      update: `/api/v1/blog/update`,
      multiUpdate: `/api/v1/blog/update`,
      remove: postFn(`/api/v1/blog/remove`)
    });
  }
}

export default new BlogService();
