// import { emitMouseDown, emitMouseUp, emitMouseWheel, emitMouseMove, sendInputData } from "./emitter";
import { MessageType } from "./types";
import emitter from "./emitter";
import { ControlSchemeType } from "./types";

var styleCursor;

export default function inputHelper(webRtcPlayerObj, settings) {
  const {
    emitMouseDown,
    emitMouseUp,
    emitMouseWheel,
    emitMouseMove,
    sendInputData
  } = emitter(webRtcPlayerObj, settings);

  // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
  const MouseButton = {
    MainButton: 0, // Left button.
    AuxiliaryButton: 1, // Wheel button.
    SecondaryButton: 2 // Right button.
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
  const MouseButtonsMask = {
    PrimaryButton: 1, // Left button.
    SecondaryButton: 2, // Right button.
    AuxiliaryButton: 4 // Wheel button.
  };

  // If the user has any mouse buttons pressed then release them.
  function releaseMouseButtons(buttons, x, y) {
    if (buttons & MouseButtonsMask.PrimaryButton) {
      emitMouseUp(MouseButton.MainButton, x, y);
    }
    if (buttons & MouseButtonsMask.SecondaryButton) {
      emitMouseUp(MouseButton.SecondaryButton, x, y);
    }
    if (buttons & MouseButtonsMask.AuxiliaryButton) {
      emitMouseUp(MouseButton.AuxiliaryButton, x, y);
    }
  }

  // If the user has any mouse buttons pressed then press them again.
  function pressMouseButtons(buttons, x, y) {
    if (buttons & MouseButtonsMask.PrimaryButton) {
      emitMouseDown(MouseButton.MainButton, x, y);
    }
    if (buttons & MouseButtonsMask.SecondaryButton) {
      emitMouseDown(MouseButton.SecondaryButton, x, y);
    }
    if (buttons & MouseButtonsMask.AuxiliaryButton) {
      emitMouseDown(MouseButton.AuxiliaryButton, x, y);
    }
  }

  // A locked mouse works by the user clicking in the browser player and the
  // cursor disappears and is locked. The user moves the cursor and the camera
  // moves, for example. The user presses escape to free the mouse.
  function registerLockedMouseEvents(playerElement) {
    var x = playerElement.width / 2;
    var y = playerElement.height / 2;

    playerElement.requestPointerLock =
      playerElement.requestPointerLock || playerElement.mozRequestPointerLock;
    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock;

    playerElement.onclick = function() {
      playerElement.requestPointerLock();
    };

    // Respond to lock state change events
    document.addEventListener("pointerlockchange", lockStateChange, false);
    document.addEventListener("mozpointerlockchange", lockStateChange, false);

    function lockStateChange() {
      if (
        document.pointerLockElement === playerElement ||
        document.mozPointerLockElement === playerElement
      ) {
        console.log("Pointer locked");
        document.addEventListener("mousemove", updatePosition, false);
      } else {
        console.log("The pointer lock status is now unlocked");
        document.removeEventListener("mousemove", updatePosition, false);
      }
    }

    function updatePosition(e) {
      x += e.movementX;
      y += e.movementY;
      if (x > styleWidth) {
        x -= styleWidth;
      }
      if (y > styleHeight) {
        y -= styleHeight;
      }
      if (x < 0) {
        x = styleWidth + x;
      }
      if (y < 0) {
        y = styleHeight - y;
      }
      emitMouseMove(x, y, e.movementX, e.movementY);
    }

    playerElement.onmousedown = function(e) {
      emitMouseDown(e.button, x, y);
    };

    playerElement.onmouseup = function(e) {
      emitMouseUp(e.button, x, y);
    };

    playerElement.onmousewheel = function(e) {
      emitMouseWheel(e.wheelDelta, x, y);
    };

    playerElement.pressMouseButtons = function(e) {
      pressMouseButtons(e.buttons, x, y);
    };

    playerElement.releaseMouseButtons = function(e) {
      releaseMouseButtons(e.buttons, x, y);
    };
  }

  // A hovering mouse works by the user clicking the mouse button when they want
  // the cursor to have an effect over the video. Otherwise the cursor just
  // passes over the browser.
  function registerHoveringMouseEvents(playerElement) {
    styleCursor = "none"; // We will rely on UE4 client's software cursor.

    playerElement.onmousemove = function(e) {
      emitMouseMove(e.offsetX, e.offsetY, e.movementX, e.movementY);
      e.preventDefault();
    };

    playerElement.onmousedown = function(e) {
      emitMouseDown(e.button, e.offsetX, e.offsetY);
      e.preventDefault();
    };

    playerElement.onmouseup = function(e) {
      emitMouseUp(e.button, e.offsetX, e.offsetY);
      e.preventDefault();
    };

    // When the context menu is shown then it is safest to release the button
    // which was pressed when the event happened. This will guarantee we will
    // get at least one mouse up corresponding to a mouse down event. Otherwise
    // the mouse can get stuck.
    // https://github.com/facebook/react/issues/5531
    playerElement.oncontextmenu = function(e) {
      emitMouseUp(e.button, e.offsetX, e.offsetY);
    };

    if ("onmousewheel" in playerElement) {
      playerElement.onmousewheel = function(e) {
        emitMouseWheel(e.wheelDelta, e.offsetX, e.offsetY);
        e.preventDefault();
      };
    } else {
      playerElement.addEventListener(
        "DOMMouseScroll",
        function(e) {
          emitMouseWheel(e.detail * -120, e.offsetX, e.offsetY);
          e.preventDefault();
        },
        false
      );
    }

    playerElement.pressMouseButtons = function(e) {
      pressMouseButtons(e.buttons, e.offsetX, e.offsetY);
    };

    playerElement.releaseMouseButtons = function(e) {
      releaseMouseButtons(e.buttons, e.offsetX, e.offsetY);
    };
  }

  function registerTouchEvents(playerElement, settings) {
    // We need to assign a unique identifier to each finger.
    // We do this by mapping each Touch object to the identifier.
    var fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    var fingerIds = {};

    function rememberTouch(touch) {
      let finger = fingers.pop();
      if (finger === undefined) {
        console.log("exhausted touch indentifiers");
      }
      fingerIds[touch.identifier] = finger;
    }

    function forgetTouch(touch) {
      fingers.push(fingerIds[touch.identifier]);
      delete fingerIds[touch.identifier];
    }

    function emitTouchData(type, touches) {
      let data = new DataView(new ArrayBuffer(2 + 6 * touches.length));
      data.setUint8(0, type);
      data.setUint8(1, touches.length);
      let byte = 2;
      for (let t = 0; t < touches.length; t++) {
        let touch = touches[t];
        let x = touch.clientX - playerElement.offsetLeft;
        let y = touch.clientY - playerElement.offsetTop;
        if (settings.print_inputs) {
          console.log(`F${fingerIds[touch.identifier]}=(${x}, ${y})`);
        }
        //        let coord = normalizeAndQuantizeUnsigned(x, y);
        let coord = { x, y };

        data.setUint16(byte, coord.x, true);
        byte += 2;
        data.setUint16(byte, coord.y, true);
        byte += 2;
        data.setUint8(byte, fingerIds[touch.identifier], true);
        byte += 1;
        data.setUint8(byte, 255 * touch.force, true); // force is between 0.0 and 1.0 so quantize into byte.
        byte += 1;
      }
      sendInputData(data.buffer);
    }

    if (settings.inputOptions.fakeMouseWithTouches) {
      var finger = undefined;

      playerElement.ontouchstart = function(e) {
        if (finger === undefined) {
          let firstTouch = e.changedTouches[0];
          finger = {
            id: firstTouch.identifier,
            x: firstTouch.clientX - playerElementClientRect.left,
            y: firstTouch.clientY - playerElementClientRect.top
          };
          // Hack: Mouse events require an enter and leave so we just
          // enter and leave manually with each touch as this event
          // is not fired with a touch device.
          playerElement.onmouseenter(e);
          emitMouseDown(MouseButton.MainButton, finger.x, finger.y);
        }
        e.preventDefault();
      };

      playerElement.ontouchend = function(e) {
        for (let t = 0; t < e.changedTouches.length; t++) {
          let touch = e.changedTouches[t];
          if (touch.identifier === finger.id) {
            let x = touch.clientX - playerElementClientRect.left;
            let y = touch.clientY - playerElementClientRect.top;
            emitMouseUp(MouseButton.MainButton, x, y);
            // Hack: Manual mouse leave event.
            playerElement.onmouseleave(e);
            finger = undefined;
            break;
          }
        }
        e.preventDefault();
      };

      playerElement.ontouchmove = function(e) {
        for (let t = 0; t < e.touches.length; t++) {
          let touch = e.touches[t];
          if (touch.identifier === finger.id) {
            let x = touch.clientX - playerElementClientRect.left;
            let y = touch.clientY - playerElementClientRect.top;
            emitMouseMove(x, y, x - finger.x, y - finger.y);
            finger.x = x;
            finger.y = y;
            break;
          }
        }
        e.preventDefault();
      };
    } else {
      playerElement.ontouchstart = function(e) {
        // Assign a unique identifier to each touch.
        for (let t = 0; t < e.changedTouches.length; t++) {
          rememberTouch(e.changedTouches[t]);
        }

        if (settings.print_inputs) {
          console.log("touch start");
        }
        emitTouchData(MessageType.TouchStart, e.changedTouches);
        e.preventDefault();
      };

      playerElement.ontouchend = function(e) {
        if (settings.print_inputs) {
          console.log("touch end");
        }
        emitTouchData(MessageType.TouchEnd, e.changedTouches);

        // Re-cycle unique identifiers previously assigned to each touch.
        for (let t = 0; t < e.changedTouches.length; t++) {
          forgetTouch(e.changedTouches[t]);
        }
        e.preventDefault();
      };

      playerElement.ontouchmove = function(e) {
        if (settings.print_inputs) {
          console.log("touch move");
        }
        emitTouchData(MessageType.TouchMove, e.touches);
        e.preventDefault();
      };
    }
  }

  function registerMouseEnterAndLeaveEvents(playerElement, settings) {
    playerElement.onmouseenter = function(e) {
      if (settings.print_inputs) {
        // console.log("mouse enter");
      }
      var Data = new DataView(new ArrayBuffer(1));
      Data.setUint8(0, MessageType.MouseEnter);
      sendInputData(Data.buffer);
      playerElement.pressMouseButtons(e);
    };

    playerElement.onmouseleave = function(e) {
      if (settings.print_inputs) {
        // console.log("mouse leave");
      }
      var Data = new DataView(new ArrayBuffer(1));
      Data.setUint8(0, MessageType.MouseLeave);
      sendInputData(Data.buffer);
      playerElement.releaseMouseButtons(e);
    };
  }

  // TODO: isyoku suru
  function registerInputs(playerElement, settings) {
    //TODO: キーボード設定
    registerKeyboardEvents(settings);

    //TODO: マウス設定
    switch (settings.inputOptions.controlScheme) {
      case ControlSchemeType.HoveringMouse:
        registerHoveringMouseEvents(playerElement);
        break;
      case ControlSchemeType.LockedMouse:
        registerLockedMouseEvents(playerElement);
        break;
      default:
        console.log(
          `ERROR: Unknown control scheme ${settings.inputOptions.controlScheme}`
        );
        registerLockedMouseEvents(playerElement);
        break;
    }

    registerMouseEnterAndLeaveEvents(playerElement, settings);
    registerTouchEvents(playerElement, settings);
  }

  // Browser keys do not have a charCode so we only need to test keyCode.
  function isKeyCodeBrowserKey(keyCode) {
    // Function keys or tab key.
    return (keyCode >= 112 && keyCode <= 123) || keyCode == 9;
  }

  // TODO: input migrate
  function registerKeyboardEvents(settings) {
    document.onkeydown = function(e) {
      if (settings.print_inputs) {
        console.log(`key down ${e.keyCode}, repeat = ${e.repeat}`);
      }
      sendInputData(
        new Uint8Array([MessageType.KeyDown, e.keyCode, e.repeat]).buffer
      );
      if (
        settings.inputOptions.suppressBrowserKeys // &&
        //        isKeyCodeBrowserKey(e.keyCode)
      ) {
        e.preventDefault();
      }
    };

    document.onkeyup = function(e) {
      if (settings.print_inputs) {
        console.log(`key up ${e.keyCode}`);
      }
      sendInputData(new Uint8Array([MessageType.KeyUp, e.keyCode]).buffer);
      if (
        settings.inputOptions.suppressBrowserKeys &&
        isKeyCodeBrowserKey(e.keyCode)
      ) {
        e.preventDefault();
      }
    };

    document.onkeypress = function(e) {
      if (settings.print_inputs) {
        console.log(`key press ${e.charCode}`);
      }
      let data = new DataView(new ArrayBuffer(3));
      data.setUint8(0, MessageType.KeyPress);
      data.setUint16(1, e.charCode, true);
      sendInputData(data.buffer);
    };
  }

  return { registerInputs };
}

//TODO: Quantizeの調査
// if (playerAspectRatio > videoAspectRatio) {
// 	if (print_inputs) {
// 		console.log('Setup Normalize and Quantize for playerAspectRatio > videoAspectRatio');
// 	}
// 	let ratio = playerAspectRatio / videoAspectRatio;
// 	// Unsigned.
// 	normalizeAndQuantizeUnsigned = (x, y) => {
// 		let normalizedX = x / playerElement.clientWidth;
// 		let normalizedY = ratio * (y / playerElement.clientHeight - 0.5) + 0.5;
// 		if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
// 			return {
// 				inRange: false,
// 				x: 65535,
// 				y: 65535
// 			};
// 		} else {
// 			return {
// 				inRange: true,
// 				x: normalizedX * 65536,
// 				y: normalizedY * 65536
// 			};
// 		}
// 	}
// 	// Signed.
// 	normalizeAndQuantizeSigned = (x, y) => {
// 		let normalizedX = x / (0.5 * playerElement.clientWidth);
// 		let normalizedY = (ratio * y) / (0.5 * playerElement.clientHeight);
// 		return {
// 			x: normalizedX * 32767,
// 			y: normalizedY * 32767
// 		};
// 	}
// } else {
// 	if (print_inputs) {
// 		console.log('Setup Normalize and Quantize for playerAspectRatio <= videoAspectRatio');
// 	}
// 	let ratio = videoAspectRatio / playerAspectRatio;
// 	normalizeAndQuantizeUnsigned = (x, y) => {
// 		// Unsigned.
// 		let normalizedX = ratio * (x / playerElement.clientWidth - 0.5) + 0.5;
// 		let normalizedY = y / playerElement.clientHeight;
// 		if (normalizedX < 0.0 || normalizedX > 1.0 || normalizedY < 0.0 || normalizedY > 1.0) {
// 			return {
// 				inRange: false,
// 				x: 65535,
// 				y: 65535
// 			};
// 		} else {
// 			return {
// 				inRange: true,
// 				x: normalizedX * 65536,
// 				y: normalizedY * 65536
// 			};
// 		}
// 	}
// 	normalizeAndQuantizeSigned = (x, y) => {
// 		// Signed.
// 		let normalizedX = (ratio * x) / (0.5 * playerElement.clientWidth);
// 		let normalizedY = y / (0.5 * playerElement.clientHeight);
// 		return {
// 			x: normalizedX * 32767,
// 			y: normalizedY * 32767
// 		};
// 	}
// }
