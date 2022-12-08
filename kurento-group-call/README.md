[![License badge](https://img.shields.io/badge/license-Apache2-orange.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Documentation badge](https://readthedocs.org/projects/fiware-orion/badge/?version=latest)](http://doc-kurento.readthedocs.org/en/latest/)
[![Docker badge](https://img.shields.io/docker/pulls/fiware/orion.svg)](https://hub.docker.com/r/fiware/stream-oriented-kurento/)
[![Support badge]( https://img.shields.io/badge/support-sof-yellowgreen.svg)](http://stackoverflow.com/questions/tagged/kurento)

[![][KurentoImage]][Kurento]

Copyright © 2013-2016 [Kurento]. Licensed under [Apache 2.0 License].

kurento-FaceMeeting
==================

SFU방식의 화상채팅으로 Kurento-media-server를 활용해 화면공유기능과 채팅기능을 추가한 코드입니다.

전혀 모르는 사람도 따라만하면 사용하실 수 있습니다!

# 1.kurento-media-server설치

https://doc-kurento.readthedocs.io/en/latest/user/installation.html#local-installation

도커설치,로컬설치등 여러가지 설치방법이 있지만 본인은 로컬설치로 설치

## 1)gnupg 설치
```
sudo apt-get update ; sudo apt-get install --no-install-recommends \
    gnupg
```
## 2)kurento repository 추가

Import the Kurento repository signing key
```
sudo apt-key adv \
    --keyserver keyserver.ubuntu.com \
    --recv-keys 234821A61B67740F89BFD669FC8A16625AFA7A83
```
Get Ubuntu version definitions

```
source /etc/lsb-release
```

Add the repository to Apt
```
sudo tee "/etc/apt/sources.list.d/kurento.list" >/dev/null <<EOF
#Kurento Media Server - Release packages
deb [arch=amd64] http://ubuntu.openvidu.io/6.18.0 $DISTRIB_CODENAME kms6
EOF
```
## 3)kms 설치
```
sudo apt-get update ; sudo apt-get install --no-install-recommends \
    kurento-media-server
```
## 4)stun 서버 구축

[coturn 오픈소스 사용하여 구축
블로그 참조](https://velog.io/@ojin0104/coturn%EC%9D%84-%ED%99%9C%EC%9A%A9%ED%95%9C-stun-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%B6%95)

## 5)kurento 서버와 stun서버 연결

[블로그참조](https://velog.io/@ojin0104/kurento%EB%AF%B8%EB%94%94%EC%96%B4-%EC%84%9C%EB%B2%84%EC%97%90-turn%EC%84%9C%EB%B2%84-%EC%97%B0%EA%B2%B0%ED%95%98%EB%8A%94%EB%B2%95)

## 6)Maven설치

kurento-media-server에 maven 설치되어있어야함!!

## 7)media-server 설치확인
```
sudo service kurento-media-server start #시작
sudo service kurento-media-server stop #멈춤
```

```
curl \
  --include \
  --header "Connection: Upgrade" \
  --header "Upgrade: websocket" \
  --header "Host: 127.0.0.1:8888" \
  --header "Origin: 127.0.0.1" \
  http://127.0.0.1:8888/kurento
```  
  입력후 아래와 같은 응답을 받으면 연결수신 중을 의미합니다.
```
HTTP/1.1 500 Internal Server Error
Server: WebSocket++/0.7.0
```
# 2.웹배포
## 1)해당 파일을 clone 한다.
```
https://github.com/Ojin0104/spring-webrtc-chat-kurento-.git
```
## 2)해당 디렉토리로 이동해서 실행한다.
```
mvn -U clean spring-boot:run -Dspring-boot.run.jvmArguments="-Dkms.url=ws://{외부IP}:8888/kurento"
```
외부IP는 kurento media server의 외부 IP이다.
(웹배포 서버에도 maven깔려있어야함!)


Support
-------

The Kurento project provides community support through the  [Kurento Public
Mailing List] and through [StackOverflow] using the tags *kurento* and
*fiware-kurento*.

Before asking for support, please read first the [Kurento Netiquette Guidelines]

[documentation]: http://www.kurento.org/documentation
[FIWARE]: http://www.fiware.org
[GitHub Kurento bugtracker]: https://github.com/Kurento/bugtracker/issues
[GitHub Kurento Group]: https://github.com/kurento
[kurentoms]: http://twitter.com/kurentoms
[Kurento]: http://kurento.org
[Kurento Blog]: http://www.kurento.org/blog
[Kurento FIWARE Catalog Entry]: http://catalogue.fiware.org/enablers/stream-oriented-kurento
[Kurento Netiquette Guidelines]: http://www.kurento.org/blog/kurento-netiquette-guidelines
[Kurento Public Mailing list]: https://groups.google.com/forum/#!forum/kurento
[KurentoImage]: https://secure.gravatar.com/avatar/21a2a12c56b2a91c8918d5779f1778bf?s=120
[Apache 2.0 License]: http://www.apache.org/licenses/LICENSE-2.0
[NUBOMEDIA]: http://www.nubomedia.eu
[StackOverflow]: http://stackoverflow.com/search?q=kurento
[Read-the-docs]: http://read-the-docs.readthedocs.org/
[readthedocs.org]: http://kurento.readthedocs.org/
[Open API specification]: http://kurento.github.io/doc-kurento/
[apiary.io]: http://docs.streamoriented.apiary.io/
[instructions]: http://www.kurento.org/docs/current/tutorials/java/tutorial-groupcall.html

https://github.com/callicoder/spring-boot-websocket-chat-demo 프론트 참고
