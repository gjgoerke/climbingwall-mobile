import React from "react";
import { View, StyleSheet } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {useState, useEffect, useCallback } from 'react';
import { Appbar, Button } from "react-native-paper";
import BoulderList from "@/components/BoulderList"
import { Boulder } from "@/types/models"
import api from "@/services/api";  
import { useBoard } from "@/context/BoardContext";

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    width: '100%',
  }
});

export default function Index() {
  const { selectedBoard } = useBoard();
  let { refresh } = useLocalSearchParams();
  const [boulderList, setBoulderlist] = useState<Boulder[]>([]);

  async function fetchBoulders() {
    try {
      const response = await api.get(`/boards/${selectedBoard?.id}/boulders/`);
      setBoulderlist(response.data);
      console.log('boulder list: ', response.data)
    } catch (error: any) {
      if(error.response && error.response.status === 401) {
        console.log('Unauthorized: User needs to login.');
        router.replace('/login')
      } else {
        console.error(error);
      }
    }
  }

  useFocusEffect( 
    useCallback(() => {
      if (selectedBoard) {
        fetchBoulders();
      }
    }, [selectedBoard, refresh]));

  const onSelectBoard = () => {
    router.navigate('/(tabs)/(boards)');
  }

  return (
    <View style={{flex: 1}}>
      {selectedBoard ?
        <>
          <Appbar.Header>
            <Appbar.Content title={selectedBoard.name}/>
            <Appbar.Action icon="magnify" onPress={() => {}} />
            <Appbar.Action icon="plus" onPress={() => {router.navigate('/(tabs)/(boulders)/set_boulder')}} />
            <Appbar.Action icon="dots-vertical"/>
          </Appbar.Header>
          <BoulderList boulders={boulderList}/>
        </>
      :
        <View style={styles.container}>
          <Button onPress={onSelectBoard} 
            mode='contained-tonal' 
            >
              Select Board
          </Button>
        </View>
      }
      
    </View>
  );
}
