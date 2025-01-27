import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import { router } from 'expo-router';
import api from '@/services/api';
import { AxiosError } from 'axios';
import { Appbar } from 'react-native-paper';
import BoardList from '@/components/BoardList';
import { Board } from '@/types/models';

export default function Boards() {
  const [boardList, setBoardlist] = useState<Board[]>([]);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const response = await api.get('/boards/');
        console.log('Board List:', response.data);
        setBoardlist(response.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Board fetch error:', {
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers
          });
        } else {
          console.error('Unexpected error: ', error);
        }
      }
    }
    fetchBoards();
  }, []);
    return (
      <>
        <Appbar.Header>
          <Appbar.Action icon="map" />
          <Appbar.Content title=""/>
          <Appbar.Action icon="magnify" onPress={() => {}} />
          <Appbar.Action icon="plus" onPress={() => {router.push('/new_board')}} />
        </Appbar.Header>
        <View style={{flex: 1}}>
          <BoardList boards={boardList}/>
        </View>
      </>
    );
  }