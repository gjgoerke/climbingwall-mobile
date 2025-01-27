import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import BoardListItem from './BoardListItem';
import { Board } from '@/types/models';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

interface BoardListProps {
    boards: Board[];
}

const BoardList = ({ boards } : BoardListProps) => {
    return (
        <View style={styles.container}>
            <FlatList
                data={boards}
                renderItem={({item}) => (
                    <BoardListItem
                        name={item.name}
                        angle={item.angle}
                        city={item.city}
                    />
                 )}
            />
        </View>
    );
}
export default BoardList;