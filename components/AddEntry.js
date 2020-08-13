import React, { Component } from "react";
import { View, Text, Platform } from "react-native";
import {
  getMetricMetaInfo,
  timeToString,
  getDailyReminderValue,
  clearLocalNotification,
  setLocalNotification,
} from "../utils/helpers";
import UdaciSlider from "./UdaciSlider";
import UdaciSteppers from "./UdaciSteppers";
import DateHeader from "./DateHeader";
import { Ionicons } from "@expo/vector-icons";
import TextButton from "./TextButton";
import { submitEntry, removeEntry } from "../utils/api";
import { connect } from "react-redux";
import { addEntry } from "../actions";
import styled from "styled-components/native";
import { purple, white } from "../utils/colors";
import { CommonActions } from "@react-navigation/native";

const Button = styled.TouchableOpacity`
  background-color: ${purple};
  padding: 10px;
  height: 45px;
  border-radius: ${Platform.OS === "ios" ? "7px" : "2px"};
  margin: ${Platform.OS === "ios" ? "0 40px" : "0"};
  padding: ${Platform.OS === "ios" ? "initial" : "0 30px"};
  align-self: ${Platform.OS === "ios" ? "auto" : "flex-end"};
  justify-content: ${Platform.OS === "ios" ? "auto" : "center"};
  align-items: ${Platform.OS === "ios" ? "auto" : "center"};
`;

const ButtonText = styled.Text`
  color: ${white};
  font-size: 22px;
  text-align: center;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${white};
  padding: 28px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const Logged = styled.View`
  margin: 0 30px;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

function SubmitBtn({ onPress }) {
  return (
    <Button onPress={onPress}>
      <ButtonText>SUBMIT</ButtonText>
    </Button>
  );
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0,
  };
  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric);

    this.setState((state) => {
      const count = state[metric] + step;

      return {
        ...state,
        [metric]: count > max ? max : count,
      };
    });
  };
  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step;

      return {
        ...state,
        [metric]: count < 0 ? 0 : count,
      };
    });
  };
  slide = (metric, value) => {
    this.setState(() => ({
      [metric]: value,
    }));
  };
  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.props.dispatch(
      addEntry({
        [key]: entry,
      })
    );

    this.setState(() => ({ run: 0, bike: 0, swim: 0, sleep: 0, eat: 0 }));

    // Navigate to home
    this.props.goBack()

    submitEntry({ key, entry });

    // Clear local notification
    clearLocalNotification().then(setLocalNotification())
  };
  reset = () => {
    const key = timeToString();

    this.props.dispatch(
      addEntry({
        [key]: getDailyReminderValue(),
      })
    );

    // Route to Home
    this.props.goBack()

    removeEntry(key);
  };

  render() {
    const metaInfo = getMetricMetaInfo();

    if (this.props.alreadyLogged) {
      return (
        <Logged>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-happy" : "md-happy"}
            size={100}
          />
          <Text>You already logged your information for today.</Text>
          <TextButton onPress={this.reset}>Reset</TextButton>
        </Logged>
      );
    }

    return (
      <Container>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const { getIcon, type, ...rest } = metaInfo[key];
          const value = this.state[key];

          return (
            <Row key={key}>
              {getIcon()}
              {type === "slider" ? (
                <UdaciSlider
                  value={value}
                  onChange={(value) => this.slide(key, value)}
                  {...rest}
                />
              ) : (
                <UdaciSteppers
                  value={value}
                  onIncrement={() => this.increment(key)}
                  onDecrement={() => this.decrement(key)}
                  {...rest}
                />
              )}
            </Row>
          );
        })}
        <SubmitBtn onPress={this.submit} />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const key = timeToString();

  return {
    alreadyLogged: state[key] && typeof state[key].today === "undefined",
  };
}

function mapDispatchToProps(dispatch, { navigation }){
 
  return{
      dispatch,
      goBack: () => navigation.goBack()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEntry);
