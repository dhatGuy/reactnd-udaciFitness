import React, { useEffect } from "react";
import { View, Platform, StatusBar } from "react-native";
import AddEntry from "./components/AddEntry";
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./reducers";
import History from "./components/History";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { white, purple } from "./utils/colors";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { createStackNavigator } from "@react-navigation/stack";
import EntryDetail from "./components/EntryDetail";
import Live from "./components/Live";
import { setLocalNotification } from "./utils/helpers";

const UdaciStatusBar = ({ backgroundColor, ...props }) => {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
};
export default function App() {
  useEffect(()=> {
    setLocalNotification()
  },[])
  const Tab =
    Platform.OS === "ios"
      ? createMaterialTopTabNavigator()
      : createBottomTabNavigator();

  const Stack = createStackNavigator();

  const Tabs = ()=> {
    return (
      <Tab.Navigator
          tabBarOptions={{
            activeTintColor: Platform.OS === "ios" ? purple : white,
            tabStyle: {
              height: 60,
              backgroundColor: Platform.OS === "ios" ? white : purple,
              shadowColor: "rgba(0, 0, 0, 0.24)",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 1,
              shadowRadius: 6,
              marginBottom: 20,
              paddingBottom: 15,
              paddingTop: 5,
            },
          }}
        >
          <Tab.Screen
            name="AddEntry"
            options={{
              tabBarLabel: "Add Entry",
              tabBarIcon: ({ color }) => (
                <FontAwesome name="plus-square" color={color} size={30} />
              ),
            }}
            component={AddEntry}
          />
          <Tab.Screen
            name="History"
            options={{
              tabBarLabel: "History",
              tabBarIcon: ({ color }) => (
                <Ionicons name="ios-bookmarks" color={color} size={30} />
              ),
            }}
            component={History}
          />
          <Tab.Screen
            name="Live"
            options={{
              tabBarLabel: "Live",
              tabBarIcon: ({ color }) => (
                <Ionicons name="ios-speedometer" color={color} size={30} />
              ),
            }}
            component={Live}
          />
        </Tab.Navigator>
    )
  }
  

  const MainNavigator = ()=> {
    return (
      <Stack.Navigator>
        <Stack.Screen name="UdaciFitness" component={Tabs} options={{
          headerTitleAlign: "center",
        }}/>
        <Stack.Screen name="EntryDetail" component={EntryDetail} options={{
          headerTintColor: white,
          headerStyle:{
            backgroundColor: purple
          },
          headerTitleAlign: "center",
        }}/>
      </Stack.Navigator>
    )
  }
  return (
    <Provider store={createStore(reducer)}>
      <NavigationContainer>
        <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
        <MainNavigator/>
      </NavigationContainer>
    </Provider>
  );
}
