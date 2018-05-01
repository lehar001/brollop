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
    const completed = this.props.navigation.state.params.todo.completed;
    if (completed === true) {
      this.setState({
        isCompleted: true,
      });
    }
  }

  render() {
    var todo = this.props.navigation.state.params.todo;

    onSetDone = () => {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;
      const key = todo.key;

      var tasksUpdate = {};
      tasksUpdate[`completed.${key}`] = true;

      db.collection("weddings").doc(uid).collection("tasks").doc("completed").update(tasksUpdate);

      this.setState({
        isCompleted: true,
      });
    }

    onSetNotDone = () => {
      const db = firebase.firestore();
      const uid = firebase.auth().currentUser.uid;
      const key = todo.key;

      var tasksUpdate = {};
      tasksUpdate[`completed.${key}`] = firebase.firestore.FieldValue.delete();

      db.collection("weddings").doc(uid).collection("tasks").doc("completed").update(tasksUpdate);

      this.setState({
        isCompleted: true,
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
