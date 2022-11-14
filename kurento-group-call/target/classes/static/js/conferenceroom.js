/*
 * (C) Copyright 2014 Kurento (http://kurento.org/)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
 var sch=location.href
 var params=new URL(sch).searchParams;
 console.log(sch);

var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

var ws = new WebSocket('wss://' + location.host + '/groupcall');//://' + location.host + '/groupcall
var participants = {};
var name;
var room;
ws.onopen=function(){
if(params.get('userName')){
document.getElementById('roomName').value=params.get('roomName');
document.getElementById('name').value=params.get('userName');

    register();
     }

}
window.onbeforeunload = function() {//페이지벗어날때

	ws.close();
};

ws.onmessage = function(message) {
console.log(message);
	var parsedMessage = JSON.parse(message.data);
	console.info('Received message: ' + message.data);




	switch (parsedMessage.id) {
	case 'sendChat':
        receiveChat(parsedMessage);
        break;

	case 'existingParticipants':
		onExistingParticipants(parsedMessage);

		break;
	case 'newParticipantArrived':
		onNewParticipant(parsedMessage);

		break;
	case 'participantLeft':
		onParticipantLeft(parsedMessage);

		break;
	case 'receiveVideoAnswer':
		receiveVideoResponse(parsedMessage);

		break;
	case 'iceCandidate':

		participants[parsedMessage.name].rtcPeer.addIceCandidate(parsedMessage.candidate, function (error) {
	        if (error) {
		      console.error("Error adding candidate: " + error);
		      return;
	        }
	    });
	    break;
	default:
		console.error('Unrecognized message', parsedMessage);
	}


}

function register() {
//            username = document.querySelector('#name').value.trim();
//
//                         if(username) {
//                             usernamePage.classList.add('hidden');
//                             chatPage.classList.remove('hidden');
//                             screenSharing.classList.remove('hidden');///
//
//                             var socket = new SockJS('/ws');
//                             stompClient = Stomp.over(socket);
//
//                             stompClient.connect({}, onConnected, onError);
//                         }
//                         event.preventDefault();
	name = document.getElementById('name').value;
    room = document.getElementById('roomName').value;
    console.log(sch);

    console.log(name)
    var chatPage=document.querySelector('#chat-page');
    var screenSharing=document.querySelector('#screenSharing');
    /////////////추가 부분
    connectingElement.classList.add('hidden');
    chatPage.classList.remove('hidden');
    //screenSharing.classList.remove('hidden');
//    var socket = new SockJS('/ws');
//    stompClient = Stomp.over(socket);
//    stompClient.connect({}, onConnected, onError);
    ////////////추가부분

	document.getElementById('room-header').innerText = 'ROOM ' + room;
	document.getElementById('join').style.display = 'none';
	document.getElementById('room').style.display = 'block';

	var message = {
		id : 'joinRoom',
		name : name,
		room : room,
	}
	console.log(message)
	sendMessage(message);
}

function onNewParticipant(request) {
    joinleftmsg(request,"join");


	receiveVideo(request.name);
}

function receiveVideoResponse(result) {
	participants[result.name].rtcPeer.processAnswer (result.sdpAnswer, function (error) {
		if (error) return console.error (error);
	});
}

function callResponse(message) {
	if (message.response != 'accepted') {
		console.info('Call not accepted by peer. Closing call');
		stop();
	} else {
		webRtcPeer.processAnswer(message.sdpAnswer, function (error) {
			if (error) return console.error (error);
		});
	}
}

function onExistingParticipants(message) {
	var constraints = {
		audio : false,

		video : true
		//{
//			mandatory : {
//				maxWidth : 320,
//				maxFrameRate : 15,
//				minFrameRate : 15
//			}
//		}
	};

    console.log(name + " registered in room " + room);
    	var participant = new Participant(name);
    	participants[name] = participant;
    	var video = participant.getVideoElement();

//          navigator.mediaDevices.getDisplayMedia(constraints)
//              .then(function(stream){
//              var options = {
//              	      videoStream: stream,
//                      sendSource:'screen',
//              	      mediaConstraints: constraints,
//              	      onicecandidate: participant.onIceCandidate.bind(participant)
//              	    }
//
//              }, handleError);
//
        var options={
        localVideo:video,
        mediaConstraints: constraints,
        onicecandidate: participant.onIceCandidate.bind(participant)
        }




	participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
		function (error) {
		  if(error) {
			  return console.error(error);
		  }
		  this.generateOffer (participant.offerToReceiveVideo.bind(participant));
	});
	//추가


	joinleftmsg(message,"join");

	message.data.forEach(receiveVideo);
}

function leaveRoom() {
	sendMessage({
		id : 'leaveRoom'
	});

	for ( var key in participants) {
		participants[key].dispose();
	}

	document.getElementById('join').style.display = 'block';
	document.getElementById('room').style.display = 'none';

	ws.close();
}

function receiveVideo(sender) {
	var participant = new Participant(sender);
	participants[sender] = participant;
	var video = participant.getVideoElement();

	var options = {
      remoteVideo: video,
        onicecandidate: participant.onIceCandidate.bind(participant)
    }

	participant.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options,
			function (error) {
			  if(error) {
				  return console.error(error);
			  }
			  this.generateOffer (participant.offerToReceiveVideo.bind(participant));
	});;
}

function onParticipantLeft(request) {
	console.log('Participant ' + request.name + ' left');
	/////추가
	joinleftmsg(request,"left");
    /////
	var participant = participants[request.name];
	participant.dispose();
	delete participants[request.name];
}

function sendMessage(message) {
	var jsonMessage = JSON.stringify(message);
	console.log('Sending message: ' + jsonMessage);
	ws.send(jsonMessage);
}
function sendChat(event){
var room = document.getElementById('roomName').value;
var messageInput = document.querySelector('#message');
var messageContent=messageInput.value.trim();
var message = {
		id : 'sendChat',
		name : name,
		room : room,
		text : messageContent,
	}
	console.log(message)
	sendMessage(message);


	event.preventDefault();
}
function receiveChat(message){
        console.log('receiving message: ' + message);
        var messageElement = document.createElement('li');
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.name[0]);//[0]
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.name);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.name);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);

        var textElement = document.createElement('p');
        var messageText = document.createTextNode(message.content);
        textElement.appendChild(messageText);

        messageElement.appendChild(textElement);

        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
}


function joinleftmsg(message,type){

	var messageElement = document.createElement('li');
	messageElement.classList.add('event-message');
	if(type==="join"){

    message.content = message.name + '님이 입장하였습니다.';
    }else if(type==="left"){
    message.content = message.name + '님이 퇴장하였습니다.';
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}



    function getAvatarColor(messageSender) {
        var hash = 0;
        for (var i = 0; i < messageSender.length; i++) {
            hash = 31 * hash + messageSender.charCodeAt(i);
        }

        var index = Math.abs(hash % colors.length);
        return colors[index];
    }


    //screensharing 부분
    const preferredDisplaySurface = document.getElementById('displaySurface');
    const startButton = document.getElementById('startButton');



    if (adapter.browserDetails.browser === 'chrome' &&
        adapter.browserDetails.version >= 107) {
      // See https://developer.chrome.com/docs/web-platform/screen-sharing-controls/
      document.getElementById('options').style.display = 'block';
    } else if (adapter.browserDetails.browser === 'firefox') {
      // Polyfill in Firefox.
      // See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
      adapter.browserShim.shimGetDisplayMedia(window, 'screen');
    }

    function handleSuccess(stream) {
    var room = document.getElementById('roomName').value;
      startButton.disabled = true;
      preferredDisplaySurface.disabled = true;
      const video = document.querySelector('#sharevideo');
      video.srcObject=stream;


      var videoss = document.createElement('video');
      videoss.autoplay = true;
      videoss.controls = false;


       var save = new Participant('sharing');
       participants['sharing'] = save;
       //save로 endpoint생성해보자




        var constraints = {
                        audio : true,
                        video : {
                            mandatory : {
                                maxWidth : 320,
                                maxFrameRate : 15,

                            }
                        }
                    };
//
                  navigator.mediaDevices.getDisplayMedia(constraints)
                      .then(function(stream){
                      var options = {
                      	      videoStream: stream,
                              sendSource:'screen',
                      	      mediaConstraints: constraints,
                      	      onicecandidate: save.onIceCandidate.bind(save)
                      	    }
                        save.rtcPeer = new kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options,
                                		function (error) {
                                		  if(error) {
                                			  return console.error(error);
                                		  }
                                		  this.generateOffer (save.offerToReceiveVideo.bind(save));
                                	});
                                	//추가
                      }, handleError);







        	04526+3.1


      stream.getVideoTracks()[0].addEventListener('ended', () => {
        errorMsg('The user has ended sharing the screen');
        startButton.disabled = false;
        preferredDisplaySurface.disabled = false;
      });



   }

    function handleError(error) {
      errorMsg(`getDisplayMedia error: ${error.name}`, error);
    }

    function errorMsg(msg, error) {
      const errorElement = document.querySelector('#errorMsg');
      errorElement.innerHTML += `<p>${msg}</p>`;
      if (typeof error !== 'undefined') {
        console.error(error);
      }
    }


    startButton.addEventListener('click', () => {
      var options = {audio: true, video: true};
      const displaySurface = preferredDisplaySurface.options[preferredDisplaySurface.selectedIndex].value;
      if (displaySurface !== 'default') {
        options.video = {displaySurface};
      }
      navigator.mediaDevices.getDisplayMedia(options)
          .then(handleSuccess, handleError);
    });

    if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
      startButton.disabled = false;
    } else {
      errorMsg('getDisplayMedia is not supported');
    }



var messageForm = document.querySelector('#messageForm');

    //usernameForm.addEventListener('submit', connect, true)
    messageForm.addEventListener('submit', sendChat, true)
///////////////////추가된 부분
