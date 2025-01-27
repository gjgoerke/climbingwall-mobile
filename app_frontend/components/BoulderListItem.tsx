import React from 'react';
import { List } from 'react-native-paper';

interface BoulderListItemProps {
    name: string;
    grade: number | null | undefined;  // matches consensus_grade from Boulder interface
    rating: 1 | 2 | 3 | 4 | 5;
    ascentionist_count: number;
}

const BoulderListItem = ({name, grade, rating, ascentionist_count} : BoulderListItemProps) => (
    <List.Item
    title={name}
    description={` V${grade || 'project'} - ${rating} stars \n ${ascentionist_count} ascents `}
    />
);

export default BoulderListItem;