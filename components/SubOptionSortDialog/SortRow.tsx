import { memo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styles from '@/components/Option/OptionInfo/Components/SubOptionSortDialog/index.less';
import IconFont from '@/components/IconFont';
import { Tooltip } from 'antd';

export const acceptSortKey = 'SubOptionSortDialogTable';

export interface Props {
  move: (id: string, to: number) => void;
  find: (id: string) => { index: number };
  [key: string]: any;
}

interface Item {
  id: string;
  originalIndex: number;
}

const SortRow = memo(
  (props: Props) => {
    const { id, move, find, className, style, ...restProps } = props;

    const [, setIsTooltipVisible] = useState(false);
    const [isTooltipMouseDown, setIsTooltipMouseDown] = useState(false);
    const [isTooltipVisibleList, setIsTooltipVisibleList] = useState<
      Record<string, boolean | undefined>
    >({});

    const originalIndex = find(id).index;
    const [{ isDragging }, drag, preview] = useDrag(
      () => ({
        type: acceptSortKey,
        item: { id, originalIndex },
        collect: (monitor) => {
          return {
            isDragging: monitor.isDragging(),
          };
        },
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
        accept: acceptSortKey,
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

    const renderTdHtml = (tdProps: Props) => {
      if (tdProps.className === 'ant-table-placeholder') {
        return tdProps.children;
      }

      return tdProps.children.map((cell: JSX.Element, index: number) => {
        if (cell.key === 'sort') {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <td key={index} className="ant-table-cell">
              <div
                className={styles.drag}
                onMouseEnter={() => {
                  if (!isTooltipMouseDown) {
                    isTooltipVisibleList[cell.props.record.id] = true;
                    setIsTooltipVisibleList(isTooltipVisibleList);
                    setIsTooltipVisible(true);
                  }
                }}
                onMouseLeave={() => {
                  setIsTooltipMouseDown(false);
                  isTooltipVisibleList[cell.props.record.id] = false;
                  setIsTooltipVisibleList(isTooltipVisibleList);
                  setIsTooltipVisible(false);
                }}
                onMouseDown={() => {
                  setIsTooltipMouseDown(true);
                  isTooltipVisibleList[cell.props.record.id] = false;
                  setIsTooltipVisibleList(isTooltipVisibleList);
                  setIsTooltipVisible(false);
                }}
                ref={(node) => drag(drop(node))}
              >
                <Tooltip
                  placement="top"
                  title="拖拽调整顺序"
                  visible={isTooltipVisibleList[cell.props.record.id] === true}
                >
                  <IconFont name="icon-drag" />
                </Tooltip>
              </div>
            </td>
          );
        }
        return cell;
      });
    };

    const opacity = isDragging ? 0 : 1;
    return (
      <tr
        ref={preview}
        className={className}
        style={{ ...style, opacity }}
        {...restProps}
      >
        {renderTdHtml(props)}
      </tr>
    );
  },
  () => {
    return true;
  },
);

export { SortRow };
