#include <Windows.h>
#include <WindowsX.h>
#include <commctrl.h>
#include <io.h>
#include <map>
#include "math.h"
#include "resource.h"
#include "pxcfacemodule.h"
#include "pxcfacedata.h"
#include "pxcvideomodule.h"
#include "pxcfaceconfiguration.h"
#include "pxcmetadata.h"
#include "service/pxcsessionservice.h"
#include <pxcsensemanager.h>  
#include <pxcsession.h>
#include <utilities\pxcsmoother.h>
#include "util_render.h" 
#include <iostream>
#include <stdio.h> 
#include <opencv2/opencv.hpp>  
#include "Strsafe.h"
#include <string.h>

#define OUT_OF_SCREEN 2000

extern int processing();