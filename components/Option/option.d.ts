export type IOptionBase = {
  isRequired: boolean;
  title: string;
  titleDescription?: string;
  /** 收集对象 1:主购房人,2:联名购房人 */
  collectionTargetList: number[];
  /** 选项类型 1:单选 2:多选 3:文本 4:日期 5:图片 6:地址 7:证件号码 8:文件 */
  optionType: number;
  sort?: number;
};

export type IRadioItem = ICheckboxItem & {
  subOptionList?: IOptionItem[];
};

export type IRadio = {
  radioItemList: IRadioItem[];
};

export type ICheckbox = {
  checkboxItemList: ICheckboxItem[];
};

export type ICheckboxItem = {
  /** 前端排序用的唯一ID */
  id?: string;
  itemId?: string;
  itemValue: string;
  score: string;
  sort?: number;
};

export type IText = {
  /** 类型, 0:不限，1:数字 */
  textType: number;
  /** 类型, 0:整数，1:小数 */
  numType?: number;
  numMin?: string;
  numMax?: string;
  scoreRatio?: string;
  scoreMax?: string;
};

export type IDate = unknown;

export interface IImage {
  limitNum: number;
  isUseCustomUpload: boolean;
  exampleImageList: IExampleImage[];
}

export interface IExampleImage {
  title?: string;
  url?: string;
}

export type IAddress = {
  /** 地址类型 0:省/市/区,1:省/市/区 + 自主输入详细信息 */
  addressType: number;
};

export type IIdCard = {
  /** 证件类型 0:身份证 1:护照 2:港澳居民来往内地通行证 3:台胞证 255:其他 */
  typeList: number[];
};

export interface IFile {
  /** 文件类型 1:pdf 2:Png 3:JPG/JPEG */
  typeList: number[];
  /** 上传文件数量 */
  limitNum: number;
}

export type IOption = {
  optionBase: IOptionBase;
  radio?: IRadio;
  checkbox?: ICheckbox;
  text?: IText;
  date?: IDate;
  image?: IImage;
  address?: IAddress;
  idCard?: IIdCard;
  file?: IFile;
};

export type IOptionItem = {
  optionId?: string;
  projectId?: string;
  isRed?: boolean;
  option?: IOption;
};

export type IOptionInfoData = IOptionItem & {
  /** 选项类型 1:单选 2:多选 3:文本 4:日期 5:图片 6:地址 7:证件号码 8:文件 */
  optionType?: number;
};
