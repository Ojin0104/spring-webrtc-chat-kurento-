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

const PARTICIPANT_MAIN_CLASS = 'participant main';
const PARTICIPANT_CLASS = 'participant';

/**
 * Creates a video element for a new participant
 *
 * @param {String} name - the name of the new participant, to be used as tag
 *                        name of the video element.
 *                        The tag of the new element will be 'video<name>'
 * @return
 */
function Participant(name,isSharing) {
	this.name = name;
	var container = document.createElement('div');
	container.className = PARTICIPANT_MAIN_CLASS;

	container.id = name;
	var span = document.createElement('span');
	var video = document.createElement('video');
	var rtcPeer;
    this.isSharing=isSharing;

	container.appendChild(video);
	container.appendChild(span);
//	container.onclick = switchContainerClass;

    var myScreen=false
    var addElement=document.getElementById('participants');
    var addSharing=document.getElementById('sharing-space');

     if(isSharing){
                console.log("sharing");
                addElement.classList.remove("cam-container");
                startButton.classList.add("is-hidden");
                addElement.classList.add("sharing-cam-container");
                span.classList.add="share-name";

            for(var i=0;i<addSharing.children.length;i++){

            if(addSharing.children[i].id===name){
                myScreen=true;
                    console.log(name.substring(0,name.length-8));
            }

            }
            if(!myScreen){
            span.appendChild(document.createTextNode(name.substring(0,name.length-8)+"의 공유화면"));

            container.className="participant screen";
            addSharing.appendChild(container);
            }
            }
            else{
            span.appendChild(document.createTextNode(name));
            addElement.appendChild(container);
            }

	video.id = 'video-' + name;
	video.autoplay = true;
	video.controls = false;


	this.getElement = function() {
		return container;
	}

	this.getVideoElement = function() {
		return video;
	}

//	function switchContainerClass() {//cam size change
//		if (container.className === PARTICIPANT_CLASS) {
//			var elements = Array.prototype.slice.call(document.getElementsByClassName(PARTICIPANT_MAIN_CLASS));
//			elements.forEach(function(item) {
//					item.className = PARTICIPANT_CLASS;
//				});
//
//				container.className = PARTICIPANT_MAIN_CLASS;
//			} else {
//			container.className = PARTICIPANT_CLASS;
//		}
//	}

	function isPresentMainParticipant() {
		return ((document.getElementsByClassName(PARTICIPANT_MAIN_CLASS)).length != 0);
	}

	this.offerToReceiveVideo = function(error, offerSdp, wp){
		if (error) return console.error ("sdp offer error")
		console.log('Invoking SDP offer callback function');
		var msg =  { id : "receiveVideoFrom",
				sender : name,
				sdpOffer : offerSdp
			};
		sendMessage(msg);
	}


	this.onIceCandidate = function (candidate, wp) {
		  console.log("Local candidate" + JSON.stringify(candidate));

		  var message = {
		    id: 'onIceCandidate',
		    candidate: candidate,
		    name: name
		  };
		  sendMessage(message);
	}

	Object.defineProperty(this, 'rtcPeer', { writable: true});

	this.dispose = function() {
		console.log('Disposing participant ' + this.name);
		this.rtcPeer.dispose();
		if(isSharing){
		    addSharing.innerHTML="";
		    startButton.classList.remove("is-hidden");
        }else{
        container.parentNode.removeChild(container);
        }

	};
}