import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import BoulderListItem from './BoulderListItem';
import { Boulder } from '@/types/models';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

interface BoulderListProps {
    boulders: Boulder[];
}

const BoulderList = ({ boulders } : BoulderListProps) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={boulders}
                renderItem={({item}) => (
                    <BoulderListItem
                        boulder={item}
                    />
                 )}
            />
        </View>
    );
}

export default BoulderList;