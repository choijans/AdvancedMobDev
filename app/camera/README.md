# Camera Screen with Real-time Filters

This camera screen provides a comprehensive photo capture and editing experience with real-time filters and editing tools.

## Features

### Camera Functionality
- **Front/Back Camera Toggle**: Switch between front and back cameras
- **Photo Capture**: High-quality photo capture with visual feedback
- **Persistent Storage**: Photos are saved locally and persist across app sessions
- **Permission Handling**: Proper camera permission requests and error handling

### Real-time Filters
- **Grayscale Filter**: Black and white conversion with adjustable intensity
- **Sepia Filter**: Vintage sepia tone with adjustable intensity
- **Vintage Filter**: Retro color grading with adjustable intensity
- **Filter Intensity Slider**: Real-time adjustment of filter strength (0-100%)

### Editing Tools
- **Photo Rotation**: 90-degree rotation increments
- **Crop Functionality**: Gesture-based cropping (planned)
- **Reset Function**: Reset all edits to original state
- **Real-time Preview**: See changes instantly as you edit

### Performance Optimizations
- **React.memo**: Filter preview component is memoized for better performance
- **Optimized Rendering**: Efficient re-rendering only when necessary
- **Smooth Animations**: Hardware-accelerated animations for UI interactions

## Components

### CameraScreen.tsx
Main camera screen component with:
- Camera view and controls
- Photo capture functionality
- Edit mode with filter and tool selection
- Persistent photo storage

### FilterPreview.tsx
Memoized component for displaying filtered images:
- Real-time filter application using GL shaders
- Optimized rendering with React.memo
- Support for multiple filter types

### IntensitySlider.tsx
Custom slider component for filter intensity:
- Smooth gesture-based interaction
- Real-time value updates
- Visual feedback with percentage display

## Usage

1. **Taking Photos**: Tap the capture button to take a photo
2. **Editing Photos**: Tap the edit button to enter edit mode
3. **Applying Filters**: Select a filter from the horizontal scroll list
4. **Adjusting Intensity**: Use the slider to adjust filter strength
5. **Rotating Photos**: Tap the rotate button to rotate 90 degrees
6. **Saving Changes**: Tap the checkmark to apply and save changes

## Technical Details

- **GL Shaders**: Custom fragment shaders for real-time filter effects
- **Image Manipulation**: Uses expo-image-manipulator for photo processing
- **Async Storage**: Local storage for photo persistence
- **Gesture Handling**: Pan gestures for slider interaction
- **TypeScript**: Full TypeScript support with proper type definitions

## Dependencies

- expo-camera: Camera functionality
- expo-image-manipulator: Photo editing and manipulation
- gl-react-expo: GL shader rendering
- react-native-gesture-handler: Gesture recognition
- @react-native-async-storage/async-storage: Local storage
