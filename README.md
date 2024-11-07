# Audio Recording App

This is an **Audio Recording App** built with React Native, allowing users to record, play, pause, and stop audio recordings. The app also supports saving recorded audio files and playing them back later.

## Features

- Record audio with a start/stop button.
- View the recording duration in real-time (timer).
- Save audio files to the local device storage.
- Play, pause, and stop previously recorded audio files.
- Simple UI with audio control buttons.

## Requirements

- **React Native** (Expo)
- **Expo AV**: For handling audio recording and playback.
- **AsyncStorage**: To store file paths of recorded audio.
- **FileSystem**: To manage the saved audio files on the device.

## Installation

1. **Clone the repository**:
    ```bash
    git clone <repo-url>
    ```

2. **Install dependencies**:
    Make sure you have Expo CLI installed. If not, you can install it using:
    ```bash
    npm install -g expo-cli
    ```
    Then, run:
    ```bash
    npm install
    ```

3. **Start the app**:
    Once the dependencies are installed, you can start the app using:
    ```bash
    expo start
    ```

4. **Run on your device**:
    You can scan the QR code with the Expo Go app on your mobile device to see the app in action.

## App Walkthrough

1. **Recording Audio**:  
   - Tap the "Start Recording" button to begin recording.
   - The timer will display the time elapsed since the recording started.
   - Tap the "Stop Recording" button to stop the recording.
   
2. **Audio Playback**:  
   - After recording, tap the "Play" button to listen to the recorded audio.
   - You can pause or stop the playback using the respective buttons.

3. **Storage**:  
   - The app saves the audio file locally using **AsyncStorage** and **FileSystem** so you can access it later. The file path is saved for future use.

## Technologies Used

- **React Native**: To build the cross-platform app.
- **Expo AV**: For audio recording and playback.
- **Expo FileSystem**: To manage files on the local device storage.
- **AsyncStorage**: To persistently store audio file data.
- **React**: For the app's UI components and state management.

## API Permissions

The app requests permissions to access the device's microphone to record audio. The user will be prompted to allow or deny this permission when the app is first launched.

## Troubleshooting

- **Timer Not Showing**:  
  Ensure that the `isRecording` state is properly updated during the recording process. If the timer is not updating, try debugging the `useEffect` hook responsible for incrementing the timer.

- **Button Styles**:  
  You can adjust the button styles in the `styles` object to make the buttons more visible or to match the design of your app.

- **Audio Playback Issues**:  
  Make sure the audio file path is correct and the file exists at the specified location on the device.

## Future Improvements

- Implement a more sophisticated file management system (e.g., listing and deleting saved files).
- Add more features such as file renaming or sharing.
- Improve UI design and add animations.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Expo** for making development easy with React Native.
- **React Native Audio** and **Expo AV** for handling audio functionality.
