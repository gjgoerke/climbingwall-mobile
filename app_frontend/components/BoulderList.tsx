import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import BoulderListItem from './BoardListItem';
import { Boulder } from '@/types/models';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 22,
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
                        name={item.name}
                        grade={item.consensus_grade}
                        rating={item.rating}
                        ascentionist_count={item.ascentionist_count}
                    />
                 )}
            />
        </View>
    );
}

export default BoulderList;