import React from 'react';
import { View, Text, FlatList, TouchableHighlight, Button } from 'react-native';
import firebase from 'react-native-firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SearchBar } from 'react-native-elements'

class BudgetScreen extends React.Component {

  static navigationOptions = ({ navigation, screenProps, color }) => ({
    headerRight: <Icon.Button name="ios-add-circle-outline" color={EStyleSheet.value('$primaryColor')} size={28} backgroundColor="rgba(255,255,255,0)" onPress={()=>{ navigation.navigate('NewBudgetItem'); }} />,
  });

  constructor() {
    super();
    this.state = {
      budgetItems: '',
      totalAmount: 0
    }
  }

  componentDidMount(){
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;

    db.collection("weddings").doc(uid).collection("budget").onSnapshot((querySnapshot) => {
      var budgetItems = [];
      var totalAmount = 0;
      querySnapshot.forEach(function(doc) {
        const { name, unitPrice, amount, quantity, quantityTypeIndex } = doc.data();
        totalAmount += amount;
        budgetItems.push({
          key: doc.id,
          name,
          unitPrice,
          amount,
          quantity,
          quantityTypeIndex
        });
      });
      this.setState({
        budgetItems: budgetItems,
        totalAmount: totalAmount,
        filteredBudgetItems: budgetItems
      });
    });
  }

  componentWillUnmount() {
    const db = firebase.firestore();
    var unsubscribe = db.collection("weddings").onSnapshot(() => {});
    unsubscribe();
  }

  beginSearch = (text) => {
    var allBudgetItems = this.state.budgetItems;
    var string = text.toUpperCase();
    //var allGuests = this.state.allGuests;
    var filteredBudgetItems = allBudgetItems.filter(function(item){
      var name = item["name"].toUpperCase();
      return name.includes(string);
    }).map(function(item){
        return item;
    });
    this.setState({
      filteredBudgetItems
    });
    if (string.length == 0) {
       this.setState({
         filteredBudgetItems: this.state.budgetItems,
       });
    }
  }

  clearSearch = () => {
    var allBudgetItems = this.state.budgetItems;
    this.setState({
      filteredBudgetItems: allBudgetItems,
    });
  }

  renderItem(item) {
    return(
      <TouchableHighlight onPress={() => this.props.navigation.navigate('NewBudgetItem', {item: item})}>
        <View>
          <Text>{item.item.name} x {item.item.quantity}</Text>
          <Text>{item.item.amount}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  _renderEmptyList() {
    if (this.state.budgetItems == 0) {
    return (
        <View>
          <Text>Du verkar inte ha lagt till något än...</Text>
          <Button title="Lägg till kostnad" onPress={() => this.props.navigation.navigate('NewBudgetItem')} />
        </View>
      )
      } else {
        return (
        <View>
          <Text>Inga resultat...</Text>
        </View>
      )
      }
  }

  render() {
    return(
      <View>
        <SearchBar
          onChangeText={(text) => this.beginSearch(text)}
          onClear={() => this.clearSearch()}
          placeholder='Sök gäst...'
        />
        <FlatList
          data={this.state.filteredBudgetItems}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this._renderEmptyList.bind(this)}
        />
        <Text>Total {this.state.totalAmount}</Text>
      </View>
    )
  }
}

export default BudgetScreen;
