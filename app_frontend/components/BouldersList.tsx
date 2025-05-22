import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Boulder } from '@/types/models';

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});

interface BouldersListProps {
    boulders: Boulder[];
}

const BouldersList = ({ boulders } : BouldersListProps) => {
    return (
        <View style={styles.container}>
            
        </View>
    );
}

export default BouldersList;