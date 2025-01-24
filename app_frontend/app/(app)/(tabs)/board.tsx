import React from 'react';
import { Text, View } from "react-native";
import { Button } from 'react-native-paper';
import { useAuth } from '@/context/AuthContext';

export default function Wall3d() {
  const {onLogout} = useAuth();
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,}}>
        <Button onPress={onLogout} mode='outlined'>Sign Out</Button>
      </View>
    );
  }