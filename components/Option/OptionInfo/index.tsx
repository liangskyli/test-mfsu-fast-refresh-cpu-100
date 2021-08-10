import type {
  IExampleImage,
  IOptionInfoData,
  IOptionItem, IRadio,
} from '@/components/Option/option';
import styles from './index.less';
import { Checkbox, Form, Input, Modal, Select, Switch } from 'antd';
import type { MutableRefObject } from 'react';
import { useEffect, useImperativeHandle, useState } from 'react';
import ShowRender from '@/components/ShowRender';
import { OPTION_TYPE, optionTypeTextList } from '@/components/Option/config';
import IdCardItem from '@/components/Option/OptionInfo/IdCardItem';
import RadioItem from '@/components/Option/OptionInfo/RadioItem';
import CheckBoxItem from '@/components/Option/OptionInfo/CheckBoxItem';
import TextItem from '@/components/Option/OptionInfo/TextItem';
import ImageItem from '@/components/Option/OptionInfo/ImageItem';
import AddressItem from '@/components/Option/OptionInfo/AddressItem';
import FileItem from '@/components/Option/OptionInfo/FileItem';
import type { UploadFile } from 'antd/es/upload/interface';
import type { IRadioItem } from '@/components/Option/option';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import type { IConfig } from './index.d';
import { v4 } from 'uuid';
import { cloneDeep } from 'lodash';

export type IOptionInfoRef = {
  getFormData: (scrollToField?: boolean) => Promise<IOptionItem>;
};

type Props = Omit<IConfig, 'form'> & {
  cRef: MutableRefObject<IOptionInfoRef | undefined>;
  data?: IOptionInfoData;
  errModalOkCallback?: (formData: IOptionItem) => void;
};

type IErrObj = {
  /** 收集对象 1:主购房人,2:联名购房人 */
  collectionTarget: number;
  list: {
    id: string;
    itemValue: string;
    subOptionList: string[];
  }[];
  formData: IOptionItem;
};

export type IOptionInfo = Props;

type IList = {
  optionType: number;
  name: string;
};

const collectionTargetNameList = ['', '主购房人', '联名购房人'];

