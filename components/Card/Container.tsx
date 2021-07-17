import { FC, memo, useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import { Card } from './Card'
import update from 'immutability-helper'
import { ItemTypes } from './ItemTypes'

const style = {
    width: 400,
}


const guid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const ITEMS = [
    {
        id: guid(),
        text: 'Write a cool JS library Write a cool JS library Write a cool JS library',
    },
    {
        id: guid(),
        text: 'Make it generic enough',
    },
    {
        id: guid(),
        text: 'Write README',
    },
    {
        id: guid(),
        text: 'Create some examples',
    },
    {
        id: guid(),
        text: 'Spam in Twitter and IRC to promote it',
    },
    {
        id: guid(),
        text: '???',
    },
    {
        id: guid(),
        text: 'PROFIT',
    },
]

const Container: FC = memo(function Container() {
    const [cards, setCards] = useState(ITEMS)

    const find = useCallback(
        (id: string) => {
            const card = cards.filter((c) => `${c.id}` === id)[0]
            return {
                card,
                index: cards.indexOf(card),
            }
        },
        [cards],
    )

    const move = useCallback(
        (id: string, atIndex: number) => {
            const { card, index } = find(id)
            setCards(
                update(cards, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, card],
                    ],
                }),
            )
        },
        [find, cards, setCards],
    )

    const [, drop] = useDrop(() => ({ accept: ItemTypes.CARD }))
    return (
        <div ref={drop} style={style}>
            {cards.map((card) => (
                <Card
                    key={card.id}
                    id={`${card.id}`}
                    text={card.text}
                    move={move}
                    find={find}
                />
            ))}
        </div>
    )
})

export default Container;
