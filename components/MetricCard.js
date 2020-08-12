import React from "react"
import styled from "styled-components/native"
import { View, Text } from "react-native";
import DateHeader from "./DateHeader";
import { getMetricMetaInfo } from "../utils/helpers";
import { gray } from "../utils/colors";

const Metric = styled.View`
  flex-direction: row;
  margin-top: 12px;
`

const MetricCard = ({date, metrics}) => {
  return (
    <View>
      {date && <DateHeader date={date}/>}
      {Object.keys(metrics).map(metric=> {
        const {getIcon, displayName, unit, backgroundColor} = getMetricMetaInfo(metric)

        return (
          <Metric key={metric}>
            {getIcon()}
            <View>
              <Text style={{fontSize: 20}}>
                {displayName}
              </Text>
              <Text style={{fontSize: 16, color: gray}}>
                {`${metrics[metric]} ${unit}`}
              </Text>
            </View>
          </Metric>
        )
      })}
    </View>
  )
};

export default MetricCard;
