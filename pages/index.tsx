import React from 'react';
import styles from './index.less';
// import Foo from '../components/Foo';
// import Dar from "../components/Dar";
import IconFont from "../components/IconFont/index";
import TabBar from "../components/TabBar/index";




export default function Page() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
        <div>aaa</div>
      {/*<Foo />
      <Dar />*/}
        <IconFont name="icon-common-back-help" />
        <TabBar activeTab="orderList" />
    </div>
  );
}
