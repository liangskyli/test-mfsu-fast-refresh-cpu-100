import { Input, Modal, Table } from 'antd';
import type { ChangeEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { IOptionItem } from '@/models/option';
import type { ColumnProps } from 'antd/es/table';
import type {
  IOptionLibraryItem,
  IOptionLibraryList,
} from '@/pages/optionLibrary/data';
import { optionTypeTextList } from '@/utils/config';
import type { HttpJson } from '@/api';
import { getDvaApp } from 'umi';
import styles from './index.less';
import type { IOptionList } from '@/pages/optionLibrary/data';
import type { TableRowSelection } from 'antd/lib/table/interface';

export type ISelectItems = {
  libraryOptionIdList: string[];
  optionList: IOptionItem[];
};

type Props = {
  projectId: string;
  title?: string;
  isOpen: boolean;
  modalOnOk?: (selectItems: ISelectItems) => void;
  modalOnCancel?: (e: MouseEvent<HTMLElement>) => void;
};

const OptionLibraryDialog = (props: Props) => {
  const {
    projectId,
    title = '关联子项',
    isOpen,
    modalOnOk,
    modalOnCancel,
  } = props;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(8);
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [listData, setListData] = useState<IOptionLibraryList>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [showTipInfo, setShowTipInfo] = useState(false);

  const getList = useCallback(() => {
    // eslint-disable-next-line no-underscore-dangle
    getDvaApp()
      ._store.dispatch({
        type: 'optionLibrary/getDialogList',
        payload: {
          params: {
            projectId,
            optionType: -1,
            pageIndex,
            pageSize,
            keyword: searchKeyword,
          },
        },
      })
      .then((res: HttpJson<IOptionLibraryList>) => {
        setListData(res.data);
      });
  }, [pageIndex, pageSize, searchKeyword, projectId]);

  const changeKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const onSearch = (value: string) => {
    setPageIndex(1);
    setSearchKeyword(value);
    if (searchKeyword === value) {
      getList();
    }
  };

  useEffect(() => {
    if (isOpen) {
      getList();
    }
  }, [isOpen, getList]);

  useEffect(() => {
    return () => {
      setPageIndex(1);
      setKeyword('');
      setSearchKeyword('');
      setSelectedRowKeys([]);
      setShowTipInfo(false);
    };
  }, [isOpen]);

  const columns: ColumnProps<IOptionLibraryItem>[] = [
    {
      title: '选项名称',
      dataIndex: 'title',
    },
    {
      title: '选项类型',
      dataIndex: 'optionType',
      width: 100,
      render: (value: number) => {
        const text = optionTypeTextList[value];
        return <div>{text}</div>;
      },
    },
  ];

  const pagination = {
    simple: true,
    pageSize,
    total: listData?.total,
    current: pageIndex,
    onChange: (page: number) => {
      setPageIndex(page);
    },
  };

  const onOk = async () => {
    if (selectedRowKeys.length === 0) {
      setShowTipInfo(true);
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    const res: HttpJson<IOptionList> = await getDvaApp()._store.dispatch({
      type: 'optionLibrary/getOptionDetailList',
      payload: {
        params: {
          libraryOptionIds: selectedRowKeys,
        },
      },
    });

    const optionItems: ISelectItems = {
      libraryOptionIdList: selectedRowKeys,
      optionList: res.data.optionList,
    };
    if (modalOnOk) {
      modalOnOk(optionItems);
    }
  };

  const onSelectRowChange = (selected: string[]) => {
    setSelectedRowKeys(selected);
  };

  const rowSelection: TableRowSelection<IOptionLibraryItem> = {
    selectedRowKeys,
    // @ts-ignore
    onChange: onSelectRowChange,
  };

  return (
    <Modal
      title={title}
      visible={isOpen}
      onOk={onOk}
      onCancel={modalOnCancel}
      width={540}
      destroyOnClose
    >
      {listData && (
        <>
          <div className="cf lh32">
            <div className="fl fwb">
              <span className="fz16">选项库</span>
              {selectedRowKeys.length === 0 && showTipInfo && (
                <span className="c-red mgl8">请至少选择一项</span>
              )}
            </div>
            <div className="fr">
              <Input.Search
                placeholder="输入选项名称或类型搜索"
                allowClear
                value={keyword}
                onChange={changeKeyword}
                onSearch={onSearch}
                style={{ width: 256 }}
              />
            </div>
          </div>
          <div className="mgt16 pr">
            <Table
              className={styles.table}
              dataSource={listData.list}
              columns={columns}
              pagination={pagination}
              rowKey="libraryOptionId"
              scroll={{ y: 330 }}
              rowSelection={rowSelection}
            />
            <div className={styles['select-count']}>
              已选 {selectedRowKeys.length} 项
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};
export default OptionLibraryDialog;
