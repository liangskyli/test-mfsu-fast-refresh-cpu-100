import type {
  ICheckbox,
  ICheckboxItem,
  IOptionItem,
  IRadio,
  IRadioItem,
} from '@/models/option';
import { Dropdown, Form, Input, InputNumber, Menu } from 'antd';
import { memo, useState } from 'react';
import type { ISelectItems } from '@/components/Option/OptionLibraryDialog';
import OptionLibraryDialog from '@/components/Option/OptionLibraryDialog';
import styles from '@/components/Option/OptionInfo/Components/ItemValueList/index.less';
import IconFont from '@/components/IconFont';
import type { FormInstance } from 'antd/lib/form/hooks/useForm';
import { DownOutlined } from '@ant-design/icons';
import type { MenuInfo } from 'rc-menu/lib/interface';
import OptionDialog from '@/components/Option/OptionDialog';
import SubOptionSortDialog from '@/components/Option/OptionInfo/Components/SubOptionSortDialog';
import type { FormListFieldData } from 'antd/es/form/FormList';
import MyRow from '@/components/Option/OptionInfo/Components/ItemValueList/myRow';

type Props = {
  form: FormInstance;
  // 是否有资料
  isSubmittedInfo?: boolean;
  // 单选是否有子项
  isSubItem?: boolean;
  projectId?: string;
  data?: IRadio | ICheckbox;
  itemListName: 'RadioItem_radioItemList' | 'CheckBoxItem_checkboxItemList';
};

const ItemValueList = memo(
  // Component:Foo,
  (props: Props) => {
    const {
      data,
      form,
      itemListName,
      isSubmittedInfo = false,
      isSubItem = false,
      projectId,
    } = props;

    let itemValueList: IRadioItem[] | ICheckboxItem[] = [];

    if (itemListName === 'RadioItem_radioItemList') {
      itemValueList = data ? (data as IRadio).radioItemList : [];
    }
    if (itemListName === 'CheckBoxItem_checkboxItemList') {
      itemValueList = data ? (data as ICheckbox).checkboxItemList : [];
    }

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

    const getCurRadioItem: (
      curName: number,
    ) => {
      curItemList: IRadioItem[];
      curRadioItem: IRadioItem;
    } = (curName) => {
      const curItemList: IRadioItem[] = form.getFieldValue(itemListName);
      const curRadioItem = curItemList[curName];
      if (!curRadioItem.subOptionList) {
        curRadioItem.subOptionList = [];
      }
      return { curItemList, curRadioItem };
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
          const { curRadioItem } = getCurRadioItem(name);
          setSortModalData(curRadioItem.subOptionList!);
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
      const { optionList } = selectItems;
      optionList.map((item) => {
        item.optionId = '';
        return item;
      });

      const { curItemList, curRadioItem } = getCurRadioItem(curItemIndex);
      curRadioItem.subOptionList!.push(...optionList);
      form.setFieldsValue({ [itemListName]: curItemList });

      setIsModalVisible(false);
    };

    const modalOnCancel = () => {
      setIsModalVisible(false);
    };

    const subModalOnOk = (formData: IOptionItem) => {
      // 回调数据，关闭，获取数据
      const { curItemList, curRadioItem } = getCurRadioItem(curItemIndex);
      if (subOptionTitle === '新增子项') {
        curRadioItem.subOptionList!.push(formData);
      } else {
        curRadioItem.subOptionList![editSubIndex] = formData;
      }
      form.setFieldsValue({ [itemListName]: curItemList });

      setIsSubModalVisible(false);
    };
    const subModalOnCancel = () => {
      setIsSubModalVisible(false);
    };

    const sortModalOnOk = (sortData: IOptionItem[]) => {
      // 保存排序值
      console.log('保存排序值', sortData);

      const { curItemList, curRadioItem } = getCurRadioItem(curItemIndex);
      curRadioItem.subOptionList = sortData;
      form.setFieldsValue({ [itemListName]: curItemList });

      setIsSortModalVisible(false);
    };
    const sortModalOnCancel = () => {
      setIsSortModalVisible(false);
    };

    const editSubItem = (name: number, index: number) => {
      setCurItemIndex(name);
      const { curRadioItem } = getCurRadioItem(name);
      const { subOptionList } = curRadioItem;

      setSubOptionTitle('编辑子项');
      setEditSubIndex(index);
      setSubModalData(subOptionList![index]);
      setIsSubModalVisible(true);
    };
    const deleteSubItem = (name: number, index: number) => {
      const { curItemList } = getCurRadioItem(name);
      curItemList[name].subOptionList!.splice(index, 1);
      form.setFieldsValue({ [itemListName]: curItemList });
    };

    const getSubItem = (name: number) => {
      const { curRadioItem } = getCurRadioItem(name);
      const { subOptionList } = curRadioItem;

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
                <div key={index} className={`fl ${styles['sub-item']}`}>
                  <div
                    className={`fl ${styles.pointer}`}
                    onClick={() => editSubItem(name, index)}
                  >
                    {item.option?.optionBase.title}
                  </div>
                  <div
                    className={`fl ${styles.pointer}`}
                    onClick={() => deleteSubItem(name, index)}
                  >
                    <IconFont name="icon-close" />
                  </div>
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
            <div
              className={`${styles.decrease} fl`}
              onClick={() => remove(name)}
            >
              <IconFont name="icon-decrease" />
            </div>
          ) : null}
        </div>
      );
      return htmlJSX;
    };

    return (
      <div className={styles['item-value-list']}>
        <Form.List name={itemListName} initialValue={itemValueList}>
          {(fields, { add, remove }) => (
            <>
              <div className={styles.list}>
                {fields.map((itemField) => {
                  const rowHtml = fieldRow(fields.length, itemField, remove);
                  // return rowHtml;
                  return <MyRow key={itemField.key} rowHtml={rowHtml} />;
                })}
              </div>
              <div
                className={`brand-color ${styles.add}`}
                onClick={() =>
                  add({
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
          title="关联子项"
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
          isForceInitData={true}
          data={subModalData}
        />
        <SubOptionSortDialog
          isOpen={isSortModalVisible}
          modalOnOk={sortModalOnOk}
          modalOnCancel={sortModalOnCancel}
          data={sortModalData}
        />
      </div>
    );
  },
  () => {
    return true;
  },
);

export default ItemValueList;
