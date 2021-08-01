import { yxdjApi } from '@/api';
import type { IOptionInfoData } from '@/models/option';
import type { Effect, Reducer } from 'umi';
import type { ILimitCount } from './data';

export type IMasterInfo = {
  /** 主购房人信息 */
  masterDescription: string;
  /** 联名购房人信息 */
  stakeholderDescription: string;
  /** 联名购房人数量限制 */
  maxStakeholderCount: ILimitCount;
};

export interface TabItem {
  tabKey: string;
  groupName: string;
  optionGroupId: string;
  isMain: boolean;
}

export type IListItem = IOptionInfoData & {
  isEdit: boolean;
  addId?: string;
};

export interface ICurrentPane {
  groupName: string;
  optionGroupId: string;
  tabKey: string;
  closable: boolean;
  isMain: boolean;
  list: IListItem[];
}

export interface OptionsConfigState {
  activeKey: string;
  tabList: TabItem[];
  masterInfo: IMasterInfo;
  editMode: boolean;
  currentPane: ICurrentPane;
}

export interface OptionsConfig {
  namespace: string;
  state: OptionsConfigState;
  effects: {
    getMasterPaneInfo: Effect;
    updateMasterInfo: Effect;
    updateStakeholderInfo: Effect;

    getOptionGroupList: Effect;
    deleteOptionGroup: Effect;
    addOptionGroup: Effect;
    updateOptionGroup: Effect;
    moveOptionGroupList: Effect;

    getOption: Effect;
    getOptionList: Effect;
    deleteOption: Effect;
    addOption: Effect;
    updateOption: Effect;
    moveOption: Effect;
    importOption: Effect;
  };
  reducers: {
    updateState: Reducer<OptionsConfigState>;
  };
}

