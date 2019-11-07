import { MessageType } from "./types";

// TODO: coordのNormalizeなんとかする

export default function emitter(webRtcPlayerObj, settings) {
  const normalizeAndQuantizeUnsigned = (webRtcPlayerObj => {
    const playerElement = webRtcPlayerObj.video;
    const videoElement = webRtcPlayerObj.video;

    return function(x, y) {
      let playerAspectRatio =
        playerElement.clientHeight / playerElement.clientWidth;
      let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;

      let ratio = playerAspectRatio / videoAspectRatio;
      // Unsigned.
      let normalizedX = x / playerElement.clientWidth;
      let normalizedY = ratio * (y / playerElement.clientHeight - 0.5) + 0.5;
      if (
        normalizedX < 0.0 ||
        normalizedX > 1.0 ||
        normalizedY < 0.0 ||
        normalizedY > 1.0
      ) {
        return {
          inRange: false,
          x: 65535,
          y: 65535
        };
      } else {
        return {
          inRange: true,
          x: normalizedX * 65536,
          y: normalizedY * 65536
        };
      }
    };
  })(webRtcPlayerObj);

  const normalizeAndQuantizeSigned = (webRtcPlayerObj => {
    const playerElement = webRtcPlayerObj.video;
    const videoElement = webRtcPlayerObj.video;

    return function(x, y) {
      let playerAspectRatio =
        playerElement.clientHeight / playerElement.clientWidth;
      let videoAspectRatio = videoElement.videoHeight / videoElement.videoWidth;

      let ratio = playerAspectRatio / videoAspectRatio;
      let normalizedX = x / (0.5 * playerElement.clientWidth);
      let normalizedY = (ratio * y) / (0.5 * playerElement.clientHeight);
      return {
        x: normalizedX * 32767,
        y: normalizedY * 32767
      };
    };
  })(webRtcPlayerObj);

  // A generic message has a type and a descriptor.
  function emitDescriptor(messageType, descriptor) {
    // Convert the dscriptor object into a JSON string.
    let descriptorAsString = JSON.stringify(descriptor);

    // Add the UTF-16 JSON string to the array byte buffer, going two bytes at
    // a time.
    let data = new DataView(
      new ArrayBuffer(1 + 2 + 2 * descriptorAsString.length)
    );
    let byteIdx = 0;
    data.setUint8(byteIdx, messageType);
    byteIdx++;
    data.setUint16(byteIdx, descriptorAsString.length, true);
    byteIdx += 2;
    for (var i = 0; i < descriptorAsString.length; i++) {
      data.setUint16(byteIdx, descriptorAsString.charCodeAt(i), true);
      byteIdx += 2;
    }
    sendInputData(data.buffer);
  }

  // A UI interation will occur when the user presses a button powered by
  // JavaScript as opposed to pressing a button which is part of the pixel
  // streamed UI from the UE4 client.
  function emitUIInteraction(descriptor) {
    emitDescriptor(MessageType.UIInteraction, descriptor);
  }

  // A build-in command can be sent to UE4 client. The commands are defined by a
  // JSON descriptor and will be executed automatically.
  // The currently supported commands are:
  //
  // 1. A command to run any console command:
  //    "{ ConsoleCommand: <string> }"
  //
  // 2. A command to change the resolution to the given width and height.
  //    "{ Resolution: { Width: <value>, Height: <value> } }"
  //
  // 3. A command to change the encoder settings by reducing the bitrate by the
  //    given percentage.
  //    "{ Encoder: { BitrateReduction: <value> } }"
  function emitCommand(descriptor) {
    emitDescriptor(MessageType.Command, descriptor);
  }

  function emitMouseMove(x, y, deltaX, deltaY) {
    if (settings.print_inputs) {
      console.log(`x: ${x}, y:${y}, dX: ${deltaX}, dY: ${deltaY}`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    //let coord = {x,y};
    let delta = normalizeAndQuantizeSigned(deltaX, deltaY);
    //let delta = {deltaX, deltaY};
    var Data = new DataView(new ArrayBuffer(9));
    Data.setUint8(0, MessageType.MouseMove);
    Data.setUint16(1, coord.x, true);
    Data.setUint16(3, coord.y, true);
    Data.setInt16(5, delta.x, true);
    Data.setInt16(7, delta.y, true);
    sendInputData(Data.buffer);
  }

  function emitMouseDown(button, x, y) {
    if (settings.print_inputs) {
      console.log(`mouse button ${button} down at (${x}, ${y})`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    // let coord = {x,y};
    var Data = new DataView(new ArrayBuffer(6));
    Data.setUint8(0, MessageType.MouseDown);
    Data.setUint8(1, button);
    Data.setUint16(2, coord.x, true);
    Data.setUint16(4, coord.y, true);
    sendInputData(Data.buffer);
  }

  function emitMouseUp(button, x, y) {
    if (settings.print_inputs) {
      console.log(`mouse button ${button} up at (${x}, ${y})`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    // let coord = {x,y}
    var Data = new DataView(new ArrayBuffer(6));
    Data.setUint8(0, MessageType.MouseUp);
    Data.setUint8(1, button);
    Data.setUint16(2, coord.x, true);
    Data.setUint16(4, coord.y, true);
    sendInputData(Data.buffer);
  }

  function emitMouseWheel(delta, x, y) {
    if (settings.print_inputs) {
      console.log(`mouse wheel with delta ${delta} at (${x}, ${y})`);
    }
    let coord = normalizeAndQuantizeUnsigned(x, y);
    // let coord = {x,y};
    var Data = new DataView(new ArrayBuffer(7));
    Data.setUint8(0, MessageType.MouseWheel);
    Data.setInt16(1, delta, true);
    Data.setUint16(3, coord.x, true);
    Data.setUint16(5, coord.y, true);
    sendInputData(Data.buffer);
  }

  function sendInputData(data) {
    if (webRtcPlayerObj) webRtcPlayerObj.send(data);
  }

  return {
    emitMouseDown,
    emitMouseUp,
    emitMouseMove,
    emitMouseWheel,
    sendInputData,
    emitUIInteraction,
    emitCommand,
    emitDescriptor
  };
}
