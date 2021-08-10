import type { IRadio } from '@/components/Option/option';
import { memo } from 'react';
import ItemValueList from '@/components/Option/OptionInfo/Components/ItemValueList';
import type { IConfig } from './index.d';

type Props = Omit<IConfig, 'isForceInitData'> & {
  projectId?: string;
  data?: IRadio;
};

const RadioItem = memo(
  (props: Props) => {
    const { data, projectId, form, isSubmittedInfo, isSubItem } = props;

    return (
      <ItemValueList
        form={form}
        isSubmittedInfo={isSubmittedInfo}
        isSubItem={isSubItem}
        itemListName="RadioItem_radioItemList"
        projectId={projectId}
        data={data}
      />
    );
  },
  (prevProps,nextProps) => {
    return prevProps.data === nextProps.data;
  },
);

export default RadioItem;
