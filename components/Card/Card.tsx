import { CSSProperties, FC, memo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from './ItemTypes'

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
}

interface Item {
    id: string
    originalIndex: number
}

export const Card: FC<CardProps> = memo(function Card({
                                                          id,
                                                          text,
                                                          move,
                                                          find,
                                                      }) {
    const originalIndex = find(id).index
    const [{ isDragging }, drag, preview] = useDrag(
        () => ({
            type: ItemTypes.CARD,
            item: { id, originalIndex },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const { id: droppedId, originalIndex } = item
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
            accept: ItemTypes.CARD,
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

    const opacity = isDragging ? 0 : 1
    return (
        <div ref={preview} style={{ ...style, opacity }}>
            <span ref={(node) => drag(drop(node))}>sss:</span>{text}
        </div>
    )
})
