import React from 'react';
import { router } from 'expo-router';
import { List } from 'react-native-paper';

interface BoardListItemProps {
    id: number;
    name: string;
    city: string;
    angle: number;
}

const BoardListItem = ({id, name, city, angle} : BoardListItemProps) => (
    <List.Item
    title={name}
    description={`${city} - ${angle}°`}
    onPress={() => {router.navigate(`/${id}`)}}
    />
);

export default BoardListItem;