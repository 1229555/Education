import React, { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign'; // Upload icon

export default function AddFilesTab({ navigation }) {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Store list of uploaded files

  // Load files from AsyncStorage when the component mounts
  useEffect(() => {
    loadFiles();
  }, []);

  // Pick a file using DocumentPicker
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'video/*'],
      });

      if (result.type === 'cancel') return;

      const fileMetadata = {
        id: new Date().getTime().toString(),
        name: result.assets[0].name,
        uri: result.assets[0].uri,
        type: result.assets[0].mimeType,
        date: new Date().toLocaleString(),
      };

      setFile(fileMetadata); // Update state to show file details
      await saveFile(fileMetadata); // Save file to AsyncStorage
      Alert.alert('File uploaded successfully!');
      loadFiles(); // Reload files after upload
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to upload file.');
    }
  };

  // Save file metadata to AsyncStorage
  const saveFile = async (fileMetadata) => {
    try {
      const storedFiles = await AsyncStorage.getItem('files');
      const updatedFiles = storedFiles ? JSON.parse(storedFiles) : [];
      updatedFiles.push(fileMetadata);
      await AsyncStorage.setItem('files', JSON.stringify(updatedFiles));

      console.log('File saved:', fileMetadata); // Debug: Check saved file
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  // Load uploaded files from AsyncStorage
  const loadFiles = async () => {
    try {
      const storedFiles = await AsyncStorage.getItem('files');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        console.log('Loaded files:', parsedFiles); // Debug: Check loaded files
        setUploadedFiles(parsedFiles); // Update state with loaded files
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Files</Text>

      {/* Upload Button */}
      <View style={styles.buttonContainer}>
        <Button title="Upload File" onPress={pickFile} color="#4CAF50" />
        <Icon name="upload" size={30} color="#4CAF50" onPress={pickFile} style={styles.icon} />
      </View>

      {file && (
        <View style={styles.fileInfoContainer}>
          <Text style={styles.fileText}>Uploaded File:</Text>
          <Text style={styles.fileText}>Name: {file.name}</Text>
          <Text style={styles.fileText}>Type: {file.type}</Text>
        </View>
      )}

      <Text style={styles.filesListHeader}>Uploaded Files:</Text>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.filesList}>
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, index) => (
            <View key={index} style={styles.fileItem}>
              <Text style={styles.fileItemText}>Name: {file.name}</Text>
              <Text style={styles.fileItemText}>Type: {file.type}</Text>
              <Text style={styles.fileItemText}>Date: {file.date}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.fileItemText}>No files uploaded yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 10,
  },
  fileInfoContainer: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  fileText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  filesListHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  filesList: {
    paddingBottom: 20,
  },
  fileItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileItemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
});
