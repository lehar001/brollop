import React from 'react';
import { View, Text, TouchableHighlight, FlatList } from 'react-native';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';


class StoreCategories extends React.Component{

  constructor() {
    super();
    this.state = {
      categories: [],
    }
  }

  componentDidMount(){
    const db = firebase.firestore();

    db.collection('stores').onSnapshot((querySnapshot) => {
      var categories = [];
      querySnapshot.forEach(function(doc) {
        const { name, icon } = doc.data();
        categories.push({
          key: doc.id,
          name,
          icon,
        });
      });
      this.setState({
        categories: categories,
      });
    });
  }

  componentWillUnmount(){
    const db = firebase.firestore();
    var unsubscribe = db.collection("stores").onSnapshot(() => {});
    unsubscribe();
  }

  renderItem(category) {
    return(
      <TouchableHighlight onPress={() => { this.props.navigation.navigate('StoresList', {category: category})}}>
        <View>
          <Icon name={category.item.icon} size={30} style={{color:EStyleSheet.value('$primaryColor')}} />
          <Text>{category.item.name}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return(
      <View>
        <FlatList
          data={this.state.categories}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
}

export default StoreCategories;
