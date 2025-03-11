import { useBoard } from "@/context/BoardContext";
import { useLocalSearchParams, router } from "expo-router";
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Switch, Button, Appbar } from "react-native-paper";

import api from "@/services/api";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inputContainer : {
        width: '100%',
        maxWidth: 400,
        gap: 10,
        marginBottom: 20,
    },
    draftSwitch : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    }
});

export default function BoulderForm () {
    const boulderData = useLocalSearchParams();
    const { selectedBoard } = useBoard();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [draft, setDraft] = useState(false);

    const draftSwitch = () => {
        setDraft(!draft);
    };
    
    const handleSubmit = async () => {
        const requestData = {
            name: name,
            description: description,
            draft: draft,
            holds: JSON.parse(boulderData.params as string)
        };
        try {
            console.log('Sending request with data:', requestData);
            const setBoulderResponse = await api.post(
                `boards/${selectedBoard?.id}/boulders/`, requestData,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                }});
            if(setBoulderResponse.status === 201 || setBoulderResponse.status === 200) {
                router.replace('/(tabs)/(boulders)');
            }
            console.log('setBoulderResponse status: ', setBoulderResponse.status)
            return setBoulderResponse;
        } catch (e: any) {
            console.error(e.response.data)
        }
    }
    return(
        <>
            <Appbar.Header>
                <Appbar.Action icon={'arrow-left'} onPress={() => {router.back();}}/>
                <Appbar.Content title={'Set Boulder'}/>
            </Appbar.Header>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput 
                        onChangeText={(text: string) => {setName(text);}} 
                        value = {name} 
                        placeholder='name'
                        autoCapitalize='none'/>
                    <TextInput 
                        onChangeText={(text: string) => {setDescription(text);}} 
                        value = {description} 
                        placeholder='description (optional)'
                        autoCapitalize='none'/>
                    <View style={styles.draftSwitch}>
                        <Text>Save as Draft</Text>
                        <Switch value={draft} onValueChange={draftSwitch} />
                    </View>
                    <Button mode='outlined' onPress={handleSubmit} >
                        Submit
                    </Button>
                </View>
            </View>
        </>
    );
}