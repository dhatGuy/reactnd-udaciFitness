import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import styled from "styled-components";
import { white } from "../utils/colors";
import MetricCard from "./MetricCard";
import {addEntry} from "../actions"
import { removeEntry } from "../utils/api";
import { getDailyReminderValue, timeToString } from "../utils/helpers";
import TextButton from "./TextButton";


const Container = styled.View`
  flex: 1;
  background-color: ${white};
  padding: 15px;
`
class EntryDetail extends Component {
  state = {};
  setTitle = (entryId) => {
    if (!entryId) return;

    const year = entryId.slice(0, 4);
    const month = entryId.slice(5, 7);
    const day = entryId.slice(8);

    this.props.navigation.setOptions({
      title: `${month}-${day}-${year}`,
    });
  };

  reset = () => {
    const {goBack, remove, entryId} = this.props

    remove()
    goBack()
    removeEntry(entryId)
  }

  shouldComponentUpdate(nextprops) {
    return nextprops !== null && !nextprops.metrics.today
  }
  render() {
    const { entryId } = this.props.route.params;
    this.setTitle(entryId);
    return (
      <Container>
        <MetricCard metrics={this.props.metrics} />
        <TextButton onPress={this.reset} style={{margin: 20}}>
          RESET
        </TextButton>
      </Container>
    );
  }
}

const mapStateToProps = (state, {route})=> {
  const {entryId} = route.params

  return {
    entryId,
    metrics: state[entryId]
  }
}

const mapDispatchToProps = (dispatch, {route, navigation}) => {
  const {entryId} = route.params

  return {
    remove: ()=> dispatch(addEntry({
      [entryId]: timeToString() === entryId 
      ? getDailyReminderValue()
      : null
    })),
    goBack: ()=> navigation.goBack()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
