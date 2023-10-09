// @ts-nocheck
import { useFocusEffect } from '@react-navigation/native';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, ImageBackground, Dimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { Camera, CameraDevice, PhotoFile, useCameraDevices } from 'react-native-vision-camera';
import { RootNavigationProp } from '../AuthNav';
import config from '../config';
import { useAppDispatch, useAppSelector } from '../hooks';
import CircleProgressBar from '../modules/biometric-auth/CircleProgressBar';
import calculateCompletionPercentage from '../modules/biometric-auth/helpers/calculateTasksProgress';
import parseTurnServer from '../modules/biometric-auth/helpers/parseTurnServer';
import { useStore } from '../store';
// import { faceKIVerifyOnSignup, faceKIVerifyOnSignIn } from '../store/faceKI/faceKI.actions';
import { login } from '../store/signIn/signIn.actions';
import { authorize } from '../store/wallet/wallet.reducers';
import styles from './FaceKICameraView.styles';
import Loader from './Loader';
import RoundedButton from './RoundedButton';
// import ProcessingCanvasComponent from '../modules/biometric-auth/ProcessingCanvasComponent';

import { faceFrameAsset } from '../../assets/';

registerGlobals();

const WSSignalingServer = config.SIGNALIG_SERVER;
const IceServer = parseTurnServer();
console.log('ICE Turn Server', IceServer);
const polite = true; // Set whether this peer is the polite peer

interface Props {
  email: string;
  privateKey: string;
  task: 'verify' | 'register';
  token?: string;
  onComplete?: Function;
  onFailure?: Function;
}

// const takePhoto = async (camera: Camera) => {
//   if (Platform.OS === 'android') {
//     const capture: PhotoFile = await camera.takeSnapshot({
//       quality: 50,
//       skipMetadata: true,
//     });
//     if (capture) {
//       return capture;
//     }
//   }
//   return await camera.takePhoto({
//     qualityPrioritization: 'speed',
//     skipMetadata: true,
//   });
// };

