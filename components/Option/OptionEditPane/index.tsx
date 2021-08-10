import { memo, useRef } from 'react';
import { Button } from 'antd';
import styles from './index.less';
import classNames from 'classnames';
import type { IOptionInfoData, IOptionItem } from '@/components/Option/option';
import type { IOptionInfoRef } from '@/components/Option/OptionInfo';
import OptionInfo from '@/components/Option/OptionInfo';
import { cloneDeep } from 'lodash';

type IOptionPane = {
  // 是否有资料
  isSubmittedInfo?: boolean;
  data?: IOptionInfoData;
  onSave: (formData: IOptionItem) => void;
  onCancel: () => void;
};

const OptionEditPane = memo(
  (props: IOptionPane) => {
    const { data, isSubmittedInfo, onSave, onCancel } = props;

    const optionInfoRef = useRef<IOptionInfoRef>();

    const errModalOkCallback = (formData: IOptionItem) => {
      onSave(formData);
    };

    const onOk = async () => {
      const values = await optionInfoRef.current!.getFormData();
      errModalOkCallback(values);
    };

    return (
      <div className={classNames(styles['edit-wrapper'], 'border-1px-line')}>
        <OptionInfo
          cRef={optionInfoRef}
          isShowOptionType={false}
          isSubmittedInfo={isSubmittedInfo}
          isSubItem={true}
          data={cloneDeep(data)}
          errModalOkCallback={errModalOkCallback}
        />
        <div className="pdl32 pdb24">
          <Button type="primary" onClick={onOk}>
            确定
          </Button>
          <Button className="mgl16" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>
    );
  },
  () => {
    return true;
  },
);

export default OptionEditPane;
