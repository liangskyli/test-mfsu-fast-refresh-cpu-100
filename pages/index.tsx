import React from 'react';
import styles from './index.less';

import Container from '../components/Card/Container'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import TableContainer from '../components/TableMove/Container'






export default function Page() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
        <div>aaa</div>
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
        <DndProvider backend={HTML5Backend}>
            <TableContainer />
        </DndProvider>
     {/* <Foo />
      <Dar />*/}
        {/*<IconFont name="icon-common-back-help" />
        <TabBar activeTab="orderList" />*/}
    </div>
  );
}
