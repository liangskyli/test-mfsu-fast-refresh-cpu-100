import {CSSProperties, FC, memo, useRef} from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'


export interface Props {
    move: (id: string, to: number) => void
    find: (id: string) => { index: number }
    [key: string]: any;
}

interface Item {
    id: string
    originalIndex: number
}



/*const dragableBodyRow = (props,a) => {
        console.log(props)
        const { moveRow, className, style, ...restProps } = props;

        return (
            <tr
                ref={useRef()}
                className={className}
                style={style}
                {...restProps}
            >
                {props.children.map((cell,index) => {
                    if(cell.key === 'sort'){
                        return <td key={index} className='ant-table-cell'>
                            <div ref={useRef()} style={{cursor: 'move', color: '#999'}}>dddd</div>
                        </td>;
                    }
                    return cell;
                })}
            </tr>
        );
    };*/

//export { dragableBodyRow };



export const Row: FC<Props> = memo((props) => {
    const {
        id,
        move,
        find,
        className,
        style,
        ...restProps
    } = props;

    const originalIndex = find(id).index;
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.TABLE,
            item: { id, originalIndex },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const { id: droppedId, originalIndex } = item;
                const didDrop = monitor.didDrop();
                if (!didDrop) {
                    move(droppedId, originalIndex)
                }
            },
        }),
        [id, originalIndex, move],
    )

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.TABLE,
            canDrop: () => false,
            hover({ id: draggedId }: Item) {
                if (draggedId !== id) {
                    const { index: overIndex } = find(id)
                    move(draggedId, overIndex)
                }
            },
        }),
        [find, move],
    )

    const opacity = isDragging ? 0 : 1;
    return (
        <tr
            ref={preview}
            className={className}
            style={{ ...style, opacity }}
            {...restProps}
        >
            {props.children && (props.children as any).map((cell,index) => {
                if(cell.key === 'sort'){
                    return <td key={index} className='ant-table-cell'>
                        <div ref={(node) => drag(drop(node))} style={{cursor: 'move', color: '#999'}}>dddd</div>
                    </td>;
                }
                return cell;
            })}
        </tr>
    )
})
