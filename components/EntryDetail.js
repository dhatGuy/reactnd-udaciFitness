import React, { Component } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import styled from "styled-components";
import { white } from "../utils/colors";
import MetricCard from "./MetricCard";

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
  render() {
    const { entryId } = this.props.route.params;
    this.setTitle(entryId);
    return (
      <Container>
        {console.log(this.props.metrics)}
        <MetricCard metrics={this.props.metrics} />
        <Text>Entry Detail</Text>
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

export default connect(mapStateToProps)(EntryDetail);
