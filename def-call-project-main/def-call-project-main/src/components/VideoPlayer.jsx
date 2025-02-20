import React from 'react'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { SocketContext } from '../SocketContext'
import { useContext } from 'react'
import * as tf from '@tensorflow/tfjs'
import {drawRect} from "../utilities"
import {loadGraphModel} from '@tensorflow/tfjs-converter';
import { useEffect } from 'react'

tf.setBackend('webgl');

const VideoPlayer = () => {
  const {name,callAccepted,myVideo,userVideo,callEnded,stream,call,canvasRef}=useContext(SocketContext)

  const runCoco=async ()=>{
    // Loading the model from the model.json file
    const net =await loadGraphModel('https://def-call-server.onrender.com/model.json')
   
    setInterval(() => {
        detect(net) 

    }, 16.7);
}
const detect=async (net)=>{
    if(
        typeof userVideo.current!=="undefined" &&
        userVideo.current!==null &&
        userVideo.current.readyState===4
    ){
        const video=userVideo.current;
        
        
        const videoWidth=userVideo.current.videoWidth;
        const videoHeight=userVideo.current.videoHeight;
        
        userVideo.current.width=videoWidth
        userVideo.current.height=videoHeight

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

      
      // Making detections
        const img = tf.browser.fromPixels(video)
        const resized = tf.image.resizeBilinear(img, [640,480])
        const casted = resized.cast('int32')
        const expanded = casted.expandDims(0)
        const obj = await net.executeAsync(expanded)
      
        // Gettig the boxes, classes and scores from the model
        
        const boxes =  obj[5].arraySync()
        const classes =  obj[6].dataSync()
        const scores =  obj[0].arraySync()
        const ctx = canvasRef.current.getContext("2d");

        // Drawing the detections onto the canvas
        
        window.requestAnimationFrame(()=>{
            drawRect(boxes[0], classes, scores[0], 0.8, videoWidth, videoHeight,ctx)
          
        }
        ); 
       


        tf.dispose(img)
        tf.dispose(resized)
        tf.dispose(casted)
        tf.dispose(expanded)
        tf.dispose(obj)

    }
    
}

useEffect(
    ()=>{
        runCoco();
        
    },[]
)



  return (
    
    <Grid className='videoplayer'>
      {/* My Video */}

      {
        stream &&(
      <Paper className='paper1'>
        <Grid className='grid1'>
          <Typography variant='h5' gutterBottom>{name||'Name'}</Typography>
          <video playsInline muted ref={myVideo} autoPlay
          style={{
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }} />
          <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />

        </Grid>

      </Paper>

        )
      }
      {/* user video */}

      {
        callAccepted && !callEnded &&(

      <Paper className='paper1'>
        <Grid >
          <Typography variant='h5' gutterBottom>{call.name||'Name'}</Typography>
          <video playsInline ref={userVideo}  autoPlay
          style={{
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
            ,}}/>
          
        </Grid>

      </Paper>
        )
      }

    </Grid>
   
  )
}

export default VideoPlayer