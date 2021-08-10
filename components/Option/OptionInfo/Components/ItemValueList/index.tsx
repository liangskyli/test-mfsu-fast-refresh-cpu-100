import type { ICheckbox, IRadio } from '@/components/Option/option';
import { memo } from 'react';
import ListContainer from '@/components/Option/OptionInfo/Components/ItemValueList/ListContainer';
import type { IConfig } from '../../index.d';

type Props = IConfig & {
  projectId?: string;
  data?: IRadio | ICheckbox;
  itemListName: 'RadioItem_radioItemList' | 'CheckBoxItem_checkboxItemList';
};

const ItemValueList = memo(
  (props: Props) => {
    const {
      data,
      form,
      itemListName,
      isSubmittedInfo,
      isSubItem,
      projectId,
    } = props;

    return (
      <ListContainer
        form={form}
        isSubmittedInfo={isSubmittedInfo}
        isSubItem={isSubItem}
        itemListName={itemListName}
        projectId={projectId}
        data={data}
      />
    );
  },
  (prevProps,nextProps) => {
    return prevProps.data === nextProps.data;
  },
);

export default ItemValueList;
