import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    View
} from "react-native";
import { PanGestureHandler as RNGestureHandler } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");

interface IntensitySliderProps {
  value: number;
  onValueChange: (value: number) => void;
  label?: string;
}

export default function IntensitySlider({ value, onValueChange, label = "Intensity" }: IntensitySliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const translateX = useRef(new Animated.Value(value * (screenWidth - 100))).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === 1) { // BEGAN
      setIsDragging(true);
    } else if (event.nativeEvent.state === 3) { // END
      setIsDragging(false);
    }
  };

  const onGestureEventWithCallback = (event: any) => {
    const { translationX } = event.nativeEvent;
    const sliderWidth = screenWidth - 100;
    const newValue = Math.max(0, Math.min(1, (translationX + value * sliderWidth) / sliderWidth));
    onValueChange(newValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}: {Math.round(value * 100)}%
      </Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>0%</Text>
        <View style={styles.slider}>
          <View
            style={[
              styles.sliderFill,
              { width: `${value * 100}%` },
            ]}
          />
          <RNGestureHandler
            onGestureEvent={onGestureEventWithCallback}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.sliderThumb,
                {
                  left: `${value * 100}%`,
                  transform: [{ translateX: translateX }],
                },
              ]}
            />
          </RNGestureHandler>
        </View>
        <Text style={styles.sliderLabel}>100%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderLabel: {
    color: "#fff",
    fontSize: 12,
    width: 30,
  },
  slider: {
    flex: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    marginHorizontal: 10,
    position: "relative",
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  sliderThumb: {
    position: "absolute",
    top: -5,
    width: 30,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
});
