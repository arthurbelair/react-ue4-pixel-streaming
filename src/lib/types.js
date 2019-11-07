const ControlSchemeType = {
  // A mouse can lock inside the WebRTC player so the user can simply move the
  // mouse to control the orientation of the camera. The user presses the
  // Escape key to unlock the mouse.
  LockedMouse: 0,

  // A mouse can hover over the WebRTC player so the user needs to click and
  // drag to control the orientation of the camera.
  HoveringMouse: 1
};

// TODO: ここはsettings
// var inputOptions = {
// 	// The control scheme controls the behaviour of the mouse when it interacts
// 	// with the WebRTC player.
// 	controlScheme: ControlSchemeType.LockedMouse,

// 	// Browser keys are those which are typically used by the browser UI. We
// 	// usually want to suppress these to allow, for example, UE4 to show shader
// 	// complexity with the F5 key without the web page refreshing.
// 	suppressBrowserKeys: true,

// 	// UE4 has a faketouches option which fakes a single finger touch when the
// 	// user drags with their mouse. We may perform the reverse; a single finger
// 	// touch may be converted into a mouse drag UE4 side. This allows a
// 	// non-touch application to be controlled partially via a touch device.
// 	fakeMouseWithTouches: false
// };

// Must be kept in sync with PixelStreamingProtocol::EToUE4Msg C++ enum.
const MessageType = {
  /**********************************************************************/

  /*
   * Control Messages. Range = 0..49.
   */
  IFrameRequest: 0,
  RequestQualityControl: 1,
  MaxFpsRequest: 2,
  AverageBitrateRequest: 3,
  StartStreaming: 4,
  StopStreaming: 5,

  /**********************************************************************/

  /*
   * Input Messages. Range = 50..89.
   */

  // Generic Input Messages. Range = 50..59.
  UIInteraction: 50,
  Command: 51,

  // Keyboard Input Message. Range = 60..69.
  KeyDown: 60,
  KeyUp: 61,
  KeyPress: 62,

  // Mouse Input Messages. Range = 70..79.
  MouseEnter: 70,
  MouseLeave: 71,
  MouseDown: 72,
  MouseUp: 73,
  MouseMove: 74,
  MouseWheel: 75,

  // Touch Input Messages. Range = 80..89.
  TouchStart: 80,
  TouchEnd: 81,
  TouchMove: 82

  /**************************************************************************/
};

export { MessageType, ControlSchemeType };
