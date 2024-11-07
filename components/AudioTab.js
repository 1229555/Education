import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AudioRecording() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [uri, setUri] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access microphone denied');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isRecording && timer > 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount or when recording stops
  }, [isRecording, timer]);

  // Start recording
  const startRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
      setTimer(0);
    } catch (error) {
      console.log('Failed to start recording:', error);
    }
  };

  // Stop recording and save URI
  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const audioUri = recording.getURI();
        console.log('Recording stopped, URI:', audioUri);
        setUri(audioUri);
        setIsRecording(false);
        setRecording(null);

        // Save recording URI to AsyncStorage
        await saveRecordingUri(audioUri);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  // Save the recording to persistent storage
  const saveRecordingUri = async (audioUri) => {
    try {
      const fileName = audioUri.split('/').pop();
      const filePath = FileSystem.documentDirectory + fileName;

      // Ensure the file exists at the expected location
      const fileExists = await FileSystem.getInfoAsync(audioUri);
      if (fileExists.exists) {
        // Move the file to a more permanent location if needed
        await FileSystem.moveAsync({
          from: audioUri,
          to: filePath,
        });

        console.log('File saved to:', filePath);

        // Save file path to AsyncStorage for later use
        const savedFiles = await AsyncStorage.getItem('files');
        let files = savedFiles ? JSON.parse(savedFiles) : [];
        files.push({ uri: filePath, date: new Date().toISOString(), type: 'audio' });
        await AsyncStorage.setItem('files', JSON.stringify(files));

        setUri(filePath); // Save the new URI
      } else {
        console.log('File does not exist at the URI:', audioUri);
      }
    } catch (error) {
      console.error('Failed to save audio file:', error);
    }
  };

  // Play audio
  const playAudio = async () => {
    try {
      if (uri) {
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (fileInfo.exists) {
          const { sound: soundObject } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: true }
          );
          setSound(soundObject);
          await soundObject.playAsync();
          setIsPlaying(true);
        } else {
          console.log('File does not exist at the provided URI:', uri);
        }
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  // Pause audio
  const pauseAudio = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Failed to pause audio:', error);
    }
  };

  // Stop audio
  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
        setSound(null);
      }
    } catch (error) {
      console.error('Failed to stop audio:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title={isRecording ? 'Stop Recording' : 'Start Recording'} onPress={isRecording ? stopRecording : startRecording} />
      {isRecording && <Text style={styles.timer}>Recording Time: {timer}s</Text>}
      {uri && !isRecording && (
        <View style={styles.audioControls}>
          <Text>Audio Recorded: {uri}</Text>
          {isPlaying ? (
            <View style={styles.controlsContainer}>
              <TouchableOpacity onPress={pauseAudio} style={styles.controlButton}>
                <Text>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={stopAudio} style={styles.controlButton}>
                <Text>Stop</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={playAudio} style={styles.controlButton}>
              <Text>Play</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  timer: { marginTop: 20, fontSize: 18, color: '#333', fontWeight: 'bold' },
  audioControls: { marginTop: 20, alignItems: 'center' },
  controlsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '60%', marginTop: 10 },
  controlButton: { padding: 12, backgroundColor: '#4CAF50', borderRadius: 5, margin: 5, color: 'white' },
  controlButtonText: { color: '#fff' },
});