const FaceKiCameraView = ({ email, privateKey, task, token, onComplete, onFailure }: Props) => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const auth = useStore(state => state.authorize);
  const [cameraDevice, setCameraDevice] = useState<CameraDevice | undefined>();
  const devices = useCameraDevices();
  const device =
    cameraDevice || devices.front || devices.back || devices.external || devices.unspecified;
  const [photo, setPhoto] = useState<PhotoFile | undefined>();
  const cameraRef = useRef<Camera>(null);
  const [progress, setProgress] = useState(0.0);
  // const [token, setToken] = useState('');
  // const [task, setTask] = useState('');
  const [makingOffer, setMakingOffer] = useState(false);
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStream, setCurrentStream] = useState('empty');
  const ws = useRef(null);
  const pc = useRef(null);
  const dc = useRef(null);
  // const hudUserGuidanceAlertRef = useRef();
  // const hudFacemagnetRef = useRef();

  // const processingCanvasComponentref = useRef(null);
  const emptyStreamRef = useRef(null);

  const { accountName: signUpAccountName } = useAppSelector(state => state.signUp);
  const { accountName: signInAccountName } = useAppSelector(state => state.signIn);
  const { idToken, appPubKey } = useAppSelector(state => state.web3);
  const isSigning = !!signInAccountName;
  const accountName = signInAccountName || signUpAccountName;

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  let jwtTokenRef = useRef(token);

  const checkAndAddDir = description => {
    return description;
  };

  const bindWSEvents = () => {
    console.log('bindWSEvents()');
    ws.current.onclose = event => console.log('WS Closed', event);
    ws.current.onerror = event => console.log('WS error', event);

    ws.current.onopen = event => {
      console.log('WS Opened', event);
      pc.current = new RTCPeerConnection({
        iceServers: IceServer,
        // iceTransportPolicy: 'relay',
        iceCandidatePoolSize: 10,
      });
      console.log('RTCPeerConnection created');
      // Get user media and add track to the connection
    };

    ws.current.onmessage = async event => {
      const msg = JSON.parse(event.data);

      if (msg.description) {
        const offerCollision =
          msg.description.type === 'offer' &&
          (makingOffer || (!polite && pc.current.signalingState !== 'stable'));

        setMakingOffer(false);

        if (offerCollision) {
          return;
        }

        const remoteOffer = new RTCSessionDescription(msg.description);
        await pc.current.setRemoteDescription(remoteOffer);

        if (msg.description.type === 'offer') {
          await pc.current.setLocalDescription();
          const message = JSON.stringify({
            description: checkAndAddDir(pc.current.localDescription),
            token: jwtTokenRef.current,
            task: task,
          });
          ws.current.send(message);
          console.log('Set Description: ', description);
        }
      } else if (msg.candidate) {
        try {
          if (String(msg.candidate.candidate).trim().length) {
            await pc.current.addIceCandidate(msg.candidate);
          }
        } catch (err) {
          if (!polite) {
            console.error(err);
          }
        }
      } else if (typeof msg.type !== 'undefined') {
        handleFASData(msg);
      }
    };
  };

  const handleFASData = msg => {
    console.log('handleFASData() msg:', msg);
    if (
      typeof msg.type !== 'undefined' &&
      ['success', 'error', 'info', 'warning'].indexOf(String(msg.type)) !== -1
    ) {
      Toast.show({
        type: msg.type.toLowerCase(),
        text1: msg.message,
      });
      if (
        msg.type === 'success' &&
        ['Verification successful!!', 'Registration successful!!!'].includes(msg.message)
      ) {
        console.log('Message: ', msg);
        Toast.show({
          type: 'success',
          text1: msg.message,
        });
        // hudUserGuidanceAlertRef.current.clear();
        onComplete(msg.token);
      } else if (
        (msg.type === 'error' && msg.message === 'Registration failure') ||
        (msg.type === 'warning' && msg.message === 'Liveliness check failed!!!')
      ) {
        // hudUserGuidanceAlertRef.current.clear();
        Toast.show({
          type: 'error',
          text1: msg.message,
        });
        onFailure();
      }
    } else if (typeof msg.type !== 'undefined' && msg.type === 'data') {
      console.log('log', msg);
      // hudUserGuidanceAlertRef.current.updateData(msg.message);

      if (cameraRef.current && cameraRef.current.video) {
        const video = cameraRef.current.video;
        if (video.videoWidth && video.videoHeight) {
          // hudFacemagnetRef.current.setOriginalWidth(video.videoWidth);
          // hudFacemagnetRef.current.setOriginalHeight(video.videoHeight);
        }
      }

      // hudFacemagnetRef.current.setData(msg.message);
      setLogs(prevLogs => [...prevLogs, { msg, timestamp: new Date() }]);
    }

    if (
      typeof msg.type !== 'undefined' &&
      msg.type === 'info' &&
      msg.message === 'Session completed!!!'
    ) {
      forceCleanUp();
      // hudUserGuidanceAlertRef.current.clear();
      setConnected(false);
    }
  };

  const openAndBindDCEvents = () => {
    console.log('openAndBindDCEvents()');
    dc.current = pc.current.createDataChannel('hotline', {
      ordered: false,
      maxPacketLifetime: 500,
    });

    dc.current.onclose = () => console.log('data channel closed');

    dc.current.onopen = () => console.log('data channel opened');

    dc.current.onmessage = function (event) {
      // console.log(evt.data);
      try {
        const msg = JSON.parse(event.data);
        console.log(JSON.stringify(msg));

        if (typeof msg.type !== 'undefined') {
          handleFASData(msg);
        }
      } catch (e) {
        console.error(e);
      }
    };
  };

  const bindRTCEvents = () => {
    console.log('bindRTCEvents()');
    pc.current.onsignalingstatechange = event => {
      console.log('Current signaling state', pc.current.signalingState);

      // if (pc.current.signalingState === "stable") {
      //     openAndBindDCEvents()
      // }
    };
    pc.current.onicegatheringstatechange = event =>
      console.log('Current icegathering state', pc.current.iceGatheringState);
    pc.current.oniceconnectionstatechange = event =>
      console.log('Current iceconnection state', pc.current.iceConnectionState);

    pc.current.onicecandidateerror = event => console.error('ICE candidate error', event);

    pc.current.onconnectionstatechange = event => {
      console.log('Current connection state', pc.current.connectionState);

      if (pc.current.connectionState === 'connected') {
        setLoading(false);
        // localVideoRef.current.srcObject = localTrackRef.current;
      }
    };

    pc.current.ontrack = event => {
      console.log('Track received', event);
      // if (remoteVideoRef.current.srcObject) {return;
      // remoteVideoRef.current = event.streams[0];
    };

    pc.current.onicecandidate = event => {
      if (event.candidate) {
        console.log('New local candidate', event.candidate);
        ws.current.send(JSON.stringify({ candidate: event.candidate }));
      }
    };

    pc.current.onnegotiationneeded = async () => {
      console.log('Negotiations needed!!!');
      try {
        if (!makingOffer) {
          setMakingOffer(true);
          await pc.current.setLocalDescription();
          ws.current.send(
            JSON.stringify({
              description: checkAndAddDir(pc.current.localDescription),
              token: jwtTokenRef.current,
              task: task,
            }),
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
  };

  const connect = async () => {
    console.log('Connect()');
    setLoading(true);
    try {
      ws.current = new WebSocket(WSSignalingServer);
      bindWSEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const addOrReplaceTrack = async (track, stream) => {
    console.log('addOrReplaceTrack()', track, 'pc: ', pc.current);
    const senders = pc.current.getSenders();

    const videoSender = senders.find(sender => sender.track && sender.track.kind === 'video');
    if (videoSender) {
      console.log('Replacing track!!!!', track.readyState);
      videoSender
        .replaceTrack(track)
        .then(r => {
          console.log('Track replaced');
        })
        .catch(e => console.log(e));
    } else {
      // If there was no previous video track to replace, just add the new one
      console.log('Adding track!!!!', track.readyState);
      pc.current.addTrack(track, stream);
    }
  };

  const stop = () => {
    console.log('stop()');
    setLoading(false);

    if (pc.current && emptyStreamRef.current) {
      console.log('stop: pc.current exists');
      sendMessageToServer({ type: 'msg', message: { fas: 'stop' } });
      let currentTrack = null;
      const currentSender = pc.current
        .getSenders()
        .find(sender => sender.track && sender.track.kind === 'video');
      if (currentSender) {
        currentTrack = currentSender.track;
      }

      if (shouldCloseCamera) {
        addOrReplaceTrack(emptyStreamRef.current.getTracks()[0], emptyStreamRef.current);
      }

      if (currentTrack) {
        // Close current webcam video track
        if (shouldCloseCamera) {
          currentTrack.stop();
        }
      }
    }
  };

  const start = () => {
    console.log('start()');
    setLoading(true);
    if (pc.current) {
      if (pc.current.connectionState === 'connected') {
        sendMessageToServer({
          type: 'msg',
          message: { fas: 'start', token: jwtTokenRef.current, task: task },
        });
      } else {
        pc.current.onconnectionstatechange = event => {
          console.log('Current connection state', pc.current.connectionState);

          if (pc.current.connectionState === 'connected') {
            sendMessageToServer({
              type: 'msg',
              message: { fas: 'start', token: jwtTokenRef.current, task: task },
            });
          }
        };
      }
    }
  };

  const sendMessageToServer = message => {
    console.log('sendMessageToServer()');
    message = JSON.stringify(message);
    if (dc.current && dc.current.readyState === 'open') {
      dc.current.send(message);
    } else if (ws.current) {
      ws.current.send(message);
    } else {
      console.log(`Couldn't send message, no channel open: ${message}`);
    }
  };

  function forceCleanUp() {
    console.log('forceCleanUp()');
    // disconnect();
    // message.info('Disconnected forcefully, Please reload!!!');
  }

  const toggleConnected = () => {
    console.log('toggleConnected()');
    setConnected(!connected);
  };

  const __load = () => {
    console.log('__load()');
    connect();

    setTimeout(() => {
      forceCleanUp();
    }, 30000); // 5 Mins
  };

  const __start = () => {
    console.log('__start()');

    if (!device) {
      Toast.show({
        type: 'error',
        text1: 'No camera selected/found',
      });
      return toggleConnected();
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Username required, Username should be at-least 3 char long',
      });
      return toggleConnected();
    }

    if (email.length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Invalid required, Username should be at-least 3 char long',
      });
      return toggleConnected();
    } else {
      jwtTokenRef.current = token;
      console.log('Token set', token);
      start();
    }
  };

  const __stop = () => {
    console.log('__stop()');
    stop();
  };

  const onProcessingTrackReady = (track, stream) => {
    console.log('onProcessingTrackReady');
    console.log('FASC', 'processing track is ready');
    addOrReplaceTrack(track, stream).then(() => {
      console.log('then addOrReplaceTrack');
      setCurrentStream('empty');

      const sender = pc.current.getSenders().find(s => s.track.kind === 'video');

      const parameters = sender.getParameters();

      if (!parameters.encodings) {
        parameters.encodings = [{}];
      }

      if (parameters.encodings && parameters.encodings.length > 0) {
        parameters.encodings[0].active = true;
        parameters.encodings[0].maxBitrate = 30000000; // e.g., 30 Mbps
        parameters.encodings[0].scaleResolutionDownBy = 1;
        parameters.encodings[0].priority = 'high';
      } else {
        console.warn('Encodings is not defined or empty.');
      }

      sender
        .setParameters(parameters)
        .then(success => console.log(success))
        .catch(err => console.log('Failed to set params'));

      openAndBindDCEvents();
      bindRTCEvents();
    });
  };

  const beginSession = mediaStream => {
    console.log('beginSession()');
    onProcessingTrackReady(mediaStream.getVideoTracks()[0], mediaStream.srcObject);
    // processingCanvasComponentref.current.setOriginalStream(emptyStreamRef.current);
    // hudBirateMonitorRef.current.setPc(pc.current);
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      Camera.getAvailableCameraDevices().then(availableDevices => {
        const frontDevices = availableDevices.filter(dev => dev.position === 'front');
        const wideAngleCamera = frontDevices.filter(dev =>
          dev.devices.includes('ultra-wide-angle-camera'),
        );
        setCameraDevice(wideAngleCamera[0]);
      });
    }
  }, []);

  useEffect(() => {
    __load();
  }, []);

  // useEffect(() => {
  //   if (connected) {
  //     console.log('useEffect if connected then __start()');
  //     __start();
  //   } else {
  //     console.log('useEffect if connected then __stop()');
  //     __stop();
  //   }
  // }, [connected]);
  //
  // useEffect(() => {
  //   console.log('useEffect if device changed');
  //   if (device) {
  //     setCurrentStream('altcam');
  //     // beginSession();
  //   }
  // }, [device]);
  //
  // useEffect(() => {
  //   console.log('useEffect on logs');
  //   const data = logs[logs.length - 1]?.msg;
  //   if (data && data?.type === 'data') {
  //     const tasks = data?.message;
  //     const _progress = calculateCompletionPercentage(tasks);
  //     console.log('SCORE: ', _progress);
  //     console.log('!!!!!!!!!!!!!!', tasks);
  //     setProgress(_progress);
  //   }
  // }, [logs]);

  // const loginHandler = () => {
  //   dispatch(login({ accountName, email, idToken, appPubKey }))
  //     .unwrap()
  //     .then(loginDetails => {
  //       console.log('Logged in successfully! loginDetails: ', loginDetails);
  //       dispatch(authorize({ accountName, email, token: loginDetails.token }));
  //       auth();
  //     })
  //     .catch(error => {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Something went wrong!',
  //         text2: 'Try to login again.',
  //       });
  //       console.error(error);
  //     });
  // };

  // const verifyHandler = async () => {
  //   if (cameraRef?.current) {
  //     const capture = await takePhoto(cameraRef.current);
  //     setPhoto(capture);
  //     try {
  //       const params = {
  //         image: capture.path,
  //         email,
  //         privateKey,
  //         accountName,
  //       };
  //       const actionVerify = isSigning ? faceKIVerifyOnSignIn : faceKIVerifyOnSignup;
  //       dispatch(actionVerify(params))
  //         .unwrap()
  //         .then(promiseResolvedValue => {
  //           if (promiseResolvedValue.status === 'error') {
  //             setPhoto(undefined);
  //             console.log('Photo has been removed!');
  //           } else {
  //             if (isSigning) {
  //               loginHandler();
  //             } else {
  //               nav.navigate('FaceKISuccess');
  //               setTimeout(() => setPhoto(undefined), 200);
  //             }
  //           }
  //         })
  //         .catch(promiseRejectedValue => {
  //           console.log('Something went wrong!', promiseRejectedValue);
  //           setPhoto(undefined);
  //           console.log('Photo has been removed!');
  //         });
  //     } catch (err) {
  //       console.error('!ERROR: ', err);
  //     }
  //   } else {
  //     console.warn('Camera is not available');
  //   }
  // };

  if (device == null) {
    return <Text>Camera is not ready. Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {!photo && (
        <>
          <Camera
            style={styles.camera}
            ref={cameraRef}
            device={device}
            isActive={true}
            photo={true}
            preset={Platform.OS === 'android' ? 'medium' : 'high'}
            onInitialized={() => {
              console.log('On initialized');

              mediaDevices.getUserMedia({ video: true, audio: false }).then(mediaStream => {
                (async () => {
                  console.log('On user media initialized');
                  if (mediaStream) {
                    let videoTrack = await mediaStream.getVideoTracks()[0];

                    console.log('Video Constraints:', videoTrack._constraints);
                    console.log('Current Video Settings:', videoTrack._settings);

                    emptyStreamRef.current = mediaStream;

                    // hudFacemagnetRef.current.setCanvasWidth(getCanvasWidth());
                    // hudFacemagnetRef.current.setCanvasHeight(getCanvasHeight());

                    if (
                      typeof ws.current.readyState !== 'undefined' &&
                      ws.current.readyState === 1
                    ) {
                      console.log('case ws.current.readyState === 1');
                      beginSession(mediaStream);
                    } else {
                      ws.current.onopen = () => {
                        console.log('case ws.current.readyState !== 1');
                        beginSession(mediaStream);
                      };
                    }

                    // ---------------------------------------------------------
                    // let peerConstraints = {
                    //   iceServers: IceServer,
                    //   iceCandidatePoolSize: 10,
                    // };
                    //
                    // let peerConnection = new RTCPeerConnection(peerConstraints);
                    //
                    // peerConnection.addEventListener('connectionstatechange', event => {
                    //   switch (peerConnection.connectionState) {
                    //     case 'closed':
                    //       // You can handle the call being disconnected here.
                    //
                    //       break;
                    //   }
                    // });
                    //
                    // peerConnection.addEventListener('icecandidate', event => {
                    //   // When you find a null candidate then there are no more candidates.
                    //   // Gathering of candidates has finished.
                    //   if (!event.candidate) {
                    //     return;
                    //   }
                    //
                    //   // Send the event.candidate onto the person you're calling.
                    //   // Keeping to Trickle ICE Standards, you should send the candidates immediately.
                    // });
                    //
                    // peerConnection.addEventListener('icecandidateerror', event => {
                    //   // You can ignore some candidate errors.
                    //   // Connections can still be made even when errors occur.
                    // });
                    //
                    // peerConnection.addEventListener('iceconnectionstatechange', event => {
                    //   switch (peerConnection.iceConnectionState) {
                    //     case 'connected':
                    //     case 'completed':
                    //       // You can handle the call being connected here.
                    //       // Like setting the video streams to visible.
                    //
                    //       break;
                    //   }
                    // });
                    //
                    // peerConnection.addEventListener('negotiationneeded', event => {
                    //   // You can start the offer stages here.
                    //   // Be careful as this event can be called multiple times.
                    // });
                    //
                    // peerConnection.addEventListener('signalingstatechange', event => {
                    //   switch (peerConnection.signalingState) {
                    //     case 'closed':
                    //       // You can handle the call being disconnected here.
                    //
                    //       break;
                    //   }
                    // });
                    //
                    // peerConnection.addEventListener('track', event => {
                    //   // Grab the remote track from the connected participant.
                    //   remoteMediaStream = remoteMediaStream || new MediaStream();
                    //   remoteMediaStream.addTrack(event.track, remoteMediaStream);
                    // });
                    //
                    // // Add our stream to the peer connection.
                    // localMediaStream
                    //   .getTracks()
                    //   .forEach(track => peerConnection.addTrack(track, localMediaStream));
                    // ---------------------------------------------------------
                  }
                })();
              });
            }}
          />
          {/*<CircleProgressBar*/}
          {/*  width={screenWidth}*/}
          {/*  height={screenHeight}*/}
          {/*  style={{ width: '100%', height: '100%' }}*/}
          {/*/>*/}
          <ImageBackground source={faceFrameAsset} resizeMode="cover" style={styles.faceFrame} />
          <View style={{ position: 'absolute', top: 20 }}>
            <Text style={{ color: '#fff', fontSize: 22, textAlign: 'center', lineHeight: 30 }}>
              Bio-Metric 2 Factor Authentication
            </Text>
            <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', lineHeight: 30 }}>
              Position your face in the oval
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              bottom: 0,
            }}
          >
            <Text
              style={{
                color: '#FFC000',
                fontSize: 14,
                textAlign: 'center',
                lineHeight: 22,
                paddingBottom: 20,
              }}
            >
              Please authenticate your biometrics to complete {isSigning ? 'log in.' : 'sign up.'}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <RoundedButton styles={{ flex: 1 }} title="Cancel" onPress={() => nav.goBack()} />
              <RoundedButton
                styles={{ flex: 1, textTransform: 'capitalize' }}
                title={task}
                onPress={toggleConnected}
                // disabled={!!photo}
              />
            </View>
          </View>
        </>
      )}
      {photo && <Loader />}
    </View>
  );
};

export default FaceKiCameraView;
