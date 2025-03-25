import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Appbar } from "react-native-paper";
import { View, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { ScrollView } from "react-native";

import { Boulder, Ascent } from "@/types/models";
import { HeaderContent } from "./[id]";
import BoulderComments from "@/components/BoulderComments";
import api from "@/services/api";
import BarGraph from "@/components/BarGraph";
import { BarGraphData } from "@/components/BarGraph";

const styles = StyleSheet.create({
    container : {
        flex: 1
    }
});

export interface Comment {
    user: string;
    date_time: Date;
    proposed_grade: number;
    comment: string | null;
}

export default function BoulderDetail() {
    const { boulder } = useLocalSearchParams();
    const [parsedBoulder, setParsedBoulder] = useState<Boulder|null>(null);
    const [ascents, setAscents] = useState<Ascent[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [data, setData] = useState<BarGraphData[]>([]);
    

    // Read boulder data from params.
    useEffect(() => {
        if (boulder && typeof boulder === 'string') {
            setParsedBoulder(JSON.parse(boulder));
        } else if (Array.isArray(boulder) && boulder.length > 0) {
            setParsedBoulder(JSON.parse(boulder[0]));
        }
    }, [boulder]);

    // Fetch ascent data from server.
    useEffect(()=> {
        if (parsedBoulder) {
            const fetchAscents = async () => {
                try {
                    const response = await api.get(`/boulders/${parsedBoulder?.id}/ascents/`);
                    setAscents(response.data);
                } catch (error) {
                    console.error(error);
                }  
            }
            fetchAscents();
        }
    }, [parsedBoulder])

    // Create comments from ascent data
    useEffect(() => {
        if(ascents) {
            const createCommentList = () => {
                const comment_list = ascents.filter((value) => (!!value.comment)).map((value) => {
                    return ({
                        user: value.user.username,
                        date_time: value.date_time,
                        proposed_grade: value.proposed_grade,
                        comment: value.comment
                    });
                });
                console.log('comments list:', comment_list)
                console.log('ascents list:', ascents)
                setComments(comment_list);
            }
            createCommentList();
        }
    },[ascents])

    // Compute BarGraphData 
    useEffect(() => {
        const numPerGrade = Array(15).fill(0);
        for (let i = 0; i < ascents.length; i++) {
            if (!(ascents[i].proposed_grade == null || ascents[i].proposed_grade == undefined)) {
                numPerGrade[ascents[i].proposed_grade] += 1;
            }
        }
        setData(numPerGrade.map((value, index) => ({
            label: 'V' + String(index),
            value: value
        })));
    }, [ascents])


    return(
        <View style={{flex: 1}}>
            <Appbar.Header>
                <Appbar.Action icon={'arrow-left'} onPress={() => {router.back();}} />
                <HeaderContent parsedBoulder={parsedBoulder}/>
            </Appbar.Header>
            <ScrollView style={{flex: 1}}>
                <View style={styles.container}>
                    {parsedBoulder && 
                        <View style={{paddingLeft: 10, paddingRight: 10, paddingTop: 10}}>  
                            <Text style={{fontWeight: 'bold'}}>Description</Text>
                            <Text style={{marginBottom: 10}}>{parsedBoulder.description}</Text>
                        </View>
                    }
                    {ascents.length > 0 && <BarGraph data={data}/>}
                    <BoulderComments comments={comments}/>
                </View>
            </ScrollView>
        </View>
    );

}