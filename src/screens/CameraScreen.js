import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet ,Alert } from 'react-native';
import { Camera , CameraView} from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';



// Define constants for permission status
const PERMISSION_STATUS = {
  LOADING: 'loading',
  GRANTED: 'granted',
  DENIED: 'denied',
};

export default function CameraScreen() {

  const [permission, setPermission] = useState(PERMISSION_STATUS.LOADING);

  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [isRecording, setIsRecording] = useState(false);
  const [mode, setMode] = useState('picture'); 

  useEffect(() => {
    (async () => {
     // const { status } = await Camera.requestCameraPermissionsAsync();
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      setPermission(cameraStatus === 'granted' && audioStatus === 'granted' ? PERMISSION_STATUS.GRANTED : PERMISSION_STATUS.DENIED);
    })();
  }, []);

  if (permission === null) {
    return <View />;
  }

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={async () => {
          const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
          const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
          setPermission(cameraStatus === 'granted' && audioStatus === 'granted' ? PERMISSION_STATUS.GRANTED : PERMISSION_STATUS.DENIED);}}>
          <Text style={styles.permissionButton}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(facing === 'back' ? 'front' : 'back');
  }

  function toggleFlash () {
    setFlash(flash === 'off' ? 'on' : 'off');
  };


  const switchMode = () => {
    setMode(mode === 'picture' ? 'picture' : 'video');
  };


  const handleCapture = async () => {
    if (mode === 'picture') {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Photo taken:', photo);
      }
    } else {
      if (cameraRef.current) {
        if (isRecording) {
          await cameraRef.current.stopRecording();
          setIsRecording(false);
        } else {
          const video = await cameraRef.current.recordAsync();
          console.log('Video recorded:', video);
          setIsRecording(true);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        flash={flash}
        ref={cameraRef}
      >
        <View style={styles.controlContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <Ionicons name={'on' ? "flash" : "flash-off"} size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={switchMode}>
            <Text style={styles.modeButtonText}>{mode === 'picture' ? 'Video' : 'Photo'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
          <View style={[styles.captureButtonInner, { backgroundColor: isRecording ? 'red' : 'white' }]} />
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
  },
  message: {
    color: 'white',
    fontSize: 18,
  },
  permissionButton: {
    color: 'blue',
    fontSize: 18,
  },
});
