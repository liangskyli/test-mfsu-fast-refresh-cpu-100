import React, {useState} from 'react';
import styles from './index.less';

import Container from '../components/Card/Container'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import TableContainer from '../components/TableMove/Container'
import TabBar from "../components/TabBar";
import {Button, Table, Tooltip} from "antd";






export default function Page() {

    const [filtersData,setFiltersData] = useState([
        {
            text: 'Joe',
            value: 'Joe',
        },
        {
            text: 'Jim',
            value: 'Jim',
        },
    ]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            filters: filtersData,
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value, record) => record.name.indexOf(value) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
        },
        {
            title: 'Age',
            dataIndex: 'age',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.age - b.age,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            filters: [
                {
                    text: 'London',
                    value: 'London',
                },
                {
                    text: 'New York',
                    value: 'New York',
                },
            ],
            onFilter: (value, record) => record.address.indexOf(value) === 0,
        },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
    ];

    function onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }

    const testClick = () => {
      setFiltersData([{
          text: <Tooltip style={{width:'200px'}} title="BlackBlackBlackBlackBlackBlackBlackBlackBlackBlackBlack">
          <span style={{width:'200px'}}>BlackBlackBlackBlackBlackBlackBlackBlackBlackBlackBlack</span>
          </Tooltip>,
          value: 'BlackBlackBlackBlackBlackBlackBlackBlackBlackBlackBlack',
      },]);
    }
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
        <div>aaa</div>
        <Table columns={columns} dataSource={data} onChange={onChange} />
        <Button onClick={testClick}>test</Button>
        <DndProvider backend={HTML5Backend}>
        <TabBar  />
        </DndProvider>
      <DndProvider backend={HTML5Backend}>
        <Container />
      </DndProvider>
        <DndProvider backend={HTML5Backend}>
            <TableContainer />
        </DndProvider>
     {/* <Foo />
      <Dar />*/}
        {/*<IconFont name="icon-common-back-help" />
        >*/}
    </div>
  );
}
