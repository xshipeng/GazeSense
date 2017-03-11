# GazeSense
Gaze Point Analysis with Intel ReaSense SR300 Camera
## Introduction
![Project Introduction](http://omn6gkuiy.bkt.clouddn.com/Project_Introduction.png)
## How dose it work?
* Websocket Server is always running in the background and waiting for requests;
* When the user click the "start" button, the background.js send "start" message to Websocket Server. Then the Websocket Server start the camera to calibrate and gaze tracking.
* The background.js will send "query" message to the server every 10 ms, and the server will return the gaze data immediately. After getting the gaze data, the background.js will run code in the webpage to get the current scroll lane height. The scroll height will be pushed into the array which also stores the received gaze data[x,y]. Without clicking the "stop" button, this loop will not be ended.
* Due to the security limit of Google that the page cannot communicate with background.js directly, the content.js serves as a  transfer station between those two.
* When the user click the "stop" button, the background.js will send the "stop" message to the server to stop the tracking process of the camera.
* We will get an array whose element is also an three-element array. After calculating the relative position of the gaze data, the content.js will draw a heatmap on the current page based on the data collected before.
## Dependencies
* Operating System: Windows 10 64bit
* Runtime: Intel Realsense SDK
* Chrome platform version: 50+
## Extended the project
