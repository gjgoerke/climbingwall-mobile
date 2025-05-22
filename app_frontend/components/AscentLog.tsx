import { AscentWithBoulder } from '@/types/models';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Divider, List } from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

interface Props {
    ascents: AscentWithBoulder[];
}

const AscentLog = ({ ascents }: Props) => {
    return (
        <View style={styles.container}>
            {ascents.length > 0 ? 
                ascents.map((ascent, index) => {
                    return (
                        <View key={index}>
                            <Divider/>
                            <List.Item
                                title={() => (
                                    <>
                                        <Text>{ascent.boulder.name} - {
                                            ascent.boulder.consensus_grade ? 
                                            'V' + ascent.boulder.consensus_grade : 
                                            'Ungraded'
                                        }</Text> 
                                    </>
                                )}
                                description={() => 
                                    (
                                        <Text style={{fontWeight: 200}}>
                                        {new Date(ascent.date_time).toLocaleDateString()}
                                        </Text>
                                    )}
                            />
                            {index === ascents.length - 1 && <Divider/>}
                        </View>
                    )
                })
                :
                <Text style={{marginLeft: 10}}>No ascents yet!</Text>
            }
        </View>
    )
}

export default AscentLog;