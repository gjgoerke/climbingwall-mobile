import { Boulder } from '@/types/models';
import { router } from 'expo-router';
import React from 'react';
import { List } from 'react-native-paper';

interface BoulderListItemProps {
    boulder: Boulder;
}



const BoulderListItem = ({boulder} : BoulderListItemProps) => {
    const handlePress = () => {
        router.push({
            pathname: "/(app)/(tabs)/(boulders)/[id]" as const,
            params: { 
                id: boulder.id,
                boulder: JSON.stringify(boulder)
            }
        });
    };

    return (
        <List.Item
        title={boulder.name}
        description={`V${boulder.consensus_grade || 'project'} - ${boulder.like_count} likes \n ${boulder.ascentionist_count} ascents `}
        onPress={handlePress}
        />
    )
};

export default BoulderListItem;