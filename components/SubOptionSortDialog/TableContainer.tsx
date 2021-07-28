import { memo, MutableRefObject, useCallback, useImperativeHandle, useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { Table } from 'antd';
import type { ColumnProps } from 'antd/es/table';
import type { IOptionItem } from '@/models/option';
import styles from '@/components/Option/OptionInfo/Components/SubOptionSortDialog/index.less';
import IconFont from '@/components/IconFont';
import { optionTypeTextList } from '@/utils/config';
import {
  SortRow,
  ItemTypes,
} from '@/components/Option/OptionInfo/Components/SubOptionSortDialog/SortRow';

type Props = {
  cRef: MutableRefObject<any | undefined>;
  data: (IOptionItem & { id?: string })[];
};

const TableContainer = memo(
  (props: Props) => {
    const { data,cRef } = props;

    // data key生成
    data.map((item, key) => {
      item.id = `${key}`;
      return item;
    });

    const columns: ColumnProps<IOptionItem>[] = [
      {
        title: '排序',
        key: 'sort',
        width: 64,
        align: 'center',
        render: () => {
          return (
            <div className={styles.drag}>
              <IconFont name="icon-drag" />
            </div>
          );
        },
      },
      {
        title: '选项名称',
        key: 'title',
        render: (value, record) => {
          return record.option!.optionBase.title;
        },
      },
      {
        title: '选项类型',
        key: 'optionType',
        width: 100,
        render: (value, record) => {
          const text = optionTypeTextList[record.option!.optionBase.optionType];
          return <div>{text}</div>;
        },
      },
    ];

    const [dataSource, setDataSource] = useState(data);
    useImperativeHandle(cRef, () => ({
      // changeVal 就是暴露给父组件的方法
      getSortData: () => {
        return dataSource;
      }
    }));

    const find = useCallback(
      (id: string) => {
        const item = dataSource.filter((c) => c.id === id)[0];
        return {
          item,
          index: dataSource.indexOf(item),
        };
      },
      [dataSource],
    );

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
        );
      },
      [find, dataSource, setDataSource],
    );

    const [, drop] = useDrop(() => ({ accept: ItemTypes }));

    const dragableContainer = (dragableProps: any) => <tbody ref={drop} {...dragableProps} />;

    return (
      <Table
        className={styles.table}
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        scroll={{ y: 330 }}
        pagination={false}
        components={{
          body: {
            wrapper: dragableContainer,
            row: (rowProps: any) => (
              <SortRow
                id={rowProps['data-row-key']}
                move={move}
                find={find}
                {...rowProps}
              />
            ),
          },
        }}
      />
    );
  },
  () => {
    return true;
  },
);

export default TableContainer;
