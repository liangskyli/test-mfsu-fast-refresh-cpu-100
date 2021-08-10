import { Modal } from 'antd';
import type { MouseEvent } from 'react';
import type { IOptionItem } from '@/components/Option/option';
import type {
  IOptionInfo,
  IOptionInfoRef,
} from '@/components/Option/OptionInfo';
import OptionInfo from '@/components/Option/OptionInfo';
import styles from './index.less';
import { useRef } from 'react';

type Props = Omit<IOptionInfo, 'form' | 'cRef'> & {
  title?: string;
  isOpen: boolean;
  modalOnOk?: (formData: IOptionItem) => void;
  modalOnCancel?: (e: MouseEvent<HTMLElement>) => void;
};

const OptionDialog = (props: Props) => {
  const {
    title = '新增选项',
    isOpen,
    modalOnOk,
    modalOnCancel,
    isShowOptionType,
    isSubmittedInfo,
    isSubItem,
    isForceInitData,
    data,
  } = props;

  const optionInfoRef = useRef<IOptionInfoRef>();

  const errModalOkCallback = (formData: IOptionItem) => {
    if (modalOnOk) {
      modalOnOk(formData);
    }
  };

  const onOk = async () => {
    const formData = await optionInfoRef.current!.getFormData(true);
    errModalOkCallback(formData);
  };
  return (
    <Modal
      title={title}
      visible={isOpen}
      onOk={onOk}
      onCancel={modalOnCancel}
      width={768}
      destroyOnClose
    >
      <div className={styles['option-info-height']}>
        <OptionInfo
          cRef={optionInfoRef}
          isShowOptionType={isShowOptionType}
          isSubmittedInfo={isSubmittedInfo}
          isSubItem={isSubItem}
          isForceInitData={isForceInitData}
          data={data}
          errModalOkCallback={errModalOkCallback}
        />
      </div>
    </Modal>
  );
};
export default OptionDialog;
