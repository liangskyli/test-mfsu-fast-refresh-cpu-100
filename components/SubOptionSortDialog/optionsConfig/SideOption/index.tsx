import { connect } from 'umi';
import classnames from 'classnames';
import { Button, Tabs } from 'antd';
import IconFont from '@/components/IconFont';
import { useState, useCallback, useMemo } from 'react';
import {
  optionItems,
  getCategories,
  getOptionTypeValue,
} from '../optionHook';
import OptionLibraryDialog from '@/components/Option/OptionLibraryDialog';

import type { ConnectRC } from 'umi';
import type { ISelectItem } from '../optionHook';
import type { OptionsConfigState, TabItem } from '../model';
import type { OptionsConfigProps, OptionType } from '../data';
import type { ISelectItems } from '@/components/Option/OptionLibraryDialog';
import styles from './index.less';
import { getUrlSearchObj } from '@/utils/common';
import { uuid } from 'uuidv4';

const { TabPane } = Tabs;

export interface OptionCategoryItem {
  id: string;
  name: string;
  child?: OptionCategoryItem[];
}

export interface IOptionItems {
  optionItems: ISelectItem[];
  onClickOption: (type: OptionType) => void;
}

const OptionTypeItems = (props: IOptionItems) => {
  const { onClickOption } = props;
  return (
    <>
      {optionItems.map(({ iconName, name, type }: ISelectItem) => (
        <div
          className={classnames(
            styles['option-type-item'],
            'flex aic jcbb csp',
          )}
          key={iconName}
          onClick={() => onClickOption(type)}
        >
          <div className="left flex aic">
            <IconFont
              name={iconName}
              className="w16 h16 mr16"
              style={{ fill: '#f65c2d' }}
            />
            <span>{name}</span>
          </div>
          <IconFont name="icon-add" className="w16 h16" />
        </div>
      ))}
    </>
  );
};

const ReadOptionTypeItems = (props: Omit<IOptionItems, 'onClickOption'>) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { optionItems } = props;
  return (
    <>
      {optionItems.map(({ iconName, name }: ISelectItem) => (
        <div
          className={classnames(styles['option-type-item'], 'flex aic jcbb')}
          key={iconName}
        >
          <div className="left flex aic">
            <IconFont
              name={iconName}
              className="w16 h16 mr16"
              style={{ fill: '#fcbeab' }}
            />
            <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>{name}</span>
          </div>
          <IconFont
            name="icon-add"
            className="w16 h16"
            style={{ fill: 'rgba(0, 0, 0, 0.25)' }}
          />
        </div>
      ))}
    </>
  );
};

interface IOptionCategory {
  categories: OptionCategoryItem[];
}

interface IParentItem {
  name: string;
  child?: OptionCategoryItem[];
}
type IChildItem = Pick<IParentItem, 'name'>;

const OptionCategory = (props: IOptionCategory) => {
  const ParentItem = (parentProps: IParentItem) => (
    <div className={styles['option-type-item']}>{parentProps.name}</div>
  );
  const ChildItem = (childProps: IChildItem) => (
    <div className={styles['option-type-item']}>
      <IconFont name="icon-link-setting" className="w16 h16 mr8" />
      <span>{childProps.name}</span>
    </div>
  );
  const { categories = [] } = props;

  return (
    <>
      {categories.map((item: OptionCategoryItem) => (
        <div key={item.id}>
          <ParentItem name={item.name} />
          {Array.isArray(item?.child) &&
            item.child.map((c) => <ChildItem key={c.id} name={c.name} />)}
        </div>
      ))}
    </>
  );
};

export interface ITabpaneItem {
  title: string;
  content: React.ReactNode;
  key: string;
  closable: boolean;
}

export interface IOptionProp {
  optionItems: ISelectItem[];
  onClickOption: (type: OptionType) => void;
  isReadFlag: boolean;
}

export interface ICategoryProp {
  categories: OptionCategoryItem[];
}

