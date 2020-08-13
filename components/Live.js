import React, { Component } from "react";
import { View, Text, ActivityIndicator, Animated } from "react-native";
import styled from "styled-components/native";
import { purple, white } from "../utils/colors";
import { Foundation } from "@expo/vector-icons";
import { calculateDirection } from "../utils/helpers";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

const Container = styled.View`
  flex: 1;
  justify-content: space-between;
`;

const MetricContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  background-color: ${purple};
`;

const Metric = styled.View`
  flex: 1;
  padding: 15px 0;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 20px 10px;
`;

const Header = styled.Text`
  font-size: 35px;
  text-align: center;
  /* color: ${(props) =>
    props.color}; I have no idea why this gives an error 😕😕 */
  color: ${(props) => (props.color ? white : "black")};
`;
const SubHeader = styled.Text`
  font-size: 25px;
  text-align: center;
  margin-top: 5px;
  color: ${(props) => props.color}; /* And it work here 😂😂 */
`;

const DirectionContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const Direction = styled.Text`
  color: ${purple};
  font-size: 120px;
  text-align: center;
`;

const Center = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 0 30px;
`;

const Button = styled.TouchableOpacity`
  padding: 10px;
  background-color: ${purple};
  align-self: center;
  margin: 20px;
  border-radius: 5px;
`;

const ButtonText = styled.Text`
  color: ${white};
  font-size: 20px;
`;
class Live extends Component {
  state = {
    coords: null,
    status: null,
    direction: "",
    bounceValue: new Animated.Value(1),
  };

  componentDidMount() {
    this.askPermission();
  }
  askPermission = () => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === "granted") {
          return this.setLocation();
        }
        this.setState(() => ({ status }));
      })
      .catch((error) =>
        console.warn("Error asking Location Permission: ", error)
      );
  };

  setLocation = () => {
    Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 1,
        distanceInterval: 1,
      },
      ({ coords }) => {
        const newDirection = calculateDirection(coords.heading);
        const { direction, bounceValue } = this.state;

        if (newDirection !== direction) {
          Animated.sequence([
            Animated.timing(bounceValue, {
              duration: 200,
              toValue: 1.04,
              useNativeDriver: true,
            }),
            Animated.spring(bounceValue, {
              toValue: 1,
              friction: 4,
              useNativeDriver: true,
            }),
          ]).start();
        }

        this.setState(() => ({
          coords,
          direction: newDirection,
          status: "granted",
        }));
      }
    );
  };
  render() {
    const { coords, status, direction } = this.state;

    switch (status) {
      case null:
        return <ActivityIndicator style={{ marginTop: 30 }} />;
      case "denied":
        return (
          <Center>
            <Foundation name="alert" size={50} />
            <Text>
              You denied your location. You can fix this by visiting your
              settings and enabling location for this app.
            </Text>
          </Center>
        );
      case "undetermined":
        return (
          <Center>
            <Foundation name="alert" size={50} />
            <Text>You need to enable location services for this app.</Text>
            <Button onPress={this.askPermission}>
              <ButtonText>Enable</ButtonText>
            </Button>
          </Center>
        );
      default:
        return (
          <Container>
            <DirectionContainer>
              <Header>You are heading</Header>
              <Direction
                as={Animated.Text}
                style={{ transform: [{ scale: this.state.bounceValue }] }}
              >
                {direction}
              </Direction>
            </DirectionContainer>
            <MetricContainer>
              <Metric>
                <Header color>Altitude</Header>
                <SubHeader color={white}>
                  {Math.round(coords.altitude * 3.2808)} Feet
                </SubHeader>
              </Metric>
              <Metric>
                <Header color>Speed</Header>
                <SubHeader color={white}>
                  {(coords.speed * 2.2369).toFixed(1)} MPH
                </SubHeader>
              </Metric>
            </MetricContainer>
          </Container>
        );
    }
  }
}
export default Live;
