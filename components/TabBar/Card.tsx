import { CSSProperties, FC, memo } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const style: CSSProperties = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
}

export interface CardProps {
    id: string
    text: string
    move: (id: string, to: number) => void
    find: (id: string) => { index: number }

    [key: string]: any;
}

interface Item {
    id: string
    originalIndex: number
}

// export declare type RenderTabBar = (props: any, DefaultTabBar: React.ComponentType) => React.ReactElement;
export const Card = (rowProps: CardProps)=> {
    const {
        id,
        text,
        move,
        find,
        children,
    } = rowProps;
    const originalIndex = find(id).index
    const [{isDragging}, drag, preview] = useDrag(
        () => ({
            type: 'acceptSortKey',
            item: {id, originalIndex},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const {id: droppedId, originalIndex} = item
                const didDrop = monitor.didDrop()
                if (!didDrop) {
                    move(droppedId, originalIndex)
                }
            },
        }),
        [id, originalIndex, move],
    )

    const [, drop] = useDrop(
        () => ({
            accept: 'acceptSortKey',
            canDrop: () => false,
            hover({id: draggedId}: Item) {
                if (draggedId !== id) {
                    const {index: overIndex} = find(id)
                    move(draggedId, overIndex)
                }
            },
        }),
        [find, move],
    )

    const opacity = isDragging ? 0 : 1;

    return <div ref={(node) => drag(drop(node))} >{children}</div>
    /*return (
        <div ref={preview} style={{...style, opacity}}>
            <span ref={(node) => drag(drop(node))}>sss:</span>{text}
        </div>
    )*/
};
