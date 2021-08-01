import type { OptionType } from './data';
import type { IListItem } from './model';
import type { OptionCategoryItem } from './sideOption';

enum OPTION_TYPE {
  radio = 1,
  checkbox = 2,
  text = 3,
  date = 4,
  image = 5,
  address = 6,
  idCard = 7,
  file = 8,
}


/** 选项面板中的每一个选项 item */
export interface ISelectItem {
  name: string;
  iconName: string;
  type: OptionType;
}

const optionItems: ISelectItem[] = [
  {
    name: '单选',
    iconName: 'icon-option-radio',
    type: 'radio',
  },
  {
    name: '多选',
    iconName: 'icon-option-checkbox',
    type: 'checkbox',
  },
  {
    name: '文本',
    iconName: 'icon-option-text',
    type: 'text',
  },
  {
    name: '日期',
    iconName: 'icon-option-calendar',
    type: 'date',
  },
  {
    name: '图片',
    iconName: 'icon-option-image',
    type: 'image',
  },
  {
    name: '地址',
    iconName: 'icon-option-address',
    type: 'address',
  },
  {
    name: '证件号码',
    iconName: 'icon-option-idcard',
    type: 'idCard',
  },
  {
    name: '文件',
    iconName: 'icon-option-file',
    type: 'file',
  },
];

// tab 右侧展示选项目录面板
const getCategories = (list: IListItem[]) => {
  return list.map((item) => {
    const { optionId, option } = item;

    const line: OptionCategoryItem = {
      id: optionId ?? '',
      name: '',
      child: [],
    };

    if (!item.optionType) {
      const { optionBase, radio } = option!;
      const { title, optionType } = optionBase;
      let child: OptionCategoryItem[] = [];
      if (
        optionType === OPTION_TYPE.radio &&
        Array.isArray(radio?.radioItemList)
      ) {
        radio!.radioItemList.map((r) => {
          const { subOptionList = [] } = r;
          child = subOptionList.map((s) => {
            const { optionId: subOptionId } = s;
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { option } = s;
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const { optionBase } = option!;
            const { title: subTitle } = optionBase;
            return { id: subOptionId!, name: subTitle };
          });
          return r;
        });
      }
      line.name = title;
      line.child = child;
    }

    return line;
  });
};

/** 新增选项-初始化数据 */
const getOptionTypeValue: (type: OptionType) => number = (type) => {
  return OPTION_TYPE[type];
};

export { optionItems, getCategories, getOptionTypeValue, OPTION_TYPE };
