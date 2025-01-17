import { Text, View } from "react-native";
import BoulderList from "@/components/BoulderList"
import { Boulder } from "@/types/models"
const getBoardsFromApi = () => {
  return fetch('https://reactnative.dev/movies.json')
    .then(response => response.json())
    .then(json => {
      return json.movies;
    })
    .catch(error => {
      console.error(error);
    });
};

const getBouldersFromApi = () => {

}

const mockBoulders: Boulder[] = [
  {
    id: 1,
    name: "Crimpy McSend",
    description: "A classic crimp fest",
    date_set: "2024-02-15T10:00:00Z",
    board: 1,
    setter: 1,
    first_ascentionist: 2,
    draft: false,
    rating: 4,
    fa_grade: 6,
    consensus_grade: 7,
    ascentionist_count: 12
  },
  {
    id: 2,
    name: "Slopey Joe",
    description: "All slopers all day",
    date_set: "2024-02-14T15:30:00Z",
    board: 1,
    setter: 1,
    draft: true,
    rating: 5,
    fa_grade: null,
    consensus_grade: null,
    ascentionist_count: 100
  },
  {
    id: 3,
    name: "Dyno Time",
    description: "Big moves between good holds",
    date_set: "2024-02-13T09:15:00Z",
    board: 1,
    setter: 2,
    first_ascentionist: 1,
    draft: false,
    rating: 5,
    fa_grade: 8,
    consensus_grade: 7, 
    ascentionist_count: 69420
  }
];
export default function Index() {

  return (
    <View style={{flex: 1,}}>
      <BoulderList boulders={mockBoulders}/>
    </View>
  );
}
