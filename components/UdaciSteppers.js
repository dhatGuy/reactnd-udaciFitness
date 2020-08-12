import React from "react";
import { View, Text } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import styled from "styled-components/native";
import { gray, purple, white } from "../utils/colors";

const Row = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

export const MetricCounter = styled.View`
  width: 85px;
  justify-content: center;
  align-items: center;
`;

const ButtonAndroid = styled.TouchableOpacity`
  margin: 5px;
  background-color: ${purple};
  padding: 10px;
  border-radius: 2px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

const ButtonIOS = styled.TouchableOpacity`
  background-color: ${white};
  border-color: ${purple};
  border-width: 1px;
  border-radius: 3px;
  padding: 5px;
  padding-left: 25px;
  padding-right: 25px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;
const UdaciSteppers = ({
  max,
  unit,
  value,
  step,
  onIncrement,
  onDecrement,
}) => {
  return (
    <Row>
      {Platform.OS === "ios" ? (
        <View style={{ flexDirection: "row" }}>
          <ButtonIOS onPress={onDecrement}>
            <Entypo name="minus" size={30} color={white} />
          </ButtonIOS>
          <ButtonIOS onPress={onIncrement}>
            <Entypo name="plus" size={30} color={white} />
          </ButtonIOS>
        </View>
      ) : (
        <View style={{ flexDirection: "row" }}>
          <ButtonAndroid onPress={onDecrement}>
            <FontAwesome name="minus" size={30} color={white} />
          </ButtonAndroid>
          <ButtonAndroid onPress={onIncrement}>
            <FontAwesome name="plus" size={30} color={white} />
          </ButtonAndroid>
        </View>
      )}

      <MetricCounter>
        <Text style={{ fontSize: 24, textAlign: "center" }}>{value}</Text>
        <Text style={{ color: gray, fontSize: 18 }}>{unit}</Text>
      </MetricCounter>
    </Row>
  );
};

export default UdaciSteppers;
