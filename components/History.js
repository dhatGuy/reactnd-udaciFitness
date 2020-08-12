import React, { Component } from "react";
import { View, Text, Platform } from "react-native";
import { connect } from "react-redux";
import { fetchCalendarResults } from "../utils/api";
import { receiveEntries, addEntry } from "../actions";
import { timeToString, getDailyReminderValue } from "../utils/helpers";
import UdaciFitnessCalendar from "udacifitness-calendar-fix";
import styled from "styled-components/native";
import { white } from "../utils/colors.js";
import DateHeader from "./DateHeader";
import MetricCard from "./MetricCard";
import { AppLoading } from "expo";

const Item = styled.View`
  background-color: ${white};
  border-radius: ${Platform.OS === "ios" ? "16px" : "2px"};
  padding: 20px;
  margin: 0 10px;
  margin-top: 17px;
  justify-content: center;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
`;

const NoData = styled.Text`
  font-size: 20px;
  padding: 20px 0;
`;

const Btn = styled.TouchableOpacity``;

class History extends Component {
  state = {
    ready: false,
  };
  componentDidMount() {
    const { dispatch } = this.props;

    fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue(),
            })
          );
        }
      })
      .then(()=> this.setState(()=> ({
        ready: true
      })))
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => {
    return (
      <Item>
        {today ? (
          <View>
            <DateHeader date={formattedDate} />
            <NoData>{today}</NoData>
          </View>
        ) : (
          <Btn onPress={()=> this.props.navigation.navigate(
            "EntryDetail",
            {entryId: key}
          )}>
            <MetricCard date={formattedDate} metrics={metrics} />
          </Btn>
        )}
      </Item>
    );
  };

  renderEmptyDate = (formattedDate) => {
    return (
      <Item>
        <DateHeader date={formattedDate} />
        <NoData>
          <Text>You didn't log any data on this day.</Text>
        </NoData>
      </Item>
    );
  };
  render() {
    if (this.state.ready === false) {
      return <AppLoading />;
    }
    return (
      <UdaciFitnessCalendar
        items={this.props.entries}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
      />
      // <View>
      //   <Text>Hello</Text>
      // </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    entries: state,
  };
};

export default connect(mapStateToProps)(History);
