import React from "react";
import { View, AsyncStorage } from "react-native";
import { white, lightPurp, red, orange, pink, blue } from "./colors";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import styled from "styled-components/native";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

const NOTIFICATION_KEY = "UdaciFitness:notifications";

const IconContainer = styled.View`
  padding: 5px;
  border-radius: 8px;
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  background-color: ${(props) => props.color || "#fff"};
`;
export function isBetween(num, x, y) {
  if (num >= x && num <= y) {
    return true;
  }

  return false;
}

export function calculateDirection(heading) {
  let direction = "";

  if (isBetween(heading, 0, 22.5)) {
    direction = "North";
  } else if (isBetween(heading, 22.5, 67.5)) {
    direction = "North East";
  } else if (isBetween(heading, 67.5, 112.5)) {
    direction = "East";
  } else if (isBetween(heading, 112.5, 157.5)) {
    direction = "South East";
  } else if (isBetween(heading, 157.5, 202.5)) {
    direction = "South";
  } else if (isBetween(heading, 202.5, 247.5)) {
    direction = "South West";
  } else if (isBetween(heading, 247.5, 292.5)) {
    direction = "West";
  } else if (isBetween(heading, 292.5, 337.5)) {
    direction = "North West";
  } else if (isBetween(heading, 337.5, 360)) {
    direction = "North";
  } else {
    direction = "Calculating";
  }

  return direction;
}

export function timeToString(time = Date.now()) {
  const date = new Date(time);
  const todayUTC = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return todayUTC.toISOString().split("T")[0];
}

export const getMetricMetaInfo = (metric) => {
  const info = {
    run: {
      displayName: "Run",
      max: 50,
      unit: "miles",
      step: 1,
      type: "steppers",
      getIcon() {
        return (
          <IconContainer color={red}>
            <MaterialIcons name="directions-run" color={white} size={35} />
          </IconContainer>
        );
      },
    },
    bike: {
      displayName: "Bike",
      max: 100,
      unit: "miles",
      step: 1,
      type: "steppers",
      getIcon() {
        return (
          <IconContainer color={lightPurp}>
            <MaterialCommunityIcons name="bike" color={white} size={35} />
          </IconContainer>
        );
      },
    },
    swim: {
      displayName: "Swim",
      max: 9900,
      unit: "meters",
      step: 100,
      type: "steppers",
      getIcon() {
        return (
          <IconContainer color={orange}>
            <MaterialCommunityIcons name="swim" color={white} size={35} />
          </IconContainer>
        );
      },
    },
    sleep: {
      displayName: "sleep",
      max: 24,
      unit: "hours",
      step: 1,
      type: "slider",
      getIcon() {
        return (
          <IconContainer color={pink}>
            <FontAwesome name="bed" color={white} size={35} />
          </IconContainer>
        );
      },
    },
    eat: {
      displayName: "Eat",
      max: 10,
      unit: "rating",
      step: 1,
      type: "slider",
      getIcon() {
        return (
          <IconContainer color={blue}>
            <MaterialCommunityIcons name="food" color={white} size={35} />
          </IconContainer>
        );
      },
    },
  };

  return typeof metric === "undefined" ? info : info[metric];
};

export const getDailyReminderValue = () => {
  return {
    today: "👋 Don't forget to log your data today!",
  };
};

export const createNotification = () => {
  return {
    title: "Log your stats",
    body: "👋 Don't forget to log stats for today!😉",
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: "high",
      sticky: false,
      vibrate: true,
    },
  };
};

export const clearLocalNotification = () => {
  return AsyncStorage.removeItem(NOTIFICATION_KEY)
  .then(Notifications.cancelAllScheduledNotificationsAsync)
};

export const setLocalNotification = () => {
  AsyncStorage.getItem(NOTIFICATION_KEY)
  .then(JSON.parse)
  .then(data=>{
    if(data === null){
      Permissions.askAsync(Permissions.NOTIFICATIONS)
      .then(({status})=>{
        if(status === "granted"){
          Notifications.cancelAllScheduledNotificationsAsync()

          let tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setHours(20)
          tomorrow.setMinutes(0)

          Notifications.scheduleNotificationAsync(
            createNotification(),
            {
              time: tomorrow,
              repeat: "day"
            }
          )
          AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
        }
      })
    }
  })
};
