/*!
 * Copyright � 2020, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */


/**
 * These values are all defined/updated at runtime to reflect the current session.
 */
let sessionId = null;
let nextEventsLink = null;
let chatContent = null;

/**
 * This function is called when a new session should be started. This normally happens when the page is loaded.
 */
let startNewSession = function () {
    let successHandler = () => {
        chatContent.innerHTML = "";
        setTimeout(pollForEvents, 2000);
    };
    createSession(successHandler);
};

/**
 * This function polls for events based on the nextEventsLink.
 */
let pollForEvents = function () {
    if (!botId || !revisionId || !sessionId || !nextEventsLink) {
        return;
    }

    checkToken().then(() => {
        fetch(baseURL + nextEventsLink, {
            method: "GET",
            headers: {
                "Authorization": authToken
            }
        }).then(function (response) {
            return response.json();
        })
            .then((response) => {
                response.links.forEach(link => {
                    if (link.rel === 'next') {
                        nextEventsLink = link.href;
                    }
                });

                response.items.forEach(event => {
                    // this sample only handles message events but there are other types of events (typing, transfer, end chat)
                    // that might need to be handled by a production connector
                    if (event.type === "messageEvent") {
                        createMessageElements(event);
                        chatContent.scrollTop = chatContent.scrollHeight;
                    }
                });

                setTimeout(pollForEvents, 2000);
            }, (error) => {
                console.error(error);
            });
    });
};

let createMessageElements = function (messageEvent) {

    let messageStyle = messageEvent.sourceId === userId ? "userInput" : "botResponse";
    if (messageEvent.bodyElements && messageEvent.bodyElements.length) {
        messageEvent.bodyElements.forEach(bodyElement => {
            switch (bodyElement.type) {
                case "textElement":
                     chatContent.innerHTML += "<div class='chatRow text " + messageStyle + "'><span>" + bodyElement.text + "</span></div>";
                    break;
                case "htmlElement":
                    chatContent.innerHTML += "<div class='chatRow html " + messageStyle + "'>" + bodyElement.text + "</div>";
                    break;
            }
        });
    } else if (messageEvent.text) {
        chatContent.innerHTML += "<div class='chatRow text " + messageStyle + "'><span>" + messageEvent.text + "</span></div>";
    }

    if (messageEvent.attachments && messageEvent.attachments.length) {
        let attachmentIndex = 0;
        messageEvent.attachments.forEach(attachment => {
            if (attachment.mediaType.startsWith("image/")) {
                let parentDivId = messageEvent.id + "_" + attachmentIndex++;
                chatContent.innerHTML += "<div class='chatRow " + messageStyle + "' id='" + parentDivId + "'></div>";
                getImageContent(attachment.uri, attachment.mediaType, parentDivId);
            }
        });
    }

    if (messageEvent.messageLinks && messageEvent.messageLinks.length) {
        messageEvent.messageLinks.forEach(link => {
            chatContent.innerHTML += "<div class='chatRow " + messageStyle + "'><a href='" + link.uri + "' target='_blank'>" + link.label + "</a></div>";
        });
    }

    if (messageEvent.buttons && messageEvent.buttons.length) {
        let buttonDivContents = "";
        let buttonIndex = 0;
        messageEvent.buttons.forEach(button => {
            let buttonId = messageEvent.id+"_"+buttonIndex++;
            if(button.eventText==="Snap / Upload pic"){
                // buttonDivContents += "<input type='button' class= 'btn-primary' id='" + buttonId + "' onclick='uploadFile()'>"+'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16"> <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"></path> <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"></path> </svg> </button>';    
                buttonDivContents += '<button type="button" class="btn btn-primary" id="'+buttonId+'" onclick="uploadFile()" > <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16"> <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"></path> <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"></path> </svg> Snap / Upload Pic </button>';    

            } else {
                buttonDivContents += "<input type='button' class= 'btn-primary' id='" + buttonId + "' value='" + button.eventText + "' onclick='sendUserInputEvent(\""+button.eventText+"\")'/>";
            };
            
        });
        chatContent.innerHTML += "<div class='chatButtons'>"+buttonDivContents+"</div>";
    }
};

