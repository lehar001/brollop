import React from 'react';
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import EStyleSheet from 'react-native-extended-stylesheet';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegistrationScreen';
import HomeScreen from '../screens/HomeScreen';
import IntroScreen from '../screens/IntroScreen';
import GuestList from '../screens/GuestList';
import NewGuest from '../screens/NewGuest';
import StoreCategories from '../screens/StoreCategories';
import StoresList from '../screens/StoresList';
import StoreDetail from '../screens/StoreDetail';
import BudgetScreen from '../screens/BudgetScreen';
import NewBudgetItem from '../screens/NewBudgetItem';
import SettingsScreen from '../screens/SettingsScreen';
import TodoDetail from '../screens/TodoDetail';
import TodoScreen from '../screens/TodoScreen';

// Initial login stack navigator
export const LoginStack = StackNavigator({
  Login: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  }
}, {headerMode: 'none'});

export const GuestStack = StackNavigator({
  GuestList: {
    screen: GuestList,
    navigationOptions: {
      title: "Gästlista",
    },
  },
  NewGuest: {
    screen: NewGuest,
  }
});

export const TodoStack = StackNavigator({
  TodoScreen: {
    screen: TodoScreen,
    navigationOptions: {
      title: "Att göra"
    },
  },
});

export const HomeStack = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: "Hem"
    },
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      title: "Inställningar"
    },
  },
  TodoDetail: {
    screen: TodoDetail
  }
});

export const StoresStack = StackNavigator({
  StoresCategories: {
    screen: StoreCategories,
    navigationOptions: {
      title: "Butiker"
    },
  },
  StoresList: {
    screen: StoresList
  },
  StoreDetail: {
    screen: StoreDetail
  }
});

export const BudgetStack = StackNavigator({
  BudgetScreen: {
    screen: BudgetScreen,
    navigationOptions: {
      title: "Budget"
    },
  },
  NewBudgetItem: {
    screen: NewBudgetItem,
  }
});

// This is the main navigation stack
export const MainTabs = TabNavigator({
  Todos: {
    screen: TodoStack,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Att göra",
    }),
  },
  GuestList: {
    screen: GuestStack,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Gästlista",
    }),
  },
  Home: {
    screen: HomeStack,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Hem",
    }),
  },
  Stores: {
    screen: StoresStack,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Butiker",
    }),
  },
  Budget: {
    screen: BudgetStack,
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: "Budget",
    }),
  }
},{
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-home${focused ? '' : '-outline'}`;
        } else if (routeName === 'GuestList') {
          iconName = `ios-people${focused ? '' : '-outline'}`;
        } else if (routeName === 'Stores') {
          iconName = `ios-cloud${focused ? '' : '-outline'}`;
        } else if (routeName === 'Budget') {
          iconName = `ios-cash${focused ? '' : '-outline'}`;
        } else if (routeName === 'Todos') {
          iconName = `ios-list${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={25} style={{color: EStyleSheet.value('$primaryColor')}} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'teal',
      inactiveTintColor: 'gray',
    },
    initialRouteName: 'Home',
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  });

// Intro stack here
export const IntroStack = StackNavigator({
  Intro: {
    screen: IntroScreen,
  }
}, {headerMode: 'none', mode: 'modal'});
