#include "process.h"
#include <Windows.h>
#include <WindowsX.h>
#include <iostream>

#pragma comment( linker, "/subsystem:\"console\" /entry:\"WinMainCRTStartup\"")//显示console控制台
#define WIDTH 1920
#define HEIGHT 1080  
using namespace std;
HINSTANCE g_hInst = NULL;
volatile bool gazetracking = false;
volatile bool expression = false;
volatile bool showimage = false;
volatile bool need_calibration = true;
volatile bool cursorcontrol = false;
volatile bool changepage = false;
volatile bool teminateprocessing = false;

static DWORD WINAPI ProcessingThread(PVOID pParam)
{
	processing();
	return 0;
}
LRESULT CALLBACK MainWndProc(
	HWND hWnd,
	UINT nMsg,
	WPARAM wParam,
	LPARAM lParam
)
{
	int wmId, wmEvent;
	static HFONT hFont;
	static TCHAR szTextBuf[20];  //static 控件文本（缓冲区）
	static HWND  hStatic; //必须在执行之前分配 窗口过程中定义的变量应为static 否则会被中途销毁
	static HWND  StartCalib;//重新校准按钮
	static HWND  Save;//保存按钮
	static HWND  GroupBasicFunc;//分组框
	static HWND  GroupAdvanceFunc;//分组框
	static HWND  EyeTracking;//眼动追踪复选框
	static HWND  Expression;//表情复选框
	static HWND  ShowImage;//显示图像复选框
	static HWND  CursorControl;//控制鼠标复选框
	static HWND  ChangePage;//翻页复选框

	switch (nMsg)//判断消息ID
	{
	case  WM_CREATE:
		hFont = CreateFont(//设置字体
			-14, -7, 0, 0, 400,
			FALSE, FALSE, FALSE, DEFAULT_CHARSET,
			OUT_CHARACTER_PRECIS, CLIP_CHARACTER_PRECIS, DEFAULT_QUALITY,
			FF_DONTCARE, TEXT("微软雅黑")
		);

		hStatic = CreateWindow(
			L"static", //静态文本框的类名
			L"欢迎使用",  //控件的文本
			WS_CHILD /*子窗口*/ | WS_VISIBLE /*创建时显示*/ | SS_CENTER /*水平居中*/ | SS_CENTERIMAGE /*垂直居中*/,
			30 /*X坐标*/, 20 /*Y坐标*/, 240 /*宽度*/, 25 /*高度*/,
			hWnd,  //父窗口句柄
			(HMENU)1,  //为控件指定一个唯一标识符
			g_hInst,  //当前程序实例句柄
			NULL
		);
		//基本功能--复选框
		GroupBasicFunc = CreateWindow(
			TEXT("button"), TEXT("基本功能"),
			WS_CHILD | WS_VISIBLE | BS_GROUPBOX,
			30, 50, 240, 150,
			hWnd, (HMENU)2, g_hInst, NULL
		);
		EyeTracking = CreateWindow(
			TEXT("button"), TEXT("眼动追踪"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 80, 150, 26,
			hWnd/*父窗口控件*/, (HMENU)3, g_hInst, NULL
		);
		Expression = CreateWindow(
			TEXT("button"), TEXT("表情识别"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 110, 150, 26,
			hWnd /*父窗口控件*/, (HMENU)4, g_hInst, NULL
		);
		ShowImage = CreateWindow(
			TEXT("button"), TEXT("显示图像"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 140, 150, 26,
			hWnd /*父窗口控件*/, (HMENU)5, g_hInst, NULL
		);
		//扩展功能--复选框
		GroupAdvanceFunc = CreateWindow(
			TEXT("button"), TEXT("扩展功能"),
			WS_CHILD | WS_VISIBLE | BS_GROUPBOX,
			30, 220, 240, 100,
			hWnd, (HMENU)6, g_hInst, NULL
		);
		CursorControl = CreateWindow(
			TEXT("button"), TEXT("控制鼠标"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 250, 120, 26,
			hWnd, (HMENU)7, g_hInst, NULL
		);
		ChangePage = CreateWindow(
			TEXT("button"), TEXT("左右翻页"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 280, 120, 26,
			hWnd, (HMENU)8, g_hInst, NULL
		);
		//按钮
		StartCalib = CreateWindow(
			TEXT("button"), //按钮控件的类名
			TEXT("停止进程"),
			WS_CHILD | WS_VISIBLE | WS_BORDER | BS_FLAT/*扁平样式*/,
			50 /*X坐标*/, 400 /*Y坐标*/, 100 /*宽度*/, 25/*高度*/,
			hWnd, (HMENU)9 /*控件唯一标识符*/, g_hInst, NULL
		);
		Save = CreateWindow(
			TEXT("button"), //按钮控件的类名
			TEXT("启动进程"),
			WS_CHILD | WS_VISIBLE | WS_BORDER | BS_FLAT/*扁平样式*/,
			150 /*X坐标*/, 400 /*Y坐标*/, 100 /*宽度*/, 25/*高度*/,
			hWnd, (HMENU)10 /*控件唯一标识符*/, g_hInst, NULL
		);
		SendMessage(StartCalib, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(Save, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(hStatic, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(GroupBasicFunc, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(GroupAdvanceFunc, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(EyeTracking, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(Expression, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(ShowImage, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(CursorControl, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(ChangePage, WM_SETFONT, (WPARAM)hFont, NULL);
		break;
	case WM_DESTROY: //窗口销毁的消息
		PostQuitMessage(0); //发送退出消息
		break;
	case WM_COMMAND:
		wmId = LOWORD(wParam);
		wmEvent = HIWORD(wParam);
		if (wmEvent == BN_CLICKED)
		{
			switch (wmId)
			{
			case 3:
			case 4:
			case 5:
			case 7:
			case 8:
				if (SendMessage(EyeTracking, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					gazetracking = true;
				}
				else if (SendMessage(EyeTracking, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					gazetracking = false;
				if (SendMessage(Expression, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					expression = true;
				}
				else if (SendMessage(Expression, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					expression = false;
				if (SendMessage(ShowImage, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					showimage = true;
				}
				else if (SendMessage(ShowImage, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					showimage = false;
				if (SendMessage(CursorControl, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					cursorcontrol = true;
				}
				else if (SendMessage(CursorControl, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					cursorcontrol = false;
				if (SendMessage(ChangePage, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					changepage = true;
				}
				else if (SendMessage(ChangePage, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					changepage = false;
				break;
			case 9:  //按下按钮
					 //更改文本框的内容
					 //SetWindowText(hStatic, TEXT("你点击了校准按钮"));
				teminateprocessing = true;
				break;
			case 10:  //按下按钮
					  //更改文本框的内容
				cout << "启动进程" << endl;
				teminateprocessing = false;
				need_calibration = true;
				CreateThread(0, 0, ProcessingThread, g_hInst, 0, 0);
				//SetWindowText(hStatic, TEXT("你点击了更新按钮"));
				break;
			default:
				//不处理的消息一定要交给 DefWindowProc 处理。
				return DefWindowProc(hWnd, nMsg, wParam, lParam);
			}
			break;
		}
	}
	//调用缺省的消息处理程序
	return DefWindowProc(hWnd, nMsg, wParam, lParam);
}
BOOL MyRegister(LPCWSTR pszClassName)
{
	WNDCLASS wc = { 0 };
	ATOM  nAtom = 0;
	//构造注册窗口的参数
	wc.style = CS_VREDRAW | CS_HREDRAW; //窗口风格
	wc.lpfnWndProc = MainWndProc;//窗口过程
	wc.cbClsExtra = 0;
	wc.cbWndExtra = 0;
	wc.hInstance = g_hInst;//当前窗口句柄
	wc.hIcon = NULL;//窗口图标
	wc.hCursor = NULL;//鼠标样式
	wc.hbrBackground = (HBRUSH)GetSysColorBrush(COLOR_BTNFACE);//窗口背景画刷
	wc.lpszMenuName = NULL;//窗口菜单
	wc.lpszClassName = pszClassName;//窗口类名
									//注册窗口
	nAtom = RegisterClass(&wc);
	/*if (0 == nAtom)
	{
	MessageBox(NULL, L"Register Failed",
	L"Error", MB_OK | MB_ICONWARNING);
	return FALSE;
	}
	else
	{
	MessageBox(NULL, L"Register Successed",
	L"Successed", MB_OK);
	}*/
	return TRUE;
}



// 显示窗口
void DisplayWnd(HWND hWnd)
{
	//显示
	ShowWindow(hWnd, SW_SHOW);
	//刷新
	UpdateWindow(hWnd);
}

HWND MyCreate(LPCWSTR pszClassName)
{
	HWND hWnd = CreateWindow(
		pszClassName,
		L"Intel",
		WS_OVERLAPPEDWINDOW,
		100,
		100,
		300,
		500,
		NULL,
		NULL,
		g_hInst,
		NULL
	);
	/*if (NULL == hWnd)
	{
	MessageBox(NULL, L"CreateWnd Failed",
	L"Error", MB_OK);
	return NULL;
	}
	MessageBox(NULL, L"CreateWnd Successed",
	L"Successed", MB_OK);*/
	return hWnd;
}



int WINAPI WinMain(
	HINSTANCE hInst,
	HINSTANCE hPrevInst,
	LPSTR pszCmdLine,
	int   nShowCmd)
{
	HWND hWnd = NULL;
	g_hInst = hInst;
	//注册窗口类型
	MyRegister(L"MyWnd");
	//创建注册类型的窗口
	hWnd = MyCreate(L"MyWnd");
	//显示窗口
	DisplayWnd(hWnd);
	MSG msg = { 0 };
	//消息循环处理,获取消息
	while (GetMessage(&msg, NULL, 0, 0))
	{
		TranslateMessage(&msg);
		//派发消息
		DispatchMessage(&msg);
	}
	return 0;
}