/**
 * Images returned by the bot have relative URIs that require the same authorization as all other bot calls.
 * This function loads the image using the appropriate authorization header and then updates the imageDiv with the
 * image content.
 */
let getImageContent = function (uri, mediaType, parentDivId) {
    checkToken().then(() => {
        fetch(baseURL + uri, {
            method: "GET",
            headers: {
                "Authorization": authToken,
                'Access-Control-Allow-Origin':"*",
                "Content-Type": mediaType
            }
        })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                let imageDiv = document.getElementById(parentDivId);
                imageDiv.innerHTML = data;
                chatContent.scrollTop = chatContent.scrollHeight;
            });
    });
};

/**
 * This function sends a user input event to the bot.
 */
let sendUserInputEvent = function (userInput) {
    let event = {};
    event.sourceId = userId;
    event.sourceName = userName;
    event.type = "messageEvent";
    event.text = userInput;
    sendChatEvent(event, 'application/vnd.sas.natural.language.conversations.create.message.event+json', null);
};


/**
 * This function checks if an authorization token is available.
 *
 * NOTE: If this connector is meant to be long running then additional code needs to be added to handle
 * expired tokens.
 *
 * @returns {Promise}
 */
let checkToken = function () {
    console.log("entered checkToken");
    //check if the authorization token is available
    if (authToken) {
        return Promise.resolve();
    } else {
        console.error("Authentication token not provided.");
    }
};

/**
 * This function creates a new chat session and calls the successHandler when it is done.
 *
 * @param successHandler - function to call when the session has been created
 */
let createSession = function (successHandler) {

    console.log("Entered create session");
    sessionId = null;
    nextEventsLink = null;

    checkToken().then(() => {
        console.log("token checked");
        // this information is stored with the session and used to identify where/how the session was created
        let data = {
            "connectorName": connectorName,
            "properties": {
				"userName": userName,
				"userId": userId
            }
        };

        fetch(baseURL + '/naturalLanguageConversations/bots/' + botId + '/revisions/' + revisionId + '/sessions', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Authorization": authToken,
                'Access-Control-Allow-Origin':"*",
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            return response.json();
        })
            .then((response) => {
                sessionId = response.id;
                nextEventsLink = '/naturalLanguageConversations/bots/' + botId + '/revisions/' + revisionId + '/sessions/' + sessionId + "/events";
                sendStartChatEvent(successHandler);

            }, (error) => {
                console.error(error);
            });
    });
};

/**
 * This function sends a Start Chat Event.
 *
 * @param successHandler - function to call when the event has been sent
 */
let sendStartChatEvent = function (successHandler) {
    let event = {};
    event.type = "startChatEvent";
    event.sourceId = userId;
    event.sourceName = userName;
    sendChatEvent(event, 'application/vnd.sas.natural.language.conversations.create.start.chat.event+json', successHandler);
};


/**
 * This function sends an event of any type to the bot.
 *
 * @param event - event to send to the bot
 * @param eventContentType - the event type
 * @param successHandler - (optional) function to call when the session has been created
 */

let sendChatEvent = function (event, eventContentType, successHandler) {
    checkToken().then(() => {
        fetch(baseURL + '/naturalLanguageConversations/bots/' + botId + '/revisions/' + revisionId + '/sessions/' + sessionId + "/events", {
            method: "POST",
            body: JSON.stringify(event),
            headers: {
                "Authorization": authToken,
                "Content-Type": eventContentType
            }
        }).then(() => {
            if (successHandler)
                successHandler();
        }, (error) => {
            console.error(error);
        });
    });
};

/**
 * This function runs when the page loads. It sets up listeners and starts the chat session.
 */
function chatSetup() {

    chatContent = document.getElementById('chatContent');
    let userInputField = document.getElementById("userInputField");
    let sendButton = document.getElementById('sendButton');

    let submitUserInput = () => {
        let userInput = userInputField.value;
      
        userInputField.value = "";


        sendUserInputEvent(userInput);
    };

    userInputField.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            submitUserInput();
        }
    });

    sendButton.addEventListener('click', function (e) {
        submitUserInput();
    });

    // start a new chat session
    startNewSession();

};



