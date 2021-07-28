import { Modal } from 'antd';
import type { MouseEvent } from 'react';
import type { IOptionItem } from '@/models/option';
import TableContainer from './TableContainer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef } from 'react';

type Props = {
  isOpen: boolean;
  modalOnOk?: (sortData: IOptionItem[]) => void;
  modalOnCancel?: (e: MouseEvent<HTMLElement>) => void;
  data: IOptionItem[];
};

const SubOptionSortDialog = (props: Props) => {
  const { isOpen, modalOnOk, modalOnCancel, data } = props;
  const childRef = useRef<{
    getSortData: () => IOptionItem[];
  }>();

  const onOk = async () => {
    if (modalOnOk) {
      const sortData = childRef!.current!.getSortData();
      modalOnOk(sortData);
    }
  };

  return (
    <Modal
      title="子项排序"
      visible={isOpen}
      onOk={onOk}
      onCancel={modalOnCancel}
      width={640}
      destroyOnClose
    >
      {data && (
        <>
          <div>
            <DndProvider backend={HTML5Backend}>
              <TableContainer data={data} cRef={childRef} />
            </DndProvider>
          </div>
        </>
      )}
    </Modal>
  );
};
export default SubOptionSortDialog;
