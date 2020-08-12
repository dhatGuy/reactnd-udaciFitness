import React from "react";
import { View, Text, Slider } from "react-native";
import styled from "styled-components/native";
import { MetricCounter } from "./UdaciSteppers";
import { gray } from "../utils/colors";

const Row = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const UdaciSlider = ({ max, unit, step, value, onChange }) => {
  return (
    <Row>
      <Slider
        style={{ flex: 1 }}
        step={step}
        minimumValue={0}
        maximumValue={max}
        onValueChange={onChange}
        value={value}
      />
      <MetricCounter>
        <Text style={{ fontSize: 24, textAlign: "center" }}>{value}</Text>
        <Text style={{ color: gray, fontSize: 18 }}>{unit}</Text>
      </MetricCounter>
    </Row>
  );
};

export default UdaciSlider;
