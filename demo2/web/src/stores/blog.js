import { observable, flow, action, toJS } from 'mobx';
import _ from 'lodash';
import service from '@/service/blog';

import BaseStore from '../magicPackages/BaseStore';

class BlogStore extends BaseStore {
  constructor() {
    super(service, {
      getList: {
        serviceMethodName: 'getList',
        observableProp: 'dataList',
        successMessage: ''
      }
    });
  }
}

export default new BlogStore();