const OptionInfo = (props: Props) => {
  const {
    cRef,
    isShowOptionType = false,
    isSubmittedInfo = false,
    isSubItem = false,
    isForceInitData = true,
    errModalOkCallback,
  } = props;
  let { data } = props;
  if (!data || (isForceInitData && !data.optionId)) {
    data = {
      optionId: '',
      projectId: data?.projectId ?? '',
      option: {
        optionBase: {
          isRequired: false,
          title: '',
          titleDescription: '',
          collectionTargetList: [1],
          optionType: data?.optionType ?? OPTION_TYPE.radio,
        },
        radio: {
          radioItemList: [
            {
              itemId: '',
              itemValue: '',
              score: '0',
            },
          ],
        },
        checkbox: {
          checkboxItemList: [
            {
              itemId: '',
              itemValue: '',
              score: '0',
            },
          ],
        },
        text: {
          textType: 0,
          numType: 0,
          numMin: '0',
          numMax: '99999',
          scoreRatio: '0',
          scoreMax: '0',
        },
        date: {},
        image: {
          limitNum: 2,
          isUseCustomUpload: false,
          exampleImageList: [],
        },
        address: {
          addressType: 1,
        },
        idCard: {
          typeList: [0],
        },
        file: {
          typeList: [1],
          limitNum: 1,
        },
      },
    };
  }

  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [data, form]);

  const [isErrOpen, setIsErrOpen] = useState(false);
  const [errData, setErrData] = useState<IErrObj | undefined>(undefined);
  const [fixFormData, setFixFormData] = useState<any>(undefined);
  const [radioData, setRadioData] = useState<IRadio | undefined>(data!.option?.radio);

  const errModalOnOk = () => {
    setIsErrOpen(false);
    if (errModalOkCallback) {
      errModalOkCallback(fixFormData);
    }
  };

  const errModalOnCancel = () => {
    setRadioData(errData!.formData.option!.radio);
    setIsErrOpen(false);
  };

  useImperativeHandle(cRef, () => ({
    // 暴露给父组件的方法
    getFormData: async (scrollToField?: boolean) => {
      let values;
      try {
        values = await form.validateFields();
      } catch (e) {
        if (scrollToField) {
          if (e.errorFields && e.errorFields.length > 0) {
            form.scrollToField(e.errorFields[0].name);
          }
        }
        return Promise.reject(e);
      }

      // 验证成功
      const {
        collectionTargetList,
      }: { collectionTargetList: number[] } = values;
      const formData: IOptionItem = {
        optionId: values.optionId,
        projectId: values.projectId,
        option: {
          optionBase: {
            isRequired: values.isRequired,
            title: values.title,
            titleDescription: values.titleDescription,
            collectionTargetList,
            optionType: values.optionType,
          },
        },
      };

      if (
        formData!.option!.optionBase.optionType === 1 &&
        collectionTargetList.length < 2
      ) {
        // 校验选项类型为“单选”，父级选项的收集对象是否包含于子项选项的收集对象
        let collectionTargetValid = true;
        const radioItemList: IRadioItem[] = values.RadioItem_radioItemList;
        const fixRadioItemList: IRadioItem[] = cloneDeep(radioItemList);
        const errObj: IErrObj = {
          collectionTarget: collectionTargetList[0],
          list: [],
          formData: { ...formData },
        };
        radioItemList.map((item, index) => {
          errObj.list.push({
            id: item.id!,
            itemValue: item.itemValue,
            subOptionList: [],
          });
          item.subOptionList?.map((subItem, subIndex) => {
            delete subItem.isRed;
            const subCollectionTargetList = subItem.option!.optionBase
              .collectionTargetList;
            subCollectionTargetList.forEach((target) => {
              if (collectionTargetList.indexOf(target) === -1) {
                fixRadioItemList[index].subOptionList![
                  subIndex
                ].option!.optionBase.collectionTargetList = collectionTargetList;
                errObj.list.map((err) => {
                  if (err.id === item.id) {
                    err.subOptionList.push(subItem.option!.optionBase.title);
                  }
                  return err;
                });
                subItem.isRed = true;
                collectionTargetValid = false;
              }
            });
            return subItem;
          });
          return item;
        });

        if (!collectionTargetValid) {
          errObj.list = errObj.list.filter((err) => {
            return err.subOptionList.length > 0;
          });
          errObj.formData.option!.radio = {
            radioItemList,
          };
          const tempFormData: IOptionItem = cloneDeep(formData);
          tempFormData!.option!.radio = {
            radioItemList: fixRadioItemList,
          };
          setFixFormData(tempFormData);
          setErrData(errObj);
          setIsErrOpen(true);
          /* Modal.error({
            title: '校验失败',
            content: '父级收集对象和子项收集对象不一致，请重新设置',
          }); */
          return Promise.reject('父级收集对象和子项收集对象不一致');
        }
      }

      switch (formData!.option!.optionBase.optionType) {
        case OPTION_TYPE.radio:
          formData!.option!.radio = {
            radioItemList: values.RadioItem_radioItemList,
          };
          break;
        case OPTION_TYPE.checkbox:
          formData!.option!.checkbox = {
            checkboxItemList: values.CheckBoxItem_checkboxItemList,
          };
          break;
        case OPTION_TYPE.text:
          formData!.option!.text = {
            textType: values.TextItem_textType,
            numType: values.TextItem_numType,
            numMin: values.TextItem_numMin,
            numMax: values.TextItem_numMax,
            scoreRatio: values.TextItem_scoreRatio,
            scoreMax: values.TextItem_scoreMax,
          };
          break;
        case OPTION_TYPE.date:
          formData!.option!.date = {};
          break;
        case OPTION_TYPE.image:
          const {
            ImageItem_isUseCustomUpload: isUseCustomUpload,
            ImageItem_exampleImageList: tmpList,
            ImageItem_customImageList: tmpList2,
          }: {
            ImageItem_isUseCustomUpload: boolean;
            ImageItem_exampleImageList: UploadFile<string>[];
            ImageItem_customImageList: {
              title: string;
              list: UploadFile<string>[];
            }[];
          } = values;
          const exampleImageList: IExampleImage[] = [];
          if (!isUseCustomUpload) {
            tmpList.forEach((item) => {
              exampleImageList.push({
                title: '',
                url: item.url,
              });
            });
          } else {
            tmpList2.forEach((item) => {
              exampleImageList.push({
                title: item.title,
                url: item.list && item.list.length > 0 ? item.list[0].url : '',
              });
            });
          }

          formData!.option!.image = {
            limitNum: values.ImageItem_limitNum,
            isUseCustomUpload,
            exampleImageList,
          };
          break;
        case OPTION_TYPE.address:
          formData!.option!.address = { addressType: values.AddressItem };
          break;
        case OPTION_TYPE.idCard:
          formData!.option!.idCard = { typeList: values.IdCardItem };
          break;
        case OPTION_TYPE.file:
          formData!.option!.file = {
            typeList: values.FileItem_typeList,
            limitNum: values.FileItem_limitNum,
          };
          break;
        default:
          break;
      }

      return formData;
    },
  }));

  const { optionId, projectId } = data;
  const {
    optionType,
    isRequired,
    title,
    titleDescription,
    collectionTargetList,
  } = data.option!.optionBase;

  const isDisabled = !!(isSubmittedInfo && data?.optionId);

  const [curOptionType, setCurOptionType] = useState(optionType);
  const [optionTypeName, setOptionTypeName] = useState(
    optionTypeTextList[optionType],
  );

  const list: IList[] = [
    {
      optionType: OPTION_TYPE.radio,
      name: optionTypeTextList[OPTION_TYPE.radio],
    },
    {
      optionType: OPTION_TYPE.checkbox,
      name: optionTypeTextList[OPTION_TYPE.checkbox],
    },
    {
      optionType: OPTION_TYPE.text,
      name: optionTypeTextList[OPTION_TYPE.text],
    },
    {
      optionType: OPTION_TYPE.date,
      name: optionTypeTextList[OPTION_TYPE.date],
    },
    {
      optionType: OPTION_TYPE.image,
      name: optionTypeTextList[OPTION_TYPE.image],
    },
    {
      optionType: OPTION_TYPE.address,
      name: optionTypeTextList[OPTION_TYPE.address],
    },
    {
      optionType: OPTION_TYPE.idCard,
      name: optionTypeTextList[OPTION_TYPE.idCard],
    },
    {
      optionType: OPTION_TYPE.file,
      name: optionTypeTextList[OPTION_TYPE.file],
    },
  ];

  const onSelectChange = (value: number) => {
    setCurOptionType(value);
    setOptionTypeName(optionTypeTextList[value]);
  };

  const getComponentByOptionType = () => {
    let html = <></>;
    switch (curOptionType) {
      case OPTION_TYPE.radio:
      case OPTION_TYPE.checkbox:
        if (curOptionType === OPTION_TYPE.radio) {
          html = (
            <RadioItem
              form={form}
              isSubmittedInfo={isSubmittedInfo}
              isSubItem={isSubItem}
              projectId={data?.projectId}
              data={radioData}
            />
          );
        } else {
          html = (
            <CheckBoxItem
              form={form}
              isSubmittedInfo={isSubmittedInfo}
              data={data!.option!.checkbox}
            />
          );
        }
        html = <DndProvider backend={HTML5Backend}>{html}</DndProvider>;
        break;
      case OPTION_TYPE.text:
        html = <TextItem form={form} data={data!.option!.text!} />;
        break;
      case OPTION_TYPE.image:
        html = <ImageItem form={form} data={data!.option!.image!} />;
        break;
      case OPTION_TYPE.address:
        html = <AddressItem data={data!.option!.address!} />;
        break;
      case OPTION_TYPE.idCard:
        html = <IdCardItem data={data!.option!.idCard!} />;
        break;
      case OPTION_TYPE.file:
        html = <FileItem data={data!.option!.file!} />;
        break;
      default:
        break;
    }

    return html;
  };

  return (
    <div className={styles.content}>
      <Form form={form} name={v4()}>
        <Form.Item name="optionId" label="" hidden initialValue={optionId}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name="projectId" label="" hidden initialValue={projectId}>
          <Input placeholder="" />
        </Form.Item>
        <ShowRender if={isShowOptionType}>
          <Form.Item
            label="选项类型"
            name="optionType"
            initialValue={optionType}
          >
            <Select className={styles.selectWrapper} onChange={onSelectChange}>
              {list.map((item: IList) => (
                <Select.Option value={item.optionType} key={item.optionType}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </ShowRender>
        <div className={styles.bg}>
          <div className="clearfix">
            <div className="fz16 fl fwb">{optionTypeName}</div>
            <div className="fr">
              <Form.Item
                className={styles.isRequired}
                label="设为必填"
                colon={false}
                name="isRequired"
                initialValue={isRequired}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </div>
          </div>
          <div className="mgb8">
            <span className="c-red">*</span>&nbsp;标题
          </div>
          <Form.Item
            name="title"
            label=""
            required
            rules={[
              {
                required: true,
                message: '请输入标题',
                whitespace: true,
              },
              { max: 30, message: '不能超过30个字' },
            ]}
            initialValue={title}
          >
            <Input placeholder="请输入标题" disabled={isDisabled} />
          </Form.Item>
          <div className="mgb8">标题描述</div>
          <Form.Item
            name="titleDescription"
            label=""
            rules={[{ max: 200, message: '不能超过200个字' }]}
            initialValue={titleDescription}
          >
            <Input.TextArea
              placeholder="请输入标题描述"
              disabled={isDisabled}
              autoSize
            />
          </Form.Item>
          {getComponentByOptionType()}
          <Form.Item
            className={styles.collectionTarget}
            name="collectionTargetList"
            label="收集对象"
            rules={[{ required: true, message: '请选择收集对象' }]}
            initialValue={collectionTargetList}
          >
            <Checkbox.Group
              options={[
                { label: '主购房人', value: 1 },
                { label: '联名购房人', value: 2 },
              ]}
              disabled={isDisabled}
            />
          </Form.Item>
        </div>
      </Form>
      <Modal
        title="提示"
        visible={isErrOpen}
        onOk={errModalOnOk}
        okText="全部处理"
        onCancel={errModalOnCancel}
        cancelText="不处理"
        width={640}
        destroyOnClose
      >
        {errData && (
          <div className={styles['err-tip-dialog']}>
            <div className="mgb16">
              以下子项的收集对象，需要设置为[
              <span className="brand-color">
                {collectionTargetNameList[errData!.collectionTarget]}
              </span>
              ]才能保存。
            </div>
            {errData!.list.map((item) => {
              return (
                <div key={item.id} className={styles.item}>
                  <div className="fwb mgb8">{item.itemValue}</div>
                  <div>关联选项：{item.subOptionList.join('，')}</div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OptionInfo;
