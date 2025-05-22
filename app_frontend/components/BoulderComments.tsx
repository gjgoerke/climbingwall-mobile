import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Divider, List } from 'react-native-paper';

import { Comment } from '@/app/(app)/(tabs)/(boulders)/boulder_info';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      width: '100%',
    },
});

interface BoulderCommentsProps {
    comments: Comment[]
}

const BoulderComments = ({ comments } : BoulderCommentsProps) => {
    return (
        <View style={styles.container}>
            {comments.length > 0 ? 
                comments.map((comment, index) => {
                    let gradeText = '';
                    if (comment.proposed_grade != null && comment.proposed_grade != undefined) {
                        gradeText = ` - V${comment.proposed_grade}`;
                    }
                    return (
                        <View key={index}>
                            <Divider/>
                            <List.Item
                                title={() => (
                                    <>
                                        <Text style={{fontWeight: 500}}>{comment.user}{gradeText}</Text>
                                        <Text style={{fontWeight: 300}}>{new Date(comment.date_time).toLocaleDateString()}</Text>
                                    </>
                                )}
                                description={() => (<Text style={{fontWeight: 400}}>{comment.comment}</Text>)}
                            />
                            {index === comments.length - 1 && <Divider/>}
                        </View>
                    )
                })
                :
                <Text style={{marginLeft: 10}}>No comments yet!</Text>
            }
        </View>
    );
};
export default BoulderComments;