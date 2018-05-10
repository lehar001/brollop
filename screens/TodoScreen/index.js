import React from 'react';
import firebase from 'react-native-firebase';
import { Text, Button, View, FlatList, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

class TodoScreen extends React.Component {

  constructor() {
    super();
    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;

    db.collection('weddings').doc(uid).onSnapshot((wedding) => {
      if (wedding.data() !== undefined) {
        var weddingDay = wedding.data().date;
      }
      // Get completed todos from wedding object
      db.collection('weddings').doc(uid).collection('tasks').doc('completed').onSnapshot((querySnapshot) => {
        if (querySnapshot.data() !== undefined) {
          var completedTasks = querySnapshot.data().completed;
        } else {
          var completedTasks = [];
        }        // Now get todo items and use wedding date to calculate todo dates
        db.collection('todos').orderBy("daysBeforeWedding", "desc").onSnapshot((querySnapshot) => {
          var todos = [];
          querySnapshot.forEach(function(doc) {
            const todo = doc.data();

            var d = new Date(weddingDay);
            d.setDate(weddingDay.getDate() - todo.daysBeforeWedding);
            var todoDate = d.toLocaleString();
            var completed = false;
            if (completedTasks[doc.id] === true) {
              completed = true;
            }
            todos.push({
              key: doc.id,
              todoDate,
              todo,
              completed,
            });

          });
          this.setState({
            todos: todos,
          });
        });
      });
    });
  }

  componentWillUnmount(){
    const db = firebase.firestore();
    var unsubscribe = db.collection("todos").onSnapshot(() => {});
    unsubscribe();
  }

  renderTodo(todo) {
    return(
      <TouchableHighlight onPress={() => this.props.navigation.navigate('TodoDetail', {todo: todo.item})}>
        <View>
          <Text>{todo.item.todo.title}</Text>
          <Text>Deadline: {todo.item.todoDate}</Text>
          {todo.item.completed == true &&

              <Text>Avklarad</Text>

          }
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    return(
      <View>
        <FlatList
          data={this.state.todos}
          renderItem={this.renderTodo.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

export default TodoScreen;
