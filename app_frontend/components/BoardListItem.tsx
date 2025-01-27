import React from 'react';
import { List } from 'react-native-paper';

interface BoardListItemProps {
    name: string;
    city: string;
    angle: number;
}

const BoardListItem = ({name, city, angle} : BoardListItemProps) => (
    <List.Item
    title={name}
    description={`${city} - ${angle}°`}
    />
);

export default BoardListItem;