import React from "react";
import { router } from "expo-router";
import { View, StyleSheet, Text, ScrollView, Image} from "react-native";
import { Appbar, Button, TextInput, Switch } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";


export default function NewBoard() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [angle, setAngle] = useState(40);
    const [city, setCity] = useState('');
    const [isLedSupported, setIsLedSupported] = useState(false);
    const [ledQuantity, setLedQuantity] = useState<number>(0);

    const handleLedSupportChange = (value: boolean) => {
        setIsLedSupported(value);
        if (!value) {
            setLedQuantity(0);
        } else if (ledQuantity == 0) {
            setLedQuantity(1);
        }
    };

    const handleConfigurePress = () => {
        {isLedSupported ?
            router.push({
                pathname: '/board_configuration',
                params: {
                    name,
                    description,
                    angle,
                    city,
                    ledQuantity,
                }
            }) :
            () =>{}
        }
    }
    return(
        <>
            <Appbar.Header>
                <Appbar.Action icon={'arrow-left'} onPress={() => {router.back();}}/>
                <Appbar.Content title="New Board"/>
            </Appbar.Header>
            <ScrollView>
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
                            placeholder='description'
                            autoCapitalize='none'/>
                        <TextInput 
                            onChangeText={(text: string) => {setCity(text);}} 
                            value = {city} 
                            placeholder='city'
                            autoCapitalize='none'/>
                        <Text>Angle:</Text>
                        <Picker
                            selectedValue={angle}
                            onValueChange={(itemValue) =>
                                setAngle(itemValue)
                            }>
                            {[...Array(91)].map((_, index) => (
                                <Picker.Item key={index} label={String(index)+'°'} value={index} />
                            ))}
                        </Picker>
                        <View style={styles.switchContainer}>
                            <Text>LED Support</Text>
                            <Switch value={isLedSupported} onValueChange={handleLedSupportChange} />
                        </View>
                        {isLedSupported && (
                            <>
                                <Text>Number of LEDs</Text>
                                <TextInput
                                    keyboardType="numeric"
                                    onChangeText={(text) => setLedQuantity(Number(text))}
                                    value={String(ledQuantity)}
                                    placeholder="Number of LEDs"
                                />
                            </>
                        )}
                    </View>
                    <View style = {styles.buttons}>
                        <Button onPress={handleConfigurePress} 
                        mode='outlined' 
                        icon={isLedSupported ? 'cog' : ''}
                        >
                            {isLedSupported ? 
                                'Configure Holds' :
                                'Submit' 
                            }
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

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
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 10,
    },
    buttons : {
        width: '100%',
        gap: '10',
    },
    image: {
        width: 200,
        height: 200,
    },
});