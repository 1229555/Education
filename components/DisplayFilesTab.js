import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import FileItem from './FileItem';  // New file item component
import FileView from './FileView';  // New file view component

export default function DisplayFilesTab({ navigation }) {
  const [files, setFiles] = useState([]);
  const [sound, setSound] = useState();
  const [selectedFile, setSelectedFile] = useState(null);  
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const storedFiles = await AsyncStorage.getItem('files');
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };

  const playAudio = async (uri) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(sound);
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setSound(null);
    }
  };

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setIsViewing(true);
  };

  const handleCloseView = () => {
    setIsViewing(false);
    setSelectedFile(null);
  };

  return (
    <View style={styles.container}>
      {isViewing ? (
        <FileView 
          file={selectedFile} 
          stopAudio={stopAudio} 
          playAudio={playAudio} 
          handleClose={handleCloseView}
          navigation={navigation}
        />
      ) : (
        <View style={styles.listContainer}>
          <Text style={styles.title}>Uploaded Files</Text>
          <ScrollView style={styles.fileList}>
            {files.length === 0 ? (
              <Text>No files uploaded yet.</Text>
            ) : (
              files.map((file, index) => (
                <FileItem 
                  key={index} 
                  file={file} 
                  handleViewFile={handleViewFile} 
                />
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  fileList: {
    marginTop: 20,
    flex: 1,
  },
});
