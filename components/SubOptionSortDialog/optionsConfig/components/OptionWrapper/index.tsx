import { getDvaApp } from 'umi';
import IconFont from '@/components/IconFont';
import { Input, Empty, Form } from 'antd';
import React, { useCallback, useMemo } from 'react';
import OptionInfo, { getFormData } from '@/components/Option/OptionInfo';
import { OptionPane, OptionPreviewPane } from '../optionPane';
import {
  RadioPane,
  TextPane,
  DatePane,
  CheckBoxPane,
  IdCardPane,
  AddressPane,
  FilePane,
  ImagePane,
} from '@/components/Option/OptionPreview';
import type { IOptionPreviewPane } from '../optionPane';
import type { IOptionInfoData } from '@/models/option';
import type { Props as IOptionInfo } from '@/components/Option/OptionInfo';
import type { RuleObject } from 'antd/lib/form';
import type { IListItem, OptionsConfigState, TabItem } from '../../model';
import styles from './index.less';
import { OPTION_TYPE } from '../../optionHook';
import { getUrlSearchObj } from '@/utils/common';
import { cloneDeep } from 'lodash';

interface IOptionGroupHeader {
  tabKey: string;
  editMode: boolean;
  groupName: string;
  updateMode: (value: boolean) => void;
  updateGroup: (key: string, value: string) => void;
  getTabList: () => void;
}

// 选项面板顶部-选项分组部分
const OptionGroupHeader = (props: IOptionGroupHeader) => {
  const {
    editMode,
    groupName = '',
    updateGroup,
    getTabList,
    updateMode,
    tabKey,
  } = props;
  const [form] = Form.useForm();
  const saveGroupName = async () => {
    const values = await form.validateFields();
    if (!values) return;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { groupName } = values;
    await updateGroup(tabKey, groupName);
    await getTabList();
  };

  const groupNameValidator = (_: RuleObject, value: string) => {
    if (!value || value?.trim() === '') {
      return Promise.reject('请输入选项分组名称');
    }
    if (value.trim().length > 16) {
      return Promise.reject('仅支持录入16个字以内');
    }
    return Promise.resolve();
  };
  return (
    <div className={styles['option-group-header']}>
      <p>选项分组名称</p>
      {editMode ? (
        <Form form={form}>
          <Form.Item
            name="groupName"
            rules={[{ validator: groupNameValidator }]}
            initialValue={groupName}
          >
            <Input
              style={{ width: '240px' }}
              onChange={(e) =>
                form.setFieldsValue({ groupName: e.target.value })
              }
              onBlur={() => saveGroupName()}
            />
          </Form.Item>
        </Form>
      ) : (
        <div className="flex aic">
          <div className="fz20 fwb">{groupName}</div>
          <IconFont
            name="icon-edit"
            className="w16 h16 ml8 flex csp"
            style={{ fill: '#f65c2d' }}
            onClick={() => updateMode(true)}
          />
        </div>
      )}
    </div>
  );
};

export interface IOptionWrapper extends TabItem {
  list: IOptionInfoData[];
  updateGroup: (key: string, value: string) => void;
  getTabList: () => void;
  getPaneInfo: (optionGoupId: string) => void;
  optionsConfig: OptionsConfigState;
}

