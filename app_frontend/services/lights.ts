import axios from 'axios';
export const ESP_URL = 'http://10.0.0.250:8000';

import { BoulderHold } from '@/app/(app)/(tabs)/(boulders)/set_boulder';

export const esp = axios.create({
    baseURL: ESP_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const updateLights = async (boulderHoldArray: BoulderHold[]) => {
    const holdTypeNumber = {
        "UNSELECTED": 0,
        "START": 1,
        "FINISH": 2,
        "GENERAL": 3,
        "FEET": 4
    }

    const holds = boulderHoldArray.filter((hold) => (hold.type !== 'UNSELECTED')).map((value) => {
        return ({
            // The unfortunately named "index" should be changed to led_number or similar when possible.
            index: value.led_number,
            type: holdTypeNumber[value.type]
        });
    });

    try {
        const response = await esp.post('/lights', { holds });
        return response.data; // Return the response
    } catch (error) {
        console.error('Error updating lights:', error);
        throw error; 
    }
}

export const highlightLed = async (ledNumber: number) => {
    try {
        const response = await esp.post('/lights', { holds: [{index: ledNumber, type: 4}] });
        return response.data; // Return the response
    } catch (error) {
        console.error('Error updating lights:', error);
        console.log(error)
        throw error; 
    }
}