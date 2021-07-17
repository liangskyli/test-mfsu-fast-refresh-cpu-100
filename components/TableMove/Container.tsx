import { memo, useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import { Row } from './Row'
import update from 'immutability-helper'
import { ItemTypes } from './ItemTypes'
import { Table } from 'antd';

const data = [
    {
        name: '1John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        id: '1',
    },
    {
        name: '2Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        id: '2',
    },
    {
        name: '3Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        id: '3',
    },
];
const Container = memo(function Container() {
    const columns = [
        {
            title: 'Sort',
            dataIndex: 'sort',
            width: 30,
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ];

    const [dataSource, setDataSource] = useState(data);

    const find = useCallback(
        (id: string) => {
            const item = dataSource.filter((c) => `${c.id}` === id)[0]
            return {
                item,
                index: dataSource.indexOf(item),
            }
        },
        [dataSource],
    )

    const move = useCallback(
        (id: string, atIndex: number) => {
            const { item, index } = find(id);

            setDataSource(
                update(dataSource, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, item],
                    ],
                }),
            )
        },
        [find, dataSource, setDataSource],
    );

    const [, drop] = useDrop(() => ({ accept: ItemTypes.TABLE }))

    const dragableContainer = (props) => <tbody ref={drop} {...props} />;

    return (
        <Table
            pagination={false}
            dataSource={dataSource}
            columns={columns}
            rowKey="id"
            components={{
                body: {
                    wrapper: dragableContainer,
                    row: (props) => <Row
                        id={props['data-row-key']}
                        move={move}
                        find={find}
                        {...props}/>,
                },
            }}
        />
    )
})

export default Container;
