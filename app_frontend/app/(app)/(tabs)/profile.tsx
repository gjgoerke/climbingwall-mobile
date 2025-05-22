import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';


import { useAuth } from '@/context/AuthContext';
import BarGraph, { BarGraphData } from '@/components/BarGraph';
import { AscentWithBoulder } from '@/types/models';
import api from '@/services/api';
import { useFocusEffect } from 'expo-router';
import AscentLog from '@/components/AscentLog';

interface AscentsByDate {
  [key: string]: AscentWithBoulder[];
}

export default function Profile() {
  const {onLogout} = useAuth();
  const [ascents, setAscents] = useState<AscentWithBoulder[]>([]);
  const [graphData, setGraphData] = useState<BarGraphData[]>([]);
  const [ascentListData] = useState([]);

  // Fetch ascent data from server.
  useFocusEffect(React.useCallback(()=> {
    const fetchAscents = async () => {
        try {
            const response = await api.get(`users/me/ascents/`);
            setAscents(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }  
    }
    fetchAscents();
  }, []));

  // Compute BarGraphData 
  useEffect(() => {
    const numPerGrade = Array(15).fill(0);
    for (let i = 0; i < ascents.length; i++) {
        if (!(ascents[i].proposed_grade == null || ascents[i].proposed_grade == undefined)) {
            numPerGrade[ascents[i].proposed_grade] += 1;
        }
    }
    setGraphData(numPerGrade.map((value, index) => ({
        label: 'V' + String(index),
        value: value
    })));
  }, [ascents])

  // Compute ascent list data.
  useEffect(() => {
    let ascentsByDate: AscentsByDate = {};
    ascents.forEach(ascent=>{
      const ascentDate = new Date(ascent.date_time).toLocaleDateString();
      if(!ascentsByDate[ascentDate]) {
        ascentsByDate[ascentDate] = []
      }
      ascentsByDate[ascentDate].push(ascent);
    })
  },[ascents]);
  
    return (

      // <SectionList
      //   sections={data}
      //   keyExtractor={(item, index) => item + index}
      //   renderItem={({item}) => (
      //     <View style={styles.item}>
      //       <Text style={styles.title}>{item}</Text>
      //     </View>
      //   )}
      //   renderSectionHeader={({section: {title}}) => (
      //     <Text style={styles.header}>{title}</Text>
      //   )}
      // />
      <ScrollView style={styles.container}>
          <BarGraph data={graphData}></BarGraph>
          <AscentLog ascents={ascents}></AscentLog>
          <Button onPress={onLogout} mode='outlined'>Sign Out</Button>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
    }
});