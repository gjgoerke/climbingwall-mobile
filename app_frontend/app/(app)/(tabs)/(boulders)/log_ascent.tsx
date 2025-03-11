import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text, Platform } from "react-native";


import { Boulder } from "@/types/models";
import MaterialIconButton from "@/components/MaterialIconButton";
import api from "@/services/api";

export default function LogAscent () {
    const { boulder } = useLocalSearchParams();
    const [parsedBoulder, setParsedBoulder] = useState<Boulder|null>(null);
    const [suggestedGrade, setSuggestedGrade] = useState<number | null>(null);
    const [climbDT, setClimbDT] = useState(new Date());
    const [dateShow, setDateShow] = useState(false);
    const [numAttempts, setNumAttempts] = useState(1);
    const [like, setLike] = useState(false);
    

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        inputContainer: {
            width: '100%',
            maxWidth: 400,
            gap: 10,
            marginBottom: 20,
            marginTop: 20
        },
        pickerContainer : {
            alignItems: 'center',
            width: '100%'
        },
        picker : {
            width: '100%'
        },
        pickerWrapper: {
            height: Platform.OS === 'ios' ? 150 : 'auto', // Control height on iOS
            width: '100%',
            overflow: 'hidden'
        },
        pickerItem: {
            height: 120, // Controls the height of each item on iOS
            fontSize: 16 // Controls the font size on iOS
        },
        iosDateTime: {
            flexDirection: 'row',
            alignContent: 'space-between',
            justifyContent: 'center',
            
        },
        text: {
            fontSize: 16,
            marginBottom: 10
        },
    });

    useEffect(() => {
        let parsed = JSON.parse(boulder as string);
        setParsedBoulder(parsed);
        console.log(parsedBoulder)
    }, [boulder])

    const showDatePickerSwitch = () => {
        setDateShow(!dateShow);
    }

    const onChange = (event: DateTimePickerEvent, date?: Date) => {
        setDateShow(false);
        if (date) {
            setClimbDT(date);
        }
    }

    const formatDateTime = (date: Date) => {
        // Format the date part (Feb 28, 2025)
        const dateOptions: Intl.DateTimeFormatOptions = { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        };
        
        // Format the time part (11:24PM)
        const timeOptions: Intl.DateTimeFormatOptions = { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        };
        
        const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);
        const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
        
        return `${formattedDate} at ${formattedTime}`;
    } 
    
    const handleHeartPress = () => {
        setLike(!like);
    }

    const handleSave = async () => {
        try {
            await api.post(`/boulders/${parsedBoulder?.id}/ascents/`, {
                proposed_grade: suggestedGrade,
                attempts: numAttempts,
                date_time: climbDT.toISOString()
            });
            if (like) {
                await api.post(`/boulders/${parsedBoulder?.id}/like/`);
            }
            if (parsedBoulder?.id) {
                router.navigate({
                    pathname: "/(app)/(tabs)/(boulders)" as const,
                    params: { 
                        refresh: 'true'
                    }
                });
            } else {
                router.navigate({
                    pathname: "/(app)/(tabs)/(boulders)",
                    params: { refresh: 'true' }
                });
            }
        } catch (error) {
            console.error('Error saving:', error);
        }
    }

    return(
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Action icon={'arrow-left'} onPress={() => {router.back();}}/>
                <Appbar.Content title={parsedBoulder?.name || 'Loading...'}/>
            </Appbar.Header>
            <View style={styles.inputContainer}>
                
                {Platform.OS === 'ios' ?  (
                    <View style={styles.iosDateTime}>
                        <DateTimePicker
                            testID="datePicker"
                            value={climbDT}
                            mode={'date'}
                            onChange={onChange}
                        />
                        <DateTimePicker
                            testID="timePicker"
                            value={climbDT}
                            mode={'time'}
                            onChange={onChange}
                        />
                    </View>
                ) :
                    <>
                        <Button 
                            onPress={showDatePickerSwitch} 
                            icon={'chevron-down'}
                            contentStyle = {{flexDirection: 'row-reverse'}}>
                            {formatDateTime(climbDT)}
                        </Button>
                        {dateShow && 
                            (<DateTimePicker
                                testID="dateTimePicker"
                                value={climbDT}
                                mode={'date'}
                                onChange={onChange}
                            />)
                        }
                    </>
                }
                <View style={styles.pickerContainer}>
                    <Text>Feels like a</Text>
                    <View style={styles.pickerWrapper}>                    
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={suggestedGrade}
                            onValueChange={(itemValue) =>
                                setSuggestedGrade(itemValue)
                            }>
                                <Picker.Item label={'?'} value={null} />
                            {[...Array(18)].map((_, index) => (
                                <Picker.Item key={index} label={'V' + index} value={index} />
                            ))}
                        </Picker>
                    </View>
                    <Text>Attempts: </Text>
                    <View style={styles.pickerWrapper}>  
                        <Picker
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                            selectedValue={numAttempts}
                            onValueChange={(itemValue) =>
                                setNumAttempts(itemValue)
                            }>
                                <Picker.Item label={'Flash'} value={1} />
                            {[...Array(98)].map((_, index) => (
                                <Picker.Item key={index + 2} label={String(index + 2)} value={index + 2} />
                            ))}
                        </Picker>
                    </View>
                    <MaterialIconButton 
                        icon={like ? 'heart' : 'heart-outline'} 
                        onPress={handleHeartPress}>
                    </MaterialIconButton>
                    <Button mode='outlined'style={{marginTop: 20}} onPress={handleSave}>Save</Button>
                </View>
            </View>
        </View>
    );
}