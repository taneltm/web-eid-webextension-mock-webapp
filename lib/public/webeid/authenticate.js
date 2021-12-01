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

import { authenticate, config } from "/lib/es/web-eid.js";

function init() {
  const $options = document.querySelector(".authenticate.options");

  const ui = {
    authButton: document.querySelector("[name='authenticateButton']"),
    result:     document.querySelector("[name='authResult']"),

    getAuthChallengeUrl:    $options.querySelector("[name='getAuthChallengeUrl']"),
    postAuthTokenUrl:       $options.querySelector("[name='postAuthTokenUrl']"),
    getCorsConfigUrl:       $options.querySelector("[name='getCorsConfigUrl']"),
    headers:                $options.querySelector("[name='authHeaders']"),
    userInteractionTimeout: $options.querySelector("[name='authUserInteractionTimeout']"),
    serverRequestTimeout:   $options.querySelector("[name='authServerRequestTimeout']"),
    authLanguage:           $options.querySelector("[name='authLanguage']"),
  }

  ui.getAuthChallengeUrl.value          = window.location.origin + "/auth/challenge";
  ui.postAuthTokenUrl.value             = window.location.origin + "/auth/token";
  ui.getCorsConfigUrl.placeholder       = "E.g. /webeid-cors-config.json";
  ui.headers.placeholder                = "{ }";
  ui.headers.value                      = '{ "X-Nonce-Length": "44" }';
  ui.userInteractionTimeout.placeholder = config.DEFAULT_USER_INTERACTION_TIMEOUT;
  ui.serverRequestTimeout.placeholder   = config.DEFAULT_SERVER_REQUEST_TIMEOUT;
  ui.result.value                       = "";

  ui.authButton.addEventListener("click", async () => {
    const headers                = JSON.parse(ui.headers.value || "{}");
    const userInteractionTimeout = ui.userInteractionTimeout.value;
    const serverRequestTimeout   = ui.serverRequestTimeout.value;
    const lang                   = ui.authLanguage.value;
    const getCorsConfigUrl       = ui.getCorsConfigUrl.value;

    const options = {
      getAuthChallengeUrl: ui.getAuthChallengeUrl.value,
      postAuthTokenUrl:    ui.postAuthTokenUrl.value,

      // Optional, included in options only when defined.
      ...(getCorsConfigUrl       ? { getCorsConfigUrl       } : {}),
      ...(headers                ? { headers                } : {}),
      ...(userInteractionTimeout ? { userInteractionTimeout } : {}),
      ...(serverRequestTimeout   ? { serverRequestTimeout   } : {}),
      ...(lang                   ? { lang                   } : {}),
    };

    ui.result.value = "";
    ui.authButton.disabled = true;

    try {
      const response = await authenticate(options);

      ui.result.value = (
        "Authentication successful!" +
        "\n\n[response]\n" +
        JSON.stringify(response, null, "  ")
      );

    } catch (error) {
      ui.result.value = (
        "Authentication failed!" +
        `\n\n[Code]\n${error.code}` +
        `\n\n[Message]\n${error.message}` +
        (
          (error.response)
            ? `\n\n[response]\n${JSON.stringify(error.response, null, "  ")}`
            : ""
        )
      );

      console.error(error)

      throw error;

    } finally {
      ui.authButton.disabled = false;
    }

  });
}

document.addEventListener("DOMContentLoaded", init);
