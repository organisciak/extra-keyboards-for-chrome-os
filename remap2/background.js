/*
Copyright 2018 The Extra Keyboards for Chrome OS Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var contextID = 0;
  
var lut = {
  "AltRight": {"code": "KeyV", "shift":"V", "plain":"v"}
};

chrome.input.ime.onFocus.addListener(
    function(context) {
      contextID = context.contextID;
    }
);

chrome.input.ime.onBlur.addListener(() => {
  contextID = 0;
})


// TODO: Add support for virtual keyboard input.

chrome.input.ime.onKeyEvent.addListener(
    function(engineID, keyData) {
      var handled = false;
      if (keyData.type == "keydown") {
        //console.log(keyData);
        if (lut[keyData.code]) {
          let shifted = (keyData.capsLock ^ keyData.shiftKey) ? "shift" : "plain";
          //let emit = lut[keyData.code][shifted];
          //let ctrl = keyData.ctrlKey;
          
          var remappedKeyData = keyData;
          
          // If remapping altright, remove event
          if (keyData.code == "AltRight") {
             remappedKeyData.altKey = false;
          }
          
          remappedKeyData.key = lut[keyData.code][shifted];
          remappedKeyData.code = lut[keyData.code].code;
        
        if (chrome.input.ime.sendKeyEvents != undefined) {
          chrome.input.ime.sendKeyEvents({"contextID": contextID, "keyData": [remappedKeyData]});
          handled = true;
          lastRemappedKeyEvent = remappedKeyData;
        } else if (keyData.type == "keydown" && !isPureModifier(keyData)) {
          chrome.input.ime.commitText({"contextID": contextID, "text": remappedKeyData.key});
          handled = true;
        }

        }
      }
      
      return handled;
});
