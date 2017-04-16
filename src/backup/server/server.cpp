#define _SCL_SECURE_NO_WARNINGS
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <iostream>
#include"process.h"
typedef websocketpp::server<websocketpp::config::asio> server;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;
// pull out the type of messages sent by our config
typedef server::message_ptr message_ptr;
volatile bool gazetracking = false;
volatile bool expression = false;
volatile bool need_calibration = true;
volatile bool cursorcontrol = false;
volatile bool changepage = false;
volatile bool teminateprocessing = false;
volatile bool freshmessage = false;
// 几个控制框
volatile bool showGaze = false;
volatile bool showImage = false;
volatile bool controlPage = false;

extern int ARR[2];
static DWORD WINAPI ProcessingThread(PVOID pParam)
{
	teminateprocessing = false;
	need_calibration = true;
	processing();
	return 0;
}
void on_message(server* s, websocketpp::connection_hdl hdl, message_ptr msg) {
	//std::cout << "Receive:" << msg->get_payload() << std::endl;
	/* std::cout << "on_message called with hdl: " << hdl.lock().get()
	<< " and message: " << msg->get_payload()
	<< std::endl;*/

	// check for a special command to instruct the server to stop listening so
	// it can be cleanly exited.
  using namespace std;
  swtich(hash_(msg->get_payload()){
		case hash_compile_time("start"):		CreateThread(0, 0, ProcessingThread, NULL, 0, 0);gazetracking = true;break;
		case hash_compile_time("stop"):		teminateprocessing = true;break;
		case hash_compile_time("stop_listening"):		s->stop_listening();return;break;
		case hash_compile_time("showGaze_on"):		showGaze=true;break;
		case hash_compile_time("showGaze_off"):		showGaze=false;break;
		case hash_compile_time("showImage_on"):		showImage=true;break;
		case hash_compile_time("showImage_off"):		showImage=false;break;
		case hash_compile_time("controlPage_on"):		controlPage=true;break;
		case hash_compile_time("controlPage_off"):		controlPage=false;break;
	}

	// if (msg->get_payload() == "start") {
	// 	CreateThread(0, 0, ProcessingThread, NULL, 0, 0);
	// 	gazetracking = true;
	// }
	// else if (msg->get_payload() == "stop") {
	// 	teminateprocessing = true;
	// }
	// else if (msg->get_payload() == "stop_listening") {
	// 	s->stop_listening();
	// 	return;
	// }


	if(need_calibration == false)
	{
		//std::stringstream ss_x;
		//ss_x << eye_point_x;
		//std::stringstream ss_y;
		//ss_y << eye_point_y;
		//std::string sendmsg = ss_x.str() + "#" + ss_y.str();
		//std::cout << sendmsg << std::endl;
		try {
			s->send(hdl, ARR, 2 * sizeof(int), websocketpp::frame::opcode::BINARY);
			//s->send(hdl, msg->get_payload(), msg->get_opcode());
		}
		catch (const websocketpp::lib::error_code& e) {
			std::cout << "Sending message failed because: " << e
			<< "(" << e.message() << ")" << std::endl;
		}
	}
}

int main() {
	// Create a server endpoint
	server echo_server;

	try {
		// Set logging settings
		echo_server.set_access_channels(websocketpp::log::alevel::all);
		echo_server.clear_access_channels(websocketpp::log::alevel::frame_payload);

		// Initialize Asio
		echo_server.init_asio();

		// Register our message handler
		echo_server.set_message_handler(bind(&on_message, &echo_server, ::_1, ::_2));

		// Listen on port 8181
		echo_server.listen(8181);

		// Start the server accept loop
		echo_server.start_accept();

		// Start the ASIO io_service run loop
		echo_server.run();
	}
	catch (websocketpp::exception const & e) {
		std::cout << e.what() << std::endl;
	}
	catch (...) {
		std::cout << "other exception" << std::endl;
	}
}
