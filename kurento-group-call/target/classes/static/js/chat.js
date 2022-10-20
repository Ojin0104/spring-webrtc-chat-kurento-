//'use strict';
//
//var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
//var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
//var screenSharing=document.querySelector('#screenSharing');
//
var stompClient = null;
var username = null;
//
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];
//
function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');
        screenSharing.classList.remove('hidden');///

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

//
//function onConnected() {
//    // Subscribe to the Public Topic
//    stompClient.subscribe('/topic/public', onMessageReceived);
//
//    // Tell your username to the server
//    stompClient.send("/app/chat.addUser",
//        {},
//        JSON.stringify({sender: username, type: 'JOIN'})
//    )
//
//    connectingElement.classList.add('hidden');
//}
//
//
//function onError(error) {
//    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
//    connectingElement.style.color = 'red';
//}
//
//
//function sendMessage(event) {
//    var messageContent = messageInput.value.trim();
//
//    if(messageContent && stompClient) {
//        var chatMessage = {
//            sender: username,
//            content: messageInput.value,
//            type: 'CHAT'
//        };
//
//        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
//        messageInput.value = '';
//    }
//    event.preventDefault();
//}
//
//
//function onMessageReceived(payload) {
//    var message = JSON.parse(payload.body);
//
//    var messageElement = document.createElement('li');
//
//    if(message.type === 'JOIN') {
//        messageElement.classList.add('event-message');
//        message.content = message.sender + ' joined!';
//    } else if (message.type === 'LEAVE') {
//        messageElement.classList.add('event-message');
//        message.content = message.sender + ' left!';
//    } else {
//        messageElement.classList.add('chat-message');
//
//        var avatarElement = document.createElement('i');
//        var avatarText = document.createTextNode(message.sender[0]);
//        avatarElement.appendChild(avatarText);
//        avatarElement.style['background-color'] = getAvatarColor(message.sender);
//
//        messageElement.appendChild(avatarElement);
//
//        var usernameElement = document.createElement('span');
//        var usernameText = document.createTextNode(message.sender);
//        usernameElement.appendChild(usernameText);
//        messageElement.appendChild(usernameElement);
//    }
///////////////////////////////////////
//    var textElement = document.createElement('p');
//    var messageText = document.createTextNode(message.content);
//    textElement.appendChild(messageText);
//
//    messageElement.appendChild(textElement);
//
//    messageArea.appendChild(messageElement);
//    messageArea.scrollTop = messageArea.scrollHeight;
//}
//
//
//function getAvatarColor(messageSender) {
//    var hash = 0;
//    for (var i = 0; i < messageSender.length; i++) {
//        hash = 31 * hash + messageSender.charCodeAt(i);
//    }
//
//    var index = Math.abs(hash % colors.length);
//    return colors[index];
//}
//const preferredDisplaySurface = document.getElementById('displaySurface');
//const startButton = document.getElementById('startButton');
//
//if (adapter.browserDetails.browser === 'chrome' &&
//    adapter.browserDetails.version >= 107) {
//  // See https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
//  document.getElementById('options').style.display = 'block';
//} else if (adapter.browserDetails.browser === 'firefox') {
//  // Polyfill in Firefox.
//  // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
//  adapter.browserShim.shimGetDisplayMedia(window, 'screen');
//}
//
//function handleSuccess(stream) {
//  startButton.disabled = true;
//  preferredDisplaySurface.disabled = true;
//  const video = document.querySelector('video');
//  video.srcObject = stream;
//
//  // demonstrates how to detect that the user has stopped
//  // sharing the screen via the browser UI.
//  stream.getVideoTracks()[0].addEventListener('ended', () => {
//    errorMsg('The user has ended sharing the screen');
//    startButton.disabled = false;
//    preferredDisplaySurface.disabled = false;
//  });
//}
//
//function handleError(error) {
//  errorMsg(`getDisplayMedia error: ${error.name}`, error);
//}
//
//function errorMsg(msg, error) {
//  const errorElement = document.querySelector('#errorMsg');
//  errorElement.innerHTML += `<p>${msg}</p>`;
//  if (typeof error !== 'undefined') {
//    console.error(error);
//  }
//}

////screensharing
//startButton.addEventListener('click', () => {
//  const options = {audio: true, video: true};
//  const displaySurface = preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;
//  if (displaySurface !== 'default') {
//    options.video = {displaySurface};
//  }
//  navigator.mediaDevices.getDisplayMedia(options)
//      .then(handleSuccess, handleError);
//});
//
//if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
//  startButton.disabled = false;
//} else {
//  errorMsg('getDisplayMedia is not supported');
//}






//usernameForm.addEventListener('submit', connect, true)
//messageForm.addEventListener('submit', sendMessage, true)