const OptionsConfigModel: OptionsConfig = {
  namespace: 'optionsConfig',
  state: {
    activeKey: '1',
    tabList: [
      {
        tabKey: '1',
        groupName: '购房人',
        optionGroupId: '99999',
        isMain: true,
      },
    ],
    // 主购房人信息
    masterInfo: {
      masterDescription: '主购房人描述测试文字',
      stakeholderDescription: '联名房人描述测试文字',
      maxStakeholderCount: 3,
    },
    // 模式-true-编辑模式-false-只读模式
    editMode: true,
    currentPane: {
      groupName: '购房人',
      optionGroupId: '8989898989',
      tabKey: '2',
      closable: false,
      isMain: true,
      list: [
        {
          optionId: '7890909',
          isEdit: false,
          // optionGroupId: '7788778',
          option: {
            optionBase: {
              isRequired: true,
              title: '单选组件测试',
              titleDescription: '单选组件测试单选组件测试',
              collectionTargetList: [1],
              optionType: 1, // 单选
              sort: 2,
            },
            radio: {
              radioItemList: [
                {
                  itemId: '01010',
                  itemValue: '选项值1',
                  score: '99',
                  sort: 9,
                  subOptionList: [
                    {
                      optionId: '010-1-2323',
                      option: {
                        optionBase: {
                          isRequired: true,
                          title: '子选项-标题数据11',
                          titleDescription: '子选项-标题描述信息',
                          collectionTargetList: [1, 2],
                          optionType: 1, // 单选
                          sort: 2,
                        },
                        radio: {
                          radioItemList: [],
                        },
                      },
                    },
                    {
                      optionId: '010-2-2324455',
                      option: {
                        optionBase: {
                          isRequired: true,
                          title: '子选项-标题数据22',
                          titleDescription: '子选项-标题描述信息',
                          collectionTargetList: [1, 2],
                          optionType: 1, // 单选
                          sort: 2,
                        },
                        radio: {
                          radioItemList: [],
                        },
                      },
                    },
                  ],
                },
                {
                  itemId: '02310',
                  itemValue: '选项值2',
                  score: '88',
                  sort: 8,
                  subOptionList: [
                    {
                      optionId: '010-2323',
                      option: {
                        optionBase: {
                          isRequired: true,
                          title: '子选项-标题数据11',
                          titleDescription: '子选项-标题描述信息',
                          collectionTargetList: [1, 2],
                          optionType: 1, // 单选
                          sort: 2,
                        },
                        radio: {
                          radioItemList: [],
                        },
                      },
                    },
                    {
                      optionId: '010-2324455',
                      option: {
                        optionBase: {
                          isRequired: true,
                          title: '子选项-标题数据22',
                          titleDescription: '子选项-标题描述信息',
                          collectionTargetList: [1, 2],
                          optionType: 1, // 单选
                          sort: 2,
                        },
                        radio: {
                          radioItemList: [],
                        },
                      },
                    },
                    {
                      optionId: '010-2324456',
                      option: {
                        optionBase: {
                          isRequired: true,
                          title: '子选项-标题数据22',
                          titleDescription: '子选项-标题描述信息',
                          collectionTargetList: [1, 2],
                          optionType: 1, // 单选
                          sort: 2,
                        },
                        radio: {
                          radioItemList: [],
                        },
                      },
                    },
                    {
                      optionId: '010-2324457',
                      option: {
                        optionBase: {
                          isRequired: true,
                          title: '子选项-标题数据22-标题数据22',
                          titleDescription: '子选项-标题描述信息',
                          collectionTargetList: [1, 2],
                          optionType: 1, // 单选
                          sort: 2,
                        },
                        radio: {
                          radioItemList: [],
                        },
                      },
                    },
                    {
                      optionId: '010-2324458',
                      option: {
                        optionBase: {
                          isRequired: true,
                          title: '子选项-标题数据22-子选项-标题数据22',
                          titleDescription: '子选项-标题描述信息',
                          collectionTargetList: [1, 2],
                          optionType: 1, // 单选
                          sort: 2,
                        },
                        radio: {
                          radioItemList: [],
                        },
                      },
                    },
                    // {
                    //   optionId: '010-23244599',
                    //   option: {
                    //     optionBase: {
                    //       isRequired: true,
                    //       title: '子选项-标题数据22-子选项-标题数据22',
                    //       titleDescription: '子选项-标题描述信息',
                    //       collectionTargetList: [1, 2],
                    //       optionType: 1, // 单选
                    //       sort: 2,
                    //     },
                    //     radio: {
                    //       radioItemList: [],
                    //     },
                    //   },
                    // },
                  ],
                },
              ],
            },
          },
        },
        {
          optionId: '1230909',
          isEdit: false,
          option: {
            optionBase: {
              isRequired: true,
              title: '多选组件测试',
              titleDescription: '多选组件测试多选组件测试',
              collectionTargetList: [1, 2],
              optionType: 2, // 多选
              sort: 2,
            },
            checkbox: {
              checkboxItemList: [
                {
                  itemId: '998899',
                  itemValue: '2室2厅1卫（64m²）',
                  score: '9',
                  sort: 7,
                },
                {
                  itemId: '95454899',
                  itemValue: '3室2厅1卫（79m²）',
                  score: '9',
                  sort: 9,
                },
                {
                  itemId: '9545664899',
                  itemValue: '3室2厅1卫（83m²）',
                  score: '9',
                  sort: 9,
                },
              ],
            },
          },
        },
        {
          optionId: '4560909',
          isEdit: false,
          option: {
            optionBase: {
              isRequired: true,
              title: '文本组件测试',
              titleDescription: '文本组件测试文本组件测试',
              collectionTargetList: [1],
              optionType: 3, // 文本
              sort: 2,
            },
            text: {
              textType: 0,
              numType: 1,
              numMin: '0',
              numMax: '9',
              scoreRatio: '0.5',
              scoreMax: '99',
            },
          },
        },
        {
          optionId: '55560909',
          isEdit: false,
          option: {
            optionBase: {
              isRequired: true,
              title: '日期组件测试',
              titleDescription: '日期组件测试日期组件测试',
              collectionTargetList: [1],
              optionType: 4, // 日期
              sort: 2,
            },
            date: '2021-07-27',
          },
        },
        {
          optionId: '566560909',
          isEdit: false,
          option: {
            optionBase: {
              isRequired: true,
              title: '证件号码组件测试',
              titleDescription: '证件号码组件测试证件号码组件测试',
              collectionTargetList: [1],
              optionType: 7, // 日期
              sort: 2,
            },
            idCard: {
              typeList: [0, 1],
            },
          },
        },
        {
          optionId: '566560966609',
          isEdit: false,
          option: {
            optionBase: {
              isRequired: true,
              title: '地址组件测试',
              titleDescription: '地址组件测试地址组件测试',
              collectionTargetList: [1],
              optionType: 6, // 日期
              sort: 2,
            },
            address: {
              addressType: 1,
            },
          },
        },
        {
          optionId: '566560966898609',
          isEdit: false,
          option: {
            optionBase: {
              isRequired: true,
              title: '文件组件测试',
              titleDescription: '文件组件测试文件组件测试',
              collectionTargetList: [1],
              optionType: 8, // 日期
              sort: 2,
            },
            file: {
              typeList: [1, 2, 3],
              limitNum: 3,
            },
          },
        },
        {
          optionId: '56656096-6898609',
          isEdit: false,
          option: {
            optionBase: {
              isRequired: true,
              title: '图片组件测试',
              titleDescription: '图片组件测试图片组件测试',
              collectionTargetList: [1],
              optionType: 5, // 日期
              sort: 2,
            },
            image: {
              limitNum: 8,
              isUseCustomUpload: false,
              exampleImageList: [
                {
                  title: '图片组件测试1',
                  url:
                    'https://breedadvisor.com/wp-content/uploads/2020/02/SIBERIAN-HUSKY-PORTRAIT.jpg',
                },
                {
                  title: '图片组件测试2',
                  url:
                    'https://www.dogs-wallpapers.eu/dog/dog-husky-siberian-forest.jpg',
                },
                {
                  title: '图片组件测试1',
                  url:
                    'https://grandstrandmag.com/sites/default/files/MansBestFriend-SQUARE.jpg',
                },
                {
                  title: '图片组件测试2',
                  url:
                    'http://jigsawpuzzles.online/king-include/uploads/labrador-dog-dogs-animal-pet-nature-lying-4203270734.jpg',
                },
                {
                  title: '图片组件测试1',
                  url:
                    'https://justsomething.co/wp-content/uploads/2018/10/meet-gizmo-the-grumpy-dog-who-looks-like-he-s-always-judging-you-15.jpg',
                },
                {
                  title: '图片组件测试2',
                  url:
                    'https://img.chewy.com/is/image/catalog/116134_PT1._AC_SL1500_V1545246887_.jpg',
                },
              ],
            },
          },
        },
      ],
    },
  },
  effects: {
    // 获取活动详情-拿到主购房人信息
    *getMasterPaneInfo({ payload }, { call, put }) {
      const res = yield call(yxdjApi.getActivity, payload);
      const {
        masterDescription,
        stakeholderDescription,
        maxStakeholderCount,
      } = res.data;
      const masterInfo = {
        masterDescription,
        stakeholderDescription,
        maxStakeholderCount,
      };
      yield put({
        type: 'updateState',
        payload: {
          masterInfo,
        },
      });
    },
    // 更新主购房人信息
    *updateMasterInfo({ payload }, { call }) {
      const res = yield call(yxdjApi.updateMasterInfo, payload);
      return res;
    },
    //  更新联名购房人信息
    *updateStakeholderInfo({ payload }, { call }) {
      const res = yield call(yxdjApi.updateStakeholderInfo, payload);
      return res;
    },

    /** 选项分组相关操作  */

    // 获取选项分组列表
    *getOptionGroupList({ payload }, { call, select, put }) {
      const tabList = yield select(
        ({ optionsConfig }: { optionsConfig: OptionsConfigState }) =>
          optionsConfig.tabList,
      );
      const mainTab = tabList.slice().shift();
      const res = yield call(yxdjApi.getOptionGroupList, payload);
      const { optionGroupList = [] } = res.data;
      const newTabList = optionGroupList.map((o: any) => ({
        ...o,
        tabKey: o.optionGroupId,
        groupName: o.name,
        isMain: false,
        isEdit: false,
      }));
      newTabList.unshift(mainTab);
      yield put({
        type: 'updateState',
        payload: {
          tabList: newTabList,
          editMode: false,
        },
      });
      return res;
    },
    // 删除选项分组
    *deleteOptionGroup({ payload }, { call }) {
      const res = yield call(yxdjApi.deleteOptionGroup, payload);
      return res;
    },
    // 添加选项分组
    *addOptionGroup({ payload }, { call }) {
      const res = yield call(yxdjApi.addOptionGroup, payload);
      return res;
    },
    // 更新选项分组
    *updateOptionGroup({ payload }, { call }) {
      const res = yield call(yxdjApi.updateOptionGroup, payload);
      return res;
    },
    // 移动选项分组
    *moveOptionGroupList({ payload }, { call }) {
      const res = yield call(yxdjApi.moveOptionGroupList, payload);
      return res;
    },

    /** 选项相关操作  */

    // 获取选项
    *getOption({ payload }, { call, put, select }) {
      const pane: ICurrentPane = yield select(
        ({ optionsConfig }: { optionsConfig: OptionsConfigState }) =>
          optionsConfig.currentPane,
      );
      const { list } = pane;
      const res = yield call(yxdjApi.getOption, payload);
      const { option } = res.data;
      const { optionId: id } = option;
      const newList = list.map(
        (l) => (l.optionId === id && { ...l, ...option, isEdit: false }) || l,
      );
      yield put({
        type: 'updateState',
        payload: {
          currentPane: {
            ...pane,
            list: newList,
          },
        },
      });

      return res;
    },
    // 获取选项列表
    *getOptionList({ payload }, { put, call, select }) {
      const res = yield call(yxdjApi.getOptionList, payload);
      const currentPane = yield select(
        ({ optionsConfig }: { optionsConfig: OptionsConfigState }) =>
          optionsConfig.currentPane,
      );
      const { optionList } = res.data;
      yield put({
        type: 'updateState',
        payload: {
          currentPane: {
            ...currentPane,
            list: optionList.map((item: IOptionInfoData) => ({
              ...item,
              isEdit: false,
            })),
          },
          editMode: false,
        },
      });
      return res;
    },
    // 删除选项
    *deleteOption({ payload }, { call }) {
      const res = yield call(yxdjApi.deleteOption, payload);
      return res;
    },
    // 添加选项
    *addOption({ payload }, { call }) {
      const res = yield call(yxdjApi.addOption, payload);
      return res;
    },
    // 更新选项
    *updateOption({ payload }, { call }) {
      const res = yield call(yxdjApi.updateOption, payload);
      return res;
    },

    // 移动选项
    *moveOption({ payload }, { call }) {
      const res = yield call(yxdjApi.moveOption, payload);
      return res;
    },
    // 导入选项
    *importOption({ payload }, { call }) {
      const res = yield call(yxdjApi.importOption, payload);
      return res;
    },
  },
  reducers: {
    updateState(state, { payload }) {
      console.log('payload:xxxxxxxxx ', payload);
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default OptionsConfigModel;
