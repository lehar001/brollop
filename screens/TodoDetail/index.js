import React from 'react';
import {Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase';

class TodoDetail extends React.Component {

  constructor() {
    super();
    this.state = {
      isCompleted: false,
    }
  }

  componentDidMount(){
    // Check if todo is completed
    const uid = firebase.auth().currentUser.uid;
    const completed = this.props.navigation.state.params.todo.todo.completed;
    if (completed[uid] === true) {
      this.setState({
        isCompleted: true,
      });
    }
  }

  render() {
    var todo = this.props.navigation.state.params.todo;

    onSetDone = () => {
      const db = firebase.firestore();
      const doc = db.collection("todos").doc(todo.key);
      const uid = firebase.auth().currentUser.uid;

      return db.runTransaction(transaction => {
        return transaction.get(doc).then(snapshot => {
          var completed = snapshot.data().completed;
          if (completed !== undefined) {
            completed[uid] = true;
            transaction.update(doc, 'completed', completed);
          } else {
            completed = {};
            completed[uid] = true;
            transaction.update(doc, 'completed', completed);
          }
          this.setState({
            isCompleted: true,
          })
        });
      });
    }

    onSetNotDone = () => {
      const db = firebase.firestore();
      const doc = db.collection("todos").doc(todo.key);
      const uid = firebase.auth().currentUser.uid;

      return db.runTransaction(transaction => {
        return transaction.get(doc).then(snapshot => {
          var completed = snapshot.data().completed;
          completed[uid] = false;
          transaction.update(doc, 'completed', completed);
          this.setState({
            isCompleted: false,
          })
        });
      });
    }

    return(
      <View>
        <Text>{todo.todo.title}</Text>
        <Text>Deadline: {todo.todoDate}</Text>
        {this.state.isCompleted ? (
            <Button title="Markera som ej avklarad" color="tomato" onPress={() => onSetNotDone()}/>
        ) : (
            <Button title="Markera som avklarad" onPress={() => onSetDone()}/>
        )}
      </View>
    )
  }
}

export default TodoDetail;
