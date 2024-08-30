import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera , CameraView} from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';



// Define constants for permission status
const PERMISSION_STATUS = {
  LOADING: 'loading',
  GRANTED: 'granted',
  DENIED: 'denied',
};

export default function CameraScreen() {

  //const [permission, setPermission] = useState("");

  const [permission, setPermission] = useState(PERMISSION_STATUS.LOADING);

  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("status%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  ", typeof status)
      setPermission(status === 'granted' ? PERMISSION_STATUS.GRANTED : PERMISSION_STATUS.DENIED);
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
          const { status } = await Camera.requestCameraPermissionsAsync();
          console.log("status$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", typeof status)
          console.log("status$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", typeof flash)
          console.log("status$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ ", typeof facing)
          setPermission(status === 'granted' ? PERMISSION_STATUS.GRANTED : PERMISSION_STATUS.DENIED);}}>
          <Text style={styles.permissionButton}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(facing === 'back' ? 'front' : 'back');
  }

  async function takePicture() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo taken:', photo);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        type={facing === 'back' ? 'back' : 'front'}
        flashMode={flash === 'on' ? 'on' : 'off'}
        ref={cameraRef}
      >
        <View style={styles.controlContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
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
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },
});
