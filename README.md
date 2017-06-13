# GazeSense
Gaze Point Analysis with Intel RealSense SR300 Camera

## Introduction
![Project Introduction](http://omn6gkuiy.bkt.clouddn.com/Project%20Introduction%20%281%29.png)

## How dose it work?
* Websocket Server is always running in the background and waiting for requests;
* When the user click the "start" button, the background.js send "start" message to Websocket Server. Then the Websocket Server start the camera to calibrate and gaze tracking.
* The background.js will send "query" message to the server every 10 ms, and the server will return the gaze data immediately. After getting the gaze data, the background.js will run code in the webpage to get the current scroll lane height. The scroll height will be pushed into the array which also stores the received gaze data[x,y]. Without clicking the "stop" button, this loop will not be ended.
* Due to the security limit of Google that the page cannot communicate with background.js directly, the content.js serves as a  transfer station between those two.
* When the user click the "stop" button, the background.js will send the "stop" message to the server to stop the tracking process of the camera.
* We will get an array whose element is also an three-element array. After calculating the relative position of the gaze data, the content.js will draw a heatmap on the current page based on the data collected before.

## Dependencies(Mostly when compiling the C++ program)
* Operating System: Windows 10 64bit
* Runtime: Intel Realsense SDK
* Chrome platform version: 50+
* Lib Boost version: 1.62.0+
* Websocket++
* OpenCV 3.1.0

## Extend the project
* Since the User Interface is based on the Chrome Extension, changing the eye tracking device will be easier：the only thing you need to do is to combine the api of one particular device and use Websocket++ to establish the websocket server to transmit message with the chrome extension.
* The data structure between the server and client is as following:
1. Client to Server: 
* string"start"--Start tracking the gaze of user
* string"stop"--Stop tracking the gaze of user
2. Server to Client:
* arraybuffer[x,y]--The gaze data of user on screen
