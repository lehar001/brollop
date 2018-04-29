import React from 'react';
import {Text, View, Button} from 'react-native';
import firebase from 'react-native-firebase';

class TodoDetail extends React.Component {
  render() {
    var todo = this.props.navigation.state.params.todo;

    onSetDone = () => {
      const db = firebase.firestore();
      const doc = db.collection("todos").doc(todo.key);
      const uid = firebase.auth().uid;

      return db.runTransaction(transaction => {
        return transaction.get(doc).then(snapshot => {
          const newCompleted = snapshot.data().completed.push(uid);
          transaction.update(doc, 'completed', newCompleted);
        });
      });
    }

    return(
      <View>
        <Text>{todo.todo.title}</Text>
        <Text>Deadline: {todo.todoDate}</Text>
        <Button title="Markera som avklarad" onPress={() => onSetDone()}/>
      </View>
    )
  }
}

export default TodoDetail;