// 选项面板容器
const OptionWrapper: React.FC<IOptionWrapper> = ({
  optionsConfig,
  updateGroup,
  getTabList,
  getPaneInfo,
}) => {
  const { currentPane, tabList, activeKey, editMode } = optionsConfig;
  const { list, optionGroupId } = currentPane;

  // eslint-disable-next-line no-underscore-dangle
  const { dispatch } = getDvaApp()._store;

  // TODOS

  const updateModelState = useCallback(
    (payload: any) => {
      dispatch({
        type: 'optionsConfig/updateState',
        payload,
      });
    },
    [dispatch],
  );

  const updateMode = useCallback(
    (value: boolean) => {
      dispatch({
        type: 'optionsConfig/updateState',
        payload: { editMode: value },
      });
    },
    [dispatch],
  );

  const getOption = useCallback(
    (optionId: string) => {
      const params = {
        optionId,
      };
      dispatch({
        type: 'optionsConfig/getOption',
        payload: { params },
      });
    },
    [dispatch],
  );

  const addOption = async (option: IOptionInfoData) => {
    return await dispatch({
      type: 'optionsConfig/addOption',
      payload: {
        data: option,
      },
    });
  };

  const updateOption = async (option: IOptionInfoData) => {
    return await dispatch({
      type: 'optionsConfig/updateOption',
      payload: {
        data: option,
      },
    });
  };

  const handleEditSave = async (item: any) => {
    const { form, optionId } = item;
    const values = await getFormData(form);
    const saveData: IOptionInfoData & { optionGroupId: string } = {
      optionGroupId: activeKey,
      ...values,
    };
    // 新增
    if (!optionId) {
      const {
        data: { optionId: id },
      } = await addOption(saveData);
      await getPaneInfo(id); // 获取所有 option
    } else {
      // 更新
      await updateOption(saveData);
      await getOption(optionId); // 只更新改变的 option
    }
  };

  const handleEditCancel = (item: IListItem) => {
    const { optionId, addId } = item;

    // 判断是否为新增或者编辑
    let pane;
    // 编辑的数据
    if (item.optionId) {
      const newList = list.map((l) =>
        l.optionId === optionId ? { ...l, isEdit: false } : l,
      );
      pane = { ...currentPane, list: newList };
    } else {
      const newList = list.filter((l) => l.addId !== addId);
      pane = { ...currentPane, list: newList };
    }
    const payload = {
      currentPane: pane,
    };
    updateModelState(payload);
  };

  const handleEdit = (optionId: string) => {
    if (editMode) return;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { list = [] } = currentPane;
    const newList = list.map(
      (item) =>
        (item.optionId === optionId && { ...item, isEdit: true }) || item,
    );
    const pane = { ...currentPane, list: newList };
    const payload = {
      currentPane: pane,
    };
    updateModelState(payload);
  };

  // 上下移动排序
  const handleMove = useCallback(
    async (optionId: string, step: number) => {
      if (editMode) return;
      const data = {
        optionId,
        step,
      };
      await dispatch({
        type: 'optionsConfig/moveOption',
        payload: {
          data,
        },
      });
      await getPaneInfo(optionGroupId);
    },
    [dispatch, editMode, getPaneInfo, optionGroupId],
  );

  const handleDelete = async (item: IListItem) => {
    if (editMode) return;
    const { optionId } = item;
    await dispatch({
      type: 'optionsConfig/deleteOption',
      payload: {
        optionId,
      },
    });
    await getPaneInfo(optionGroupId);
  };

  const name = useMemo(() => {
    const { groupName } = tabList.find(
      (item) => item.tabKey === activeKey,
    ) as TabItem;
    return groupName;
  }, [activeKey, tabList]);

  const optionGroupHeaderProps: IOptionGroupHeader = {
    tabKey: activeKey,
    editMode,
    updateMode,
    groupName: name,
    updateGroup,
    getTabList,
  };

  interface IEditOptionItem extends IOptionInfo, IListItem {
    addId?: string;
    isFirst: boolean;
    isLast: boolean;
  }
  const { projectId } = getUrlSearchObj(window.location.search);
  type IPaneItem = Omit<IEditOptionItem, 'form'>;
  const paneList: IPaneItem[] = cloneDeep(list).map((item, index, arr) => {
    return {
      ...item,
      isFirst: index === 0,
      isLast: index === arr.length - 1,
      isShowOptionType: false, // 是否显示选项类型
      isSubmittedInfo: false, // 是否有资料 todo
      isSubItem: true,// 单选是否有子项
      data: {
        ...item,
        projectId,
      },
    };
  });

  const getPaneCom = (item: IListItem) => {
    const { option, optionId } = item;
    const {
      optionBase,
      radio,
      text,
      date,
      checkbox,
      idCard,
      address,
      file,
      image,
    } = option!;
    const { optionType } = optionBase;
    const typeToCom: Record<number, React.ReactNode> = {
      [OPTION_TYPE.radio]: <RadioPane key={optionId} {...radio!} />,
      [OPTION_TYPE.checkbox]: <CheckBoxPane key={optionId} {...checkbox!} />,
      [OPTION_TYPE.date]: <DatePane key={optionId} {...date!} />,
      [OPTION_TYPE.text]: <TextPane key={optionId} {...text!} />,
      [OPTION_TYPE.idCard]: <IdCardPane key={optionId} {...idCard!} />,
      [OPTION_TYPE.address]: <AddressPane key={optionId} {...address!} />,
      [OPTION_TYPE.file]: <FilePane key={optionId} {...file!} />,
      [OPTION_TYPE.image]: <ImagePane key={optionId} {...image!} />,
    };
    return typeToCom[optionType];
  };

  const [form] = Form.useForm();

  // 存在编辑元素，则整个页面其他部分为只读不可操作
  const isReadFlag = editMode || list.some((l) => l.isEdit);

  const renderPane = (item: IPaneItem) => {
    const previewItem: IOptionPreviewPane | IEditOptionItem = {
      paneItem: item,
      onEdit: handleEdit,
      onMove: handleMove,
      onDelete: handleDelete,
      isFirst: item.isFirst,
      isLast: item.isLast,
      isReadFlag,
    };
    const { isEdit } = item;

    return isEdit ? (
      <OptionPane
        key={item.optionId || item.addId}
        onSave={() => handleEditSave({ ...item, form })}
        onCancel={() => handleEditCancel(item)}
      >
        <OptionInfo {...item} form={form} />
      </OptionPane>
    ) : (
      <OptionPreviewPane key={previewItem.paneItem.optionId} {...previewItem}>
        {getPaneCom(previewItem.paneItem)}
      </OptionPreviewPane>
    );
  };

  const renderFlag = Array.isArray(paneList) && paneList.length;

  return (
    <div className={styles['option-wrapper']}>
      <OptionGroupHeader {...optionGroupHeaderProps} />
      {renderFlag ? (
        paneList.map((l) => renderPane(l))
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无选项，请先在右侧选项类型面板添加"
          className={styles['empty-wrapper']}
        />
      )}
    </div>
  );
};

export default OptionWrapper;
