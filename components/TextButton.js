import React from "react"
import { TouchableOpacity, Text } from "react-native";
import { purple } from "../utils/colors";

const TextButton = ({children, onPress, style={}}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={[{textAlign: "center", color: purple}, style]}>{children}</Text>
    </TouchableOpacity>
  )
};

export default TextButton;

