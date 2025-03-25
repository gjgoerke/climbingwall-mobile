import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Divider, List } from 'react-native-paper';

import { Board } from '@/types/models';
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
interface BoulderCommentProps {
    comment: Comment
}

const BoulderComment = ({ comment } : BoulderCommentProps) => {
    let gradeText = '';
    if (comment.proposed_grade != null && comment.proposed_grade != undefined) {
        gradeText = ` - V${comment.proposed_grade}`;
    }
    return (
        <>
            <List.Item
                title={() => (
                    <Text>{comment.user}{gradeText}</Text>
                )}
                description={() => (<Text>{comment.comment}</Text>)}
            />
        </>
    )
    
};

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
                                    <Text>{comment.user}{gradeText}</Text>
                                )}
                                description={() => (<Text>{comment.comment}</Text>)}
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