import React, { Component } from "react";
import { View, Text, ActivityIndicator } from "react-native";

class Live extends Component {
  state = {
    coords: null,
    status: null,
    direction: "",
  };
  render() {
    const { coords, status, direction } = this.state;

    switch (status) {
      case null:
        return <ActivityIndicator style={{ marginTop: 30 }} />;
      case "denied":
        return (
          <View>
            <Text>Access denied!</Text>
          </View>
        );
      case "undetermined":
        return (
          <View>
            <Text>undetermined</Text>
          </View>
        );
      default:
        return (
          <View>
            <Text>Live!</Text>
          </View>
        );
    }
    return <div></div>;
  }
}

export default Live;
