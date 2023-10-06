import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import Canvas from 'react-native-canvas';

const ProcessingCanvasComponent = React.forwardRef(
  (
    props = {
      onTrackReady: () => console.log('processing track is ready'),
    },
    ref,
  ) => {
    const canvasRef = useRef();
    const videoRef = useRef();
    const [stream, setStream] = useState(null);
    const [originalStream, setOriginalStream] = useState(null);
    const [frameRate, setFrameRate] = useState(2);
    const [frameSize, setFrameSize] = useState({ width: 720, height: 480 });
    const [fillColor, setFillColor] = useState([255, 255, 255]);
    const [track, setTrack] = useState(null);

    useImperativeHandle(ref, () => ({
      setOriginalStream: newStream => setOriginalStream(newStream),
      setFrameRate: newFrameRate => setFrameRate(newFrameRate),
      setFrameSize: newFrameSize => setFrameSize(newFrameSize),
      getTrack: () => {
        return track;
      },
      getStream: () => {
        return stream;
      },
    }));

    useEffect(() => {
      console.log('PCC', 'soo', originalStream);
      if (originalStream) {
        console.log('PCC', 'doing canvas thingy');
        const canvas = canvasRef.current;
        const video = videoRef.current;
        video.srcObject = originalStream;

        const ctx = canvas.getContext('2d');

        const sendInterval = setInterval(() => {
          const originalWidth = video.videoWidth;
          const originalHeight = video.videoHeight;

          // Calculate the ratio to maintain the aspect ratio
          const widthRatio = frameSize.width / originalWidth;
          const heightRatio = frameSize.height / originalHeight;
          const ratio = Math.min(widthRatio, heightRatio);

          // Determine new dimensions and padding
          const newWidth = Math.round(originalWidth * ratio);
          const newHeight = Math.round(originalHeight * ratio);
          const padWidth = (frameSize.width - newWidth) / 2;
          const padHeight = (frameSize.height - newHeight) / 2;

          // Clear the canvas and draw the padding
          ctx.fillStyle = `rgb(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]})`;
          ctx.fillRect(0, 0, frameSize.width, frameSize.height);

          // Draw the resized image on top of the padding
          ctx.drawImage(video, padWidth, padHeight, newWidth, newHeight);

          // ctx.drawImage(video, 0, 0, frameSize.width, frameSize.height);
        }, 1000 / frameRate);

        const stream = canvas.captureStream(frameRate);
        const track = stream.getTracks()[0];

        setTrack(track);
        setStream(stream);

        if (props.onTrackReady) {
          console.log('PCC', 'calling on track ready');
          props.onTrackReady(track, stream);
        }

        return () => clearInterval(sendInterval);
      }
    }, [originalStream, frameRate, frameSize]);

    return (
      <>
        <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline />
        <canvas
          ref={canvasRef}
          width={frameSize.width}
          height={frameSize.height}
          style={{ display: 'none' }}
        />
      </>
    );
  },
);

export default ProcessingCanvasComponent;
