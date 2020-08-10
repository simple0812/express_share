import { configure } from 'mobx';

import blogStore from './blog';
import globalStore from './global';

configure({
  enforceActions: 'always' // 严格模式
});

const stores = {
  blogStore,
  globalStore
};

export default stores;
