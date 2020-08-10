import React from 'react';
import styles from './index.less';
function DrawerTitle(props) {
  return <div className={styles.drawerTitle}>{props.children}</div>;
}

export default DrawerTitle;
