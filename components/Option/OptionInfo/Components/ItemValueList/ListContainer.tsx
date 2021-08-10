import { memo, useCallback, useState } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import type {
  ICheckbox,
  ICheckboxItem,
  IOptionItem,
  IRadio,
  IRadioItem,
} from '@/components/Option/option';
import styles from '@/components/Option/OptionInfo/Components/ItemValueList/index.less';
import IconFont from '@/components/IconFont';
import { Dropdown, Form, Input, InputNumber, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';
import type { ISelectItems } from '@/components/Option/OptionLibraryDialog';
import OptionLibraryDialog from '@/components/Option/OptionLibraryDialog';
import OptionDialog from '@/components/Option/OptionDialog';
import SubOptionSortDialog from '@/components/Option/OptionInfo/Components/SubOptionSortDialog';
import ItemCard, {
  acceptSortKey,
} from '@/components/Option/OptionInfo/Components/ItemValueList/ItemCard';
import type { FormListFieldData } from 'antd/es/form/FormList';
import { v4 } from 'uuid';
import type { IConfig } from '../../index.d';

type Props = IConfig & {
  projectId?: string;
  data?: IRadio | ICheckbox;
  itemListName: 'RadioItem_radioItemList' | 'CheckBoxItem_checkboxItemList';
};

const ListContainer = memo((props: Props) => {
  const {
    data,
    form,
    itemListName,
    isSubmittedInfo,
    isSubItem,
    projectId,
  } = props;

  let itemValueList: IRadioItem[] | ICheckboxItem[] = [];

  if (itemListName === 'RadioItem_radioItemList') {
    itemValueList = data ? (data as IRadio).radioItemList : [];
  }
  if (itemListName === 'CheckBoxItem_checkboxItemList') {
    itemValueList = data ? (data as ICheckbox).checkboxItemList : [];
  }

  // data key生成
  itemValueList.map((item) => {
    item.id = v4();
    return item;
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [curItemIndex, setCurItemIndex] = useState(0);
  const [subOptionTitle, setSubOptionTitle] = useState('新增子项');
  const [subModalData, setSubModalData] = useState<IOptionItem | undefined>(
    undefined,
  );
  const [isSubModalVisible, setIsSubModalVisible] = useState(false);
  const [editSubIndex, setEditSubIndex] = useState(0);

  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [sortModalData, setSortModalData] = useState<IOptionItem[]>([]);

  const isDisabled: (name: number) => boolean = (name) => {
    return isSubmittedInfo && form.getFieldValue(itemListName)[name].itemId;
  };

  const getCurItem: (
    curName: number,
  ) => {
    curItemList: IRadioItem[];
    curItem: IRadioItem;
  } = (curName) => {
    const curItemList: IRadioItem[] = form.getFieldValue(itemListName);
    const curItem = curItemList[curName];
    if (!curItem.subOptionList) {
      curItem.subOptionList = [];
    }
    return { curItemList, curItem };
  };

  const onMenuClick: (info: MenuInfo, name: number) => void = (
    { key },
    name,
  ) => {
    switch (key) {
      case '1':
        setSubOptionTitle('新增子项');
        setSubModalData(undefined);
        setIsSubModalVisible(true);
        break;
      case '2':
        setIsModalVisible(true);
        break;
      case '3':
        const { curItem } = getCurItem(name);
        setSortModalData(curItem.subOptionList!);
        setIsSortModalVisible(true);
        break;
      default:
        break;
    }
  };

  const overlayMenu = (name: number) => {
    return (
      <Menu
        onClick={(info) => {
          setCurItemIndex(name);
          onMenuClick(info, name);
        }}
      >
        <Menu.Item key="1" className={styles['menu-item']}>
          <div className="cf">
            <div className="fl">新增子项</div>
            <div className="fl">
              <IconFont name="icon-add-sub" />
            </div>
          </div>
        </Menu.Item>
        <Menu.Item key="2" className={styles['menu-item']}>
          <div>
            关联子项
            <IconFont name="icon-link-setting" />
          </div>
        </Menu.Item>
        <Menu.Item key="3" className={styles['menu-item']}>
          <div>
            子项排序
            <IconFont name="icon-sort" />
          </div>
        </Menu.Item>
      </Menu>
    );
  };

  const modalOnOk = (selectItems: ISelectItems) => {
    // optionId 处理为空
    const optionList = selectItems.optionList!;
    optionList.map((item) => {
      item.optionId = '';
      // 单选，复选，itemId 处理为空,没有子项
      item.option?.radio?.radioItemList.map((radioItem) => {
        radioItem.itemId = '';
        return radioItem;
      });
      item.option?.checkbox?.checkboxItemList.map((checkboxItem) => {
        checkboxItem.itemId = '';
        return checkboxItem;
      });
      return item;
    });

    const { curItemList, curItem } = getCurItem(curItemIndex);
    curItem.subOptionList!.push(...optionList);
    form.setFieldsValue({ [itemListName]: curItemList });

    setIsModalVisible(false);
  };

  const modalOnCancel = () => {
    setIsModalVisible(false);
  };

  const subModalOnOk = (formData: IOptionItem) => {
    // 回调数据，关闭，获取数据
    const { curItemList, curItem } = getCurItem(curItemIndex);

    if (subOptionTitle === '新增子项') {
      curItem.subOptionList!.push(formData);
    } else {
      curItem.subOptionList![editSubIndex] = formData;
    }
    form.setFieldsValue({ [itemListName]: curItemList });

    setIsSubModalVisible(false);
  };
  const subModalOnCancel = () => {
    setIsSubModalVisible(false);
  };

  const sortModalOnOk = (sortData: IOptionItem[]) => {
    const { curItemList, curItem } = getCurItem(curItemIndex);
    curItem.subOptionList = sortData;
    form.setFieldsValue({ [itemListName]: curItemList });

    setIsSortModalVisible(false);
  };
  const sortModalOnCancel = () => {
    setIsSortModalVisible(false);
  };

  const editSubItem = (name: number, index: number) => {
    setCurItemIndex(name);
    const { curItem } = getCurItem(name);
    const { subOptionList } = curItem;

    setSubOptionTitle('编辑子项');
    setEditSubIndex(index);
    setSubModalData(subOptionList![index]);
    setIsSubModalVisible(true);
  };
  const deleteSubItem = (name: number, index: number) => {
    const { curItemList } = getCurItem(name);
    curItemList[name].subOptionList!.splice(index, 1);
    form.setFieldsValue({ [itemListName]: curItemList });
  };

  const getSubItem = (name: number) => {
    const { curItem } = getCurItem(name);
    const { subOptionList } = curItem;

    const isSubItemDisabled = (item: IOptionItem) => {
      return isSubmittedInfo && item.optionId;
    };

    if (!isSubItem || subOptionList!.length === 0) {
      return null;
    }

    return (
      <div className="cf">
        <div className={`fl ${styles['sub-line']}`}>
          <IconFont name="icon-sub-line" />
        </div>
        <div className="fl">选项关联：</div>
        <div className={`cf ${styles['sub-list']}`}>
          {subOptionList!.map((item, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div
                key={index}
                className={`fl ${styles['sub-item']} ${
                  isSubItemDisabled(item) ? styles.disabled : ''
                } ${item.isRed ? styles.red : ''}`}
              >
                {!isSubItemDisabled(item) ? (
                  <div
                    className={`fl ${styles.pointer}`}
                    onClick={() => editSubItem(name, index)}
                  >
                    {item.option?.optionBase.title}
                  </div>
                ) : (
                  <div className="fl">{item.option?.optionBase.title}</div>
                )}

                {!isSubItemDisabled(item) && (
                  <div
                    className={`fl ${styles.pointer} ${item.isRed ? styles.red : ''}`}
                    onClick={() => deleteSubItem(name, index)}
                  >
                    <IconFont name="icon-close" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const fieldRow = (
    fieldsCount: number,
    itemField: FormListFieldData,
    remove: (index: number | number[]) => void,
  ) => {
    const { key, name, fieldKey, ...restField } = itemField;
    const htmlJSX = (
      <div key={key} className={styles['item-wrap']}>
        <div key="fieldRow-item-bg" className={styles['bg-move']} />
        <div key="fieldRow-item" className={styles.item}>
          <div key="fieldRow-cf" className="cf">
            <div key="fieldRow-drag" className={`fl ${styles.drag}`}>
              <IconFont name="icon-drag" />
            </div>
            <Form.Item
              {...restField}
              className="fl"
              style={{ marginRight: '16px' }}
              name={[name, 'itemValue']}
              fieldKey={[fieldKey, 'itemValue']}
              label="选项值"
              rules={[
                { required: true, message: '请输入选项' },
                { max: 50, message: '不能超过50个字' },
              ]}
            >
              <Input
                className={
                  isSubItem
                    ? styles['item-value-radio']
                    : styles['item-value-checkbox']
                }
                placeholder="请输入选项"
                disabled={isDisabled(name)}
              />
            </Form.Item>
            <Form.Item
              {...restField}
              className="fl"
              name={[name, 'score']}
              fieldKey={[fieldKey, 'score']}
              label="积分值"
              rules={[{ required: true, message: '请输入数值' }]}
            >
              <InputNumber
                min={0}
                max={99999.99}
                precision={2}
                placeholder="请输入数值"
                disabled={isDisabled(name)}
                style={{ width: '114px' }}
              />
            </Form.Item>
            {isSubItem && (
              <Dropdown
                overlayClassName={styles['radio-drop-down']}
                overlay={() => {
                  return overlayMenu(name);
                }}
                className={`fl ${styles.more}`}
              >
                <div>
                  <div className="fl">更多操作</div>
                  <div className="fl">
                    <DownOutlined />
                  </div>
                </div>
              </Dropdown>
            )}
          </div>
          {getSubItem(name)}
        </div>
        {fieldsCount > 1 && !isDisabled(name) ? (
          <div className={`${styles.decrease} fl`} onClick={() => remove(name)}>
            <IconFont name="icon-decrease" />
          </div>
        ) : null}
      </div>
    );
    return htmlJSX;
  };

  /** *********排序逻辑开始************ */

  const find = useCallback(
    (id: string) => {
      const curItemList: IRadioItem[] = form.getFieldValue(itemListName);

      const card = curItemList.filter((c) => c.id === id)[0];
      return {
        card,
        index: curItemList.indexOf(card),
      };
    },
    [form, itemListName],
  );

  const move = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = find(id);
      const curItemList: IRadioItem[] = form.getFieldValue(itemListName);

      form.setFieldsValue({
        [itemListName]: update(curItemList, {
          $splice: [
            [index, 1],
            [atIndex, 0, card],
          ],
        }),
      });
    },
    [find, form, itemListName],
  );

  const [, drop] = useDrop(() => ({ accept: acceptSortKey }));
  /** *********排序逻辑结束************ */

  return (
    <div>
      <div className={styles['item-value-list']}>
        <Form.List name={itemListName} initialValue={itemValueList}>
          {(fields, { add, remove }) => (
            <>
              <div ref={drop} className={styles.list}>
                {fields.map((itemField, index) => {
                  const rowHtml = fieldRow(fields.length, itemField, remove);
                  const { curItem } = getCurItem(index);
                  return (
                    <ItemCard
                      key={curItem.id}
                      id={curItem.id!}
                      move={move}
                      find={find}
                      rowHtml={rowHtml}
                    />
                  );
                })}
              </div>
              <div
                className={`brand-color ${styles.add}`}
                onClick={() =>
                  add({
                    id: v4(),
                    itemId: '',
                    itemValue: '',
                    score: '0',
                  })
                }
              >
                <IconFont name="icon-add" />
                增加选项值
              </div>
            </>
          )}
        </Form.List>

        <OptionLibraryDialog
          projectId={projectId!}
          type={2}
          isOpen={isModalVisible}
          modalOnOk={modalOnOk}
          modalOnCancel={modalOnCancel}
        />
        <OptionDialog
          title={subOptionTitle}
          isOpen={isSubModalVisible}
          modalOnOk={subModalOnOk}
          modalOnCancel={subModalOnCancel}
          isShowOptionType={subOptionTitle === '新增子项'}
          isForceInitData={false}
          data={subModalData}
        />
        <SubOptionSortDialog
          isOpen={isSortModalVisible}
          modalOnOk={sortModalOnOk}
          modalOnCancel={sortModalOnCancel}
          data={sortModalData}
        />
      </div>
    </div>
  );
});

export default ListContainer;
