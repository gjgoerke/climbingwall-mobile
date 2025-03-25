import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Platform, ScrollView } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

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
    const [comment, setComment] = useState('');
    

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            padding: 16,
        },
        inputContainer: {
            width: '100%',
            gap: 16,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '500',
            marginBottom: 8,
        },
        pickerRow: {
            flexDirection: 'row',
            marginBottom: 20,
        },
        pickerColumn: {
            flex: 1,
            marginHorizontal: 5,
        },
        pickerWrapper: {
            height: Platform.OS === 'ios' ? 150 : 50,
            borderRadius: 4,
            overflow: 'hidden',
        },
        picker: {
            width: '100%',
        },
        pickerItem: {
            fontSize: 16,
        },
        dateTimeContainer: {
            marginBottom: 20,
        },
        commentInput: {
            marginBottom: 20,
        },
        actionButtons: {
            marginTop: 10,
            gap: 10,
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
                date_time: climbDT.toISOString(),
                comment: comment
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
            
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.inputContainer}>
                    {/* Date/Time Section */}
                    <View style={styles.dateTimeContainer}>
                        <Text style={styles.sectionTitle}>When did you climb this?</Text>
                        {Platform.OS === 'ios' ? (
                            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
                        ) : (
                            <>
                                <Button 
                                    onPress={showDatePickerSwitch} 
                                    icon={'calendar'}
                                    mode="outlined"
                                    contentStyle={{flexDirection: 'row-reverse'}}>
                                    {formatDateTime(climbDT)}
                                </Button>
                                {dateShow && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={climbDT}
                                        mode={'date'}
                                        onChange={onChange}
                                    />
                                )}
                            </>
                        )}
                    </View>
                    
                    {/* Grade and Attempts Section */}
                    <View style={styles.pickerRow}>
                        {/* Grade Picker */}
                        <View style={styles.pickerColumn}>
                            <Text>Feels like a</Text>
                            <View style={styles.pickerWrapper}>                    
                                <Picker
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                    selectedValue={suggestedGrade}
                                    onValueChange={(itemValue) => setSuggestedGrade(itemValue)}>
                                    <Picker.Item label={'?'} value={null} />
                                    {[...Array(18)].map((_, index) => (
                                        <Picker.Item key={index} label={'V' + index} value={index} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        
                        {/* Attempts Picker */}
                        <View style={styles.pickerColumn}>
                            <Text>Attempts</Text>
                            <View style={styles.pickerWrapper}>  
                                <Picker
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                    selectedValue={numAttempts}
                                    onValueChange={(itemValue) => setNumAttempts(itemValue)}>
                                    <Picker.Item label={'Flash'} value={1} />
                                    {[...Array(98)].map((_, index) => (
                                        <Picker.Item key={index + 2} label={String(index + 2)} value={index + 2} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                    
                    {/* Comment Section */}
                    <TextInput
                        style={styles.commentInput}
                        placeholder="Add a comment about your ascent (e.g. soft)"
                        onChangeText={(text: string) => {setComment(text);}} 
                        multiline
                        numberOfLines={2}
                    />
                    
                    {/* Like Button - Centered horizontally */}
                    <View style={{ alignItems: 'center' }}>
                        <MaterialIconButton 
                            icon={like ? 'heart' : 'heart-outline'} 
                            onPress={handleHeartPress}>
                        </MaterialIconButton>
                    </View>
                    
                    {/* Save Button */}
                    <View style={styles.actionButtons}>
                        <Button mode='contained' onPress={handleSave}>Save Ascent</Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}