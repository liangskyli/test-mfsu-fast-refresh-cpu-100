import { memo, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Tooltip } from 'antd';

export const acceptSortKey = 'ItemValueListSort';

export interface Props {
  id: string;
  move: (id: string, to: number) => void;
  find: (id: string) => { index: number };
  rowHtml: JSX.Element;
}

interface Item {
  id: string;
  originalIndex: number;
}

const ItemCard = memo((rowProps: Props) => {
  const { id, move, find, rowHtml } = rowProps;

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

  const { props } = rowHtml;
  const { style, ...restProps } = props;

  const html = (
    <div ref={preview} style={style} {...restProps}>
      {props.children &&
      props.children.map((cell: JSX.Element, index: number) => {
        if (cell && cell.key === 'fieldRow-item-bg') {
          return (
            <div
              /* eslint-disable-next-line react/no-array-index-key */
              key={index}
              {...cell.props}
              style={{ display: isDragging ? 'block' : 'none' }}
            />
          );
        }
        if (cell && cell.key === 'fieldRow-item') {
          return (
            <div key={index} {...cell.props}>
              {cell.props.children &&
              cell.props.children.map((cell2: JSX.Element, index2: number) => {
                if (cell2 && cell2.key === 'fieldRow-cf') {
                  return (
                    <div key={index2} {...cell2.props}>
                      {cell2.props.children &&
                      cell2.props.children.map(
                        (cell3: JSX.Element, index3: number) => {
                          if (cell3 && cell3.key === 'fieldRow-drag') {
                            return (
                              <div
                                key={index3}
                                ref={(node) => drag(drop(node))}
                                onMouseEnter={() => {
                                  if (!isTooltipMouseDown && !window.globalMoveCard) {
                                    isTooltipVisibleList[id] = true;
                                    setIsTooltipVisibleList(
                                      isTooltipVisibleList,
                                    );
                                    setIsTooltipVisible(true);
                                  }
                                }}
                                onMouseLeave={() => {
                                  window.globalMoveCard = false;
                                  setIsTooltipMouseDown(false);
                                  isTooltipVisibleList[id] = false;
                                  setIsTooltipVisibleList(
                                    isTooltipVisibleList,
                                  );
                                  setIsTooltipVisible(false);
                                }}
                                onMouseDown={() => {
                                  window.globalMoveCard = true;
                                  setIsTooltipMouseDown(true);
                                  isTooltipVisibleList[id] = false;
                                  setIsTooltipVisibleList(
                                    isTooltipVisibleList,
                                  );
                                  setIsTooltipVisible(false);
                                }}
                                {...cell3.props}
                              >
                                <Tooltip
                                  placement="top"
                                  title="拖拽调整顺序"
                                  visible={
                                    isTooltipVisibleList[id] === true
                                  }
                                >
                                  {cell3.props.children}
                                </Tooltip>
                              </div>
                            );
                          }
                          return cell3;
                        },
                      )}
                    </div>
                  );
                }
                return cell2;
              })}
            </div>
          );
        }
        return cell;
      })}
    </div>
  );

  return html;
});

export default ItemCard;
