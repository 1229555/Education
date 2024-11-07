import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FileItem = ({ file, handleViewFile }) => {


  return (
    <View style={styles.fileItem}>
      <Text>{file?.name || file?.fileName}</Text>
      <Text>Type: {file.type}</Text>
      <Text>Date: {file.date}</Text>
      <TouchableOpacity
        onPress={() => handleViewFile(file)}
        style={styles.button}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fileItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FileItem;
