import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Video } from 'expo-av';

const FileView = ({ file, handleClose }) => {
  const [audioSound, setAudioSound] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const decodedUri = decodeURIComponent(file.uri);

  const fileExtension = file?.uri.split('.').pop().toLowerCase();
  const validAudioTypes = ['mp3', 'wav', 'm4a'];
  const validVideoTypes = ['mp4', 'mov', 'avi'];
  const validImageTypes = ['png', 'jpg', 'jpeg', 'gif'];

  useEffect(() => {
    const loadAudio = async () => {
      try {
        if (validAudioTypes.includes(fileExtension)) {
          const fileInfo = await FileSystem.getInfoAsync(decodedUri);
          if (fileInfo.exists) {
            const { sound } = await Audio.Sound.createAsync({
              uri: decodedUri,
            });
            setAudioSound(sound);
          } else {
            console.log('File does not exist at the provided URI:', decodedUri);
          }
        }
      } catch (error) {
        console.log('Error loading audio:', error);
      }
    };

    loadAudio();

    return () => {
      if (audioSound) {
        audioSound.unloadAsync();
      }
    };
  }, [file.uri]);

  const handlePlayAudio = async () => {
    if (audioSound) {
      try {
        await audioSound.playAsync();
        setIsAudioPlaying(true);
      } catch (error) {
        console.log('Error playing audio:', error);
      }
    }
  };

  const handlePauseAudio = async () => {
    if (audioSound) {
      try {
        await audioSound.pauseAsync();
        setIsAudioPlaying(false);
      } catch (error) {
        console.log('Error pausing audio:', error);
      }
    }
  };

  const handleStopAudio = async () => {
    if (audioSound) {
      try {
        await audioSound.stopAsync();
        setIsAudioPlaying(false);
      } catch (error) {
        console.log('Error stopping audio:', error);
      }
    }
  };

  const handleCloseFile = () => {
    if (audioSound) {
      audioSound.stopAsync();
    }
    handleClose();
  };

  if (validAudioTypes.includes(fileExtension)) {
    return (
      <View style={styles.selectedFileView}>
        <Text>{file.name}</Text>
        <Text>Type: {file.type}</Text>
        <Text>Date: {file.date}</Text>

        {!isAudioPlaying ? (
          <TouchableOpacity onPress={handlePlayAudio} style={styles.button}>
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={handlePauseAudio} style={styles.button}>
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleStopAudio} style={styles.button}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={handleCloseFile} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (validVideoTypes.includes(fileExtension)) {
    return (
      <View style={styles.selectedFileView}>
        <Text>{file.name}</Text>
        <Text>Type: {file.type}</Text>
        <Text>Date: {file.date}</Text>

        <Video
          source={{ uri: decodedUri }}
          shouldPlay
          resizeMode="contain" // Try 'contain', 'cover', or 'stretch' depending on the effect you want
          style={{ width: '100%', height: 300 }}
        />

        <TouchableOpacity onPress={handleCloseFile} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (validImageTypes.includes(fileExtension)) {
    return (
      <View style={styles.selectedFileView}>
        <Text>{file.name}</Text>
        <Text>Type: {file.type}</Text>
        <Text>Date: {file.date}</Text>

        <Image
          source={{ uri: decodedUri }}
          style={{ width: '100%', height: 300 }}
        />

        <TouchableOpacity onPress={handleCloseFile} style={styles.button}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.selectedFileView}>
      <Text>Unsupported file type</Text>
      <TouchableOpacity onPress={handleCloseFile} style={styles.button}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedFileView: {
    padding: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FileView;
