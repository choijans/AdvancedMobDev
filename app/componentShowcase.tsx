import React from 'react';
import { Text, Button, Image, ScrollView, View, Alert } from 'react-native';

export default function ComponentShowcase() {
  const handleGotIt = () => {
    Alert.alert("Nice!", "You’ve understood the basics of React Native 🎉");
  };

  const codeStyle = {
    fontFamily: 'monospace',
    backgroundColor: '#1e293b',
    color: '#d1d5db',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#293c5a', padding: 20 }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 50, width: '100%' }}>

        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 20 }}>
          React Native Fundamentals 🚀
        </Text>

        <Image
          source={{ uri: 'https://framerusercontent.com/images/N0xefN2fE6CCF4G2YhAg5exTHX8.png?scale-down-to=1024' }}
          style={{ width: 140, height: 140, marginBottom: 20 }}
        />

        {/* 1. View */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00ADB5', marginBottom: 10 }}>
          1. View
        </Text>
        <Text style={{ fontSize: 16, color: '#eeeeee', marginBottom: 10, textAlign: 'center' }}>
          The <Text style={{ fontWeight: 'bold' }}>View</Text> component is like a container (similar to a div in web).
          It holds and arranges other components on the screen.
        </Text>
        <Text style={codeStyle}>
{`<View style={{ padding: 20 }}>
  <Text>Hello World</Text>
</View>`}
        </Text>

        {/* 2. Text */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00ADB5', marginBottom: 10 }}>
          2. Text
        </Text>
        <Text style={{ fontSize: 16, color: '#eeeeee', marginBottom: 10, textAlign: 'center' }}>
          The <Text style={{ fontWeight: 'bold' }}>Text</Text> component is used to display text on the screen.
          It supports styling for fonts, colors, and alignment.
        </Text>
        <Text style={codeStyle}>
{`<Text style={{ fontSize: 20, color: 'white' }}>
  Hello React Native
</Text>`}
        </Text>

        {/* 3. Image */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00ADB5', marginBottom: 10 }}>
          3. Image
        </Text>
        <Text style={{ fontSize: 16, color: '#eeeeee', marginBottom: 10, textAlign: 'center' }}>
          The <Text style={{ fontWeight: 'bold' }}>Image</Text> component lets you show pictures
          from the internet or from your local project assets.
        </Text>
        <Text style={codeStyle}>
{`<Image
  source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }}
  style={{ width: 50, height: 50 }}
/>`}
        </Text>

        {/* 4. Button */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00ADB5', marginBottom: 10 }}>
          4. Button
        </Text>
        <Text style={{ fontSize: 16, color: '#eeeeee', marginBottom: 10, textAlign: 'center' }}>
          The <Text style={{ fontWeight: 'bold' }}>Button</Text> component is an easy way
          to make things interactive. When pressed, it can trigger actions.
        </Text>
        <Text style={codeStyle}>
{`<Button
  title="Click Me"
  onPress={() => alert('Button pressed!')}
/>`}
        </Text>

        {/* 5. ScrollView */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#00ADB5', marginBottom: 10 }}>
          5. ScrollView
        </Text>
        <Text style={{ fontSize: 16, color: '#eeeeee', marginBottom: 10, textAlign: 'center' }}>
          The <Text style={{ fontWeight: 'bold' }}>ScrollView</Text> allows users
          to scroll through content when it overflows the screen.
        </Text>
        <Text style={codeStyle}>
{`<ScrollView>
  <Text>Lots of content...</Text>
</ScrollView>`}
        </Text>

        <Button title="Got It ✅" color="#1E90FF" onPress={handleGotIt} />

      </ScrollView>
    </View>
  );
}
