import React from "react"
import {Text} from "react-native"
import { purple } from "../utils/colors";

const DateHeader = (props) => {
  return (
    <Text style={{color: purple, fontSize: 25}}>
      {props.date}
    </Text>
  )
};

export default DateHeader;
