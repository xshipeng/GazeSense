#define _SCL_SECURE_NO_WARNINGS
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <iostream>
#include"process.h"
#include <string>
typedef websocketpp::server<websocketpp::config::asio> server;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;
// pull out the type of messages sent by our config
typedef server::message_ptr message_ptr;
volatile bool gazetracking = false;
volatile bool expression = false;
volatile bool need_calibration = true;
volatile bool changepage = false;
volatile bool teminateprocessing = false;
volatile bool freshmessage = false;
// ¼¸¸ö¿ØÖÆ¿ò
volatile bool showGaze = true;
volatile bool showimage = false;
volatile bool cursorcontrol = false;
volatile bool controlPage = false;

extern int ARR[2];

static DWORD WINAPI ProcessingThread(PVOID pParam){
	teminateprocessing = false;
	need_calibration = true;
	processing();
	return 0;
}

void on_message(server* s, websocketpp::connection_hdl hdl, message_ptr msg){
	std::string received = msg->get_payload();
	if (received == "query" && need_calibration == false){
		try{
			s->send(hdl, ARR, 2 * sizeof(int), websocketpp::frame::opcode::BINARY);
		}
		catch (const websocketpp::lib::error_code& e){
			std::cout << "Sending message failed because: " << e
				<< "(" << e.message() << ")" << std::endl;
		}
	}
	else if (received == "start"){
		CreateThread(nullptr, 0, ProcessingThread, nullptr, 0, nullptr);
		gazetracking = true;
	}
	else if (received == "stop"){
		teminateprocessing = true;
	}
	else if (received == "showGaze_on"){
		showGaze = true;
	}
	else if (received == "showGaze_off"){
		showGaze = false;
	}
	else if (received == "showImage_on"){
		showimage = true;
	}
	else if (received == "showImage_off"){
		showimage = false;
	}
	else if (received == "controlPage_on"){
		controlPage = true;
	}
	else if (received == "controlPage_off"){
		controlPage = false;
	}
	else if (received == "cursor_on") {
		cursorcontrol = true;
	}
	else if (received == "cursor_off") {
		cursorcontrol = false;
	}
	else if (received == "stop_listening"){
		s->stop_listening();
	}

}

int main(){
	// Create a server endpoint
	server echo_server;

	try{
		// Set logging settings
		echo_server.set_access_channels(websocketpp::log::alevel::all);
		echo_server.clear_access_channels(websocketpp::log::alevel::frame_payload);

		// Initialize Asio
		echo_server.init_asio();

		// Register our message handler
		echo_server.set_message_handler(bind(&on_message, &echo_server, _1, _2));

		// Listen on port 8181
		echo_server.listen(8181);

		// Start the server accept loop
		echo_server.start_accept();

		// Start the ASIO io_service run loop
		echo_server.run();
	}
	catch (websocketpp::exception const& e){
		std::cout << e.what() << std::endl;
	}
	catch (...){
		std::cout << "other exception" << std::endl;
	}
}
