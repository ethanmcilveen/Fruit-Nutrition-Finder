//Author: Ethan McIlveen
//Date: March 2023
//Purpose: Fruit nutrition finder using api

import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, Button, TextInput } from 'react-native';

function App() {
  const [fetchData, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [fruitList, setFruitList] = useState([]);
  const [idList, setIdList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {//get all the valid ids for the api
    fetch("https://fruityvice.com/api/fruit/all")
      .then((response) => response.json())
      .then((data) => {
        setFruitList(data);
        const ids = data.map((fruit) => fruit.id);
        setIdList(ids);
      })
      .catch((error) => console.error(error));
  }, []);

/**
 * Gets the search results from a user inputed item into the search bar
 */
  async function getSearchResults(){
    try{
      const url = "https://fruityvice.com/api/fruit/" + searchTerm
      const response = await fetch(url)
      console.log(url)
      const content = await response.json(); 
      if (content && content.name) {
        setData(content);
        setError(null);
      } else {
        setError("No Results Found for: " + searchTerm);
      }
    }
    catch (error){
      console.error(error);
      setError("Error fetching data");
    } 
}

/**
 * Gets a random fruit from the api and displays its information
 */
  async function getRandSearchResults(){
    try{
      const url = "https://fruityvice.com/api/fruit/" + idList[Math.floor(Math.random() * idList.length)]
      const response = await fetch(url)
      console.log(url)
      const content = await response.json();   
      setData(content)
      setError(null)
      }
      catch (error){
        console.error(error);
      }

  }
//each nutrition element stored in here
  const nutritionData = [
    { title: 'Calories', value: fetchData?.nutritions?.calories || '-' },
    { title: 'Carbs', value: fetchData?.nutritions?.carbohydrates + "g"|| '-' },
    { title: 'Protein', value: fetchData?.nutritions?.protein + "g"|| '-' },
    { title: 'Fat', value: fetchData?.nutritions?.fat + "g"|| '-' },
    { title: 'Sugar', value: fetchData?.nutritions?.sugar + "g"|| '-' },
  ];
/**
 * 
 * @param {item} item
 * @returns a view for how each nutrtition element is shown
 */
function renderItem({ item }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}: {item.value} </Text>
    </View>
  );
}

  return (//header. img, information on what it is
    <View style={styles.container}>
    <Text style={styles.header}>Fruit Nutrition Finder</Text>
    <img style={styles.image} src={require('./assets/fruit.jpg')} />
    <Text style={styles.ital}>Type in the name of a fruit and see its nutritional information</Text>
    <TextInput    //user input
      style={styles.input}
      onChangeText={setSearchTerm}
      value={searchTerm}
      placeholder="Enter a fruit name"
    />
    <View style={styles.buttonContainer}> {/*2 buttons*/}
      <Button title="Search Fruit" onPress={getSearchResults} />
      <Button title="Random Fruit" onPress={getRandSearchResults} />
    </View>
    {error && ( 
      <View style={styles.errorContainer}> {/*Display error message if it has one set*/}
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    )}
    {fetchData && fetchData.name && (
      <View style={{ alignItems: 'center' }}> {/*Display fruit information if it is available*/}
        <Text style={{ fontSize: 26, fontStyle: 'bold'}}>{fetchData.name}</Text>
        <Text style={[styles.bold, styles.underline]}>Nutrition Information:</Text>
        <FlatList 
          data={nutritionData}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
        />
      </View>
    )}
    <StatusBar style="auto" />
  </View>
);
}
{/*Styles used*/}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
  },  
  input: {
    borderWidth: 1,
    borderColor: '#zzz',
    borderRadius: 5,
    padding: 10,
    marginVertical: 20,
    width: '40%',
    fontSize: 18,
  },
  errorMessage: {
    color: 'red',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '50%',
    paddingHorizontal: 20,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  header: {
    fontSize: 36,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginVertical: 20,
  },
  bold:{fontSize: 20},
  ital:{fontStyle: 'italic'},
  underline: {textDecorationLine: 'underline'}
});

export default App;
