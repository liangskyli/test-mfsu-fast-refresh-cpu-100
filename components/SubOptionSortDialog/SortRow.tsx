import { memo } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styles from '@/components/Option/OptionInfo/Components/SubOptionSortDialog/index.less';
import IconFont from '@/components/IconFont';

export const ItemTypes = 'table';

export interface Props {
  move: (id: string, to: number) => void;
  find: (id: string) => { index: number };
  [key: string]: any;
}

interface Item {
  id: string;
  originalIndex: number;
}

const SortRow = memo((props: Props) => {
  const { id, move, find, className, style, ...restProps } = props;

  const originalIndex = find(id).index;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex: oldIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          move(droppedId, oldIndex);
        }
      },
    }),
    [id, originalIndex, move],
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes,
      canDrop: () => false,
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = find(id);
          move(draggedId, overIndex);
        }
      },
    }),
    [find, move],
  );

  const opacity = isDragging ? 0 : 1;
  return (
    <tr
      ref={preview}
      className={className}
      style={{ ...style, opacity }}
      {...restProps}
    >
      {props.children &&
        (props.children as any).map((cell: any, index: number) => {
          if (cell.key === 'sort') {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <td key={index} className="ant-table-cell">
                <div className={styles.drag} ref={(node) => drag(drop(node))}>
                  <IconFont name="icon-drag" />
                </div>
              </td>
            );
          }
          return cell;
        })}
    </tr>
  );
});

export { SortRow };