// 获取选项类型面板和选项概览 数据
const getTabpaneContent = (
  optionProp: IOptionProp,
  categoryProp: ICategoryProp,
) => {
  const { onClickOption, isReadFlag } = optionProp;
  const { categories } = categoryProp;
  const optionTypes: ITabpaneItem[] = [
    {
      title: '选项类型',
      content: !isReadFlag ? (
        <OptionTypeItems
          optionItems={optionItems}
          onClickOption={onClickOption}
        />
      ) : (
        <ReadOptionTypeItems optionItems={optionItems} />
      ),
      key: '1',
      closable: false,
    },
    {
      title: '选项概览',
      content: <OptionCategory categories={categories} />,
      key: '2',
      closable: false,
    },
  ];
  return optionTypes;
};

const SideOption: ConnectRC<OptionsConfigProps> = ({
  optionsConfig,
  dispatch,
}) => {
  const { projectId } = getUrlSearchObj(window.location.search);
  const { editMode, activeKey, tabList = [], currentPane } = optionsConfig;
  const { list, optionGroupId } = currentPane;

  const isMain = useMemo(() => {
    const tab = tabList.find((t) => t.tabKey === activeKey) as TabItem;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { isMain } = tab;
    return isMain;
  }, [activeKey, tabList]);

  const updateModelState = useCallback(
    (payload: any) => {
      dispatch({
        type: 'optionsConfig/updateState',
        payload,
      });
    },
    [dispatch],
  );

  const [tabKey, setTabKey] = useState('1');
  const handleTabChange = useCallback((key: string) => setTabKey(key), []);
  const [modalVisible, setModalVisible] = useState(false);

  // 侧边选项配置栏相关
  const onOptionSelect = useCallback(
    (type: OptionType) => {
      const option = {
        isEdit: true,
        optionType: getOptionTypeValue(type),
        addId: uuid(),
      };
      const newList = list.slice();
      newList.push(option);
      const pane = {
        ...currentPane,
        list: newList,
      };
      const payload = {
        currentPane: pane,
      };
      updateModelState(payload);
    },
    [currentPane, list, updateModelState],
  );

  const getPaneInfo = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async (optionGroupId: string) => {
      const params = {
        optionGroupId,
      };
      dispatch({
        type: 'optionsConfig/getOptionList',
        payload: {
          params,
        },
      });
    },
    [dispatch],
  );

  const modalOnOk = (selectItems: ISelectItems) => {
    const { libraryOptionIdList } = selectItems;
    dispatch({
      type: 'optionsConfig/importOption',
      payload: {
        data: libraryOptionIdList,
      },
    }).then(() => {
      setModalVisible(false);
      getPaneInfo(optionGroupId);
    });
  };

  const modalProps = {
    projectId: projectId!,
    title: '从选项库引入',
    isOpen: modalVisible,
    modalOnOk,
    modalOnCancel: () => setModalVisible(false),
  };

  const isReadFlag = isMain || editMode || list.some((l) => l.isEdit);

  const optionProp = useMemo(
    () => ({ optionItems, onClickOption: onOptionSelect, isReadFlag }),
    [onOptionSelect, isReadFlag],
  );
  const categories = useMemo(() => getCategories(list), [list]);
  const categoryProp = useMemo(() => ({ categories }), [categories]);
  const tabPaneContents = getTabpaneContent(optionProp, categoryProp);

  return (
    <div className={styles['right-config']}>
      <div className={styles['import-btn-wrapper']}>
        <Button
          type="primary"
          className={styles['import-btn']}
          onClick={() => setModalVisible(true)}
          disabled={isReadFlag}
        >
          从选项库引入
        </Button>
      </div>
      <div className={styles['option-type-pane-wrapper']}>
        <Tabs
          centered
          onChange={handleTabChange}
          activeKey={tabKey}
          className={styles['option-type-pane-tabs']}
        >
          {tabPaneContents.map(({ title, key, content }: ITabpaneItem) => (
            <TabPane
              tab={title}
              className={styles['option-tab-pane']}
              key={key}
            >
              {content}
            </TabPane>
          ))}
        </Tabs>
      </div>
      <OptionLibraryDialog {...modalProps} />
    </div>
  );
};

const mapStateToProps = ({
  optionsConfig,
}: {
  optionsConfig: OptionsConfigState;
}) => ({ optionsConfig });

export default connect(mapStateToProps)(SideOption) as any;
