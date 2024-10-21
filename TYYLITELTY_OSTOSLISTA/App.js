import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, FlatList, Alert,SafeAreaView } from "react-native";
import { useState, useEffect } from "react";


import { app } from "./firebaseConfig";
import { getDatabase, ref, push, onValue, remove, get } from "firebase/database";
import {  PaperProvider, TextInput, Button, Card, Text, IconButton } from "react-native-paper";

import Bar  from "./Bar";

export default function App() {
  
  const [product, setProduct] = useState({
    title: '',
    amount: ''
  });

  const [items, setItems] = useState([]);

  const database = getDatabase(app);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataItems = Object.keys(data).map(key => {
          return {
            id: key,
            ...data[key]
          };
        });
        // console.log(dataItems);

        setItems(dataItems);
      } else {
        setItems([]); // Handle the case when there are no items
      }
    })
  }, []);


  const handleSave = () => {
    if (product.amount && product.title) {
      push(ref(database, 'items/'), product);
      setProduct({ title: '', amount: '' });
    }
    else {
      Alert.alert('Error', 'Type product and amount first');
    }
  }


  const handleDelete = (item) => {
    const itemRef = ref(database, `items/${item.id}`);
    remove(itemRef);

  }

  return (
    <PaperProvider  >
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light"  />
      
      <Bar/>
      <View style={styles.container}>

        <View style={styles.inputs}>

          <TextInput
            style={styles.inputfield}
            label="Product"
            onChangeText={text => setProduct({ ...product, title: text })}
            value={product.title}
            mode="flat"
            placeholder="Product"
            keyboardType="default"
          />
          <TextInput
            style={styles.inputfield}
            label="Quantity"
            value={product.amount}
            mode="flat"
            onChangeText={text => setProduct({ ...product, amount: text })}
            placeholder="Quantity"
            keyboardType="default"
          />
        </View>

        <View >
          <Button style={styles.savebutton} mode="contained" icon="content-save" title="Save" onPress={handleSave} >Save</Button>
        </View>

        <FlatList
          renderItem={({ item }) =>
            <Card  >
              <Card.Content style={styles.item}>
                <Card.Title
                 title={item.title}
                 subtitle={item.amount}
                 right={(props) => (
                    <IconButton
                      {...props}
                      iconColor="red"
                      icon="trash-can"
                      onPress={() => handleDelete(item)}
                      />
                 )}/>
                 {/* <Button mode="contained" icon="trash-can" title="delete" onPress={() => handleDelete(item)} >Delete</Button> */}
              </Card.Content >
            </Card >
          }
          data={items} />

      <StatusBar style="auto" />
      </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputs: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  
  },
  inputfield: {
    width: "80%",
    backgroundColor: "white",
    padding: 10,
    marginVertical: 10,

  },
  savebutton : {
    width: "40%",
    borderRadius: 0,
    alignSelf: "center",
    margin: 20,
  },
  item: {

    // borderWidth: 1,
  },
});