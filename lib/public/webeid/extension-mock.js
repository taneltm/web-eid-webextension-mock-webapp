/*
 * Copyright (c) 2020 The Web eID Project
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
  Action,
  ErrorCode,
} from "/lib/es/web-eid.js";

const functions = {
  "Status": {
    "success": () => window.postMessage({
      action:    Action.STATUS_SUCCESS,
      extension: "1.1.0",
      nativeApp: "1.1.0",
    }),

    "success - SemVer patch difference extension": () => window.postMessage({
      action:    Action.STATUS_SUCCESS,
      library:   "1.2.3",
      extension: "1.2.1",
      nativeApp: "1.2.3",
    }),

    "success - SemVer patch difference native app": () => window.postMessage({
      action:    Action.STATUS_SUCCESS,
      library:   "1.2.3",
      extension: "1.2.3",
      nativeApp: "1.2.1",
    }),

    "success - SemVer minor difference extension": () => window.postMessage({
      action:    Action.STATUS_SUCCESS,
      library:   "1.2.3",
      extension: "1.1.3",
      nativeApp: "1.2.3",
    }),

    "success - SemVer minor difference native app": () => window.postMessage({
      action:    Action.STATUS_SUCCESS,
      library:   "1.2.3",
      extension: "1.2.3",
      nativeApp: "1.1.3",
    }),

    "success - With warnings": () => window.postMessage({
      action:    Action.STATUS_SUCCESS,
      library:   "1.2.3",
      extension: "1.2.3",
      nativeApp: "1.1.3",

      warnings: [
        "Web-eID library version 1.x.x is deprecated and not be supported after 31.12.2025",
      ],
    }),

    "failure - native unavailable": () => window.postMessage({
      action: Action.STATUS_FAILURE,

      error: {
        code:      ErrorCode.ERR_WEBEID_NATIVE_UNAVAILABLE,
        extension: "0.0.1",
      },
    }),

    "failure - extension unavailable": () => window.postMessage({
      action: Action.STATUS_FAILURE,

      error: {
        code: ErrorCode.ERR_WEBEID_EXTENSION_UNAVAILABLE,
      },
    }),

    "failure - SemVer major difference extension": () => window.postMessage({
      action: Action.STATUS_FAILURE,

      error: {
        code: ErrorCode.ERR_WEBEID_VERSION_MISMATCH,

        message: "Update required for Web-eID extension",

        library:   "1.2.3",
        extension: "0.2.3",
        nativeApp: "1.2.3",

        requiresUpdate: {
          library:   false,
          extension: true,
          nativeApp: false,
        },
      },
    }),

    "failure - SemVer major difference native app": () => window.postMessage({
      action: Action.STATUS_FAILURE,

      error: {
        code: ErrorCode.ERR_WEBEID_VERSION_MISMATCH,

        message: "Update required for Web-eID native app",

        library:   "1.2.3",
        extension: "1.2.3",
        nativeApp: "0.2.3",

        requiresUpdate: {
          library:   false,
          extension: false,
          nativeApp: true,
        },
      },
    }),

    "failure - SemVer major difference extension and native app": () => window.postMessage({
      action: Action.STATUS_FAILURE,

      error: {
        code: ErrorCode.ERR_WEBEID_VERSION_MISMATCH,

        message: "Update required for Web-eID extension and native app",

        library:   "1.2.3",
        extension: "0.2.3",
        nativeApp: "0.2.3",

        requiresUpdate: {
          library:   false,
          extension: true,
          nativeApp: true,
        },
      },
    }),
  },
};

function init() {
  const containerEl = document.getElementById("extension-mock-buttons");
  const mockAckEl   = document.getElementById("mock-ack");

  window.addEventListener("message", (message) => {
    if (mockAckEl.checked && message.data.action) {
      const isAckNeeded = (
        message.data.action === Action.STATUS ||
        message.data.action === Action.AUTHENTICATE
      );

      if (isAckNeeded) {
        console.warn("Sending mocked acknowledge for " + message.data.action);
        window.postMessage({
          action: message.data.action + "-ack",
        });
      }
    }
  })

  Object.keys(functions).forEach((group) => {
    const groupEl      = document.createElement("div");
    const groupTitleEl = document.createElement("h3");

    groupTitleEl.innerText = group;
    groupEl.classList.add("group");

    groupEl.appendChild(groupTitleEl);

    Object.keys(functions[group]).forEach((label) => {
      const buttonEl = document.createElement("input");

      buttonEl.type    = "button";
      buttonEl.value   = label;
      buttonEl.onclick = functions[group][label];

      buttonEl.classList.add(/^success/.test(label) ? "success" : "failure");

      groupEl.appendChild(buttonEl);
    });

    containerEl.appendChild(groupEl);

    return containerEl;
  });
}

document.addEventListener("DOMContentLoaded", init);
