# 1. React プロジェクト作成しとく

ex)

```
create-react-app your_react_project
```

# 2. package.json に追加

```
cd your_react_project
npm install shogo-hab/react-ue4-pixel-streaming --save
```

# 3. Example

```jsx App.js
import React from 'react';
import ReactPixelStreaming, {PixelStreamingContext} from 'pixel-streaming-component';

function App() {
  return (
    <ReactPixelStreaming>
        {/*
          * ReactPixelStreamingで子孫ComponentとContextを共有する
          */}
        <YourComponent />
    </ReactPixelStreaming>
  );
}

const YourComponent = () => (
        {/*
          * 子孫からPixelStreamingやWebRTC Playerへアクセスする場合はConsumerでWrapする
          */}

  <PixelStreamingContext.Consumer>
    {(state) => (
        <SomeComponent onClick={(e)=>{state.emitCommand(e)}}></SomeComponent>
    )}
    </PixelStreamingContext.Consumer>
  );

export default App;
```

# for Component Develop

```
npm install
npm run demoStart
```

# API メモ

## Components

- `ReactPixelStreaming`コンポーネント: WebRtc の接続管理や UE4 との疎通用のメソッド/プロパティを管理するラッパーコンポーネント。
- `PixelWindow`コンポーネント: 実際に WebRTC の Video Stream がレンダリングされるコンポーネント。ReactPixelStreaming の子孫コンポーネントとして、context を受け取る必要がある。

## Attributes

### ReactPixelStreaming

`ReactPixelStreaming`コンポーネントは以下の Attribute を受け取ります。

```
<ReactPixelStreaming
  webRtcHost="${HOST}:${PORT}"
  pixelStreamingResponseEvents={[]}
>
```

- webRtcHost<Strings>: WebRTC のバックエンドを渡します。
- pixelStreamingResponseEvents<Array>: UE4 で responsePixelStreaming が発行された時の処理を渡します。

```
 [{name: "handler", handler: function(response){
   // some action
 } ]
```

### PixelWindow

`PixelWindow`コンポーネントは context を介して以下の値を渡す必要があります。

```
<PixelStreamingContext.Consumer>{
  context=>{
    <PixelWindow
      load={context.load}
      actions={context.actions}
      connect={context.connect}
      host={context.webRtcHost}
      setVideoAspectRatio={context.actions.setVideoAspectRatio}
      setPlayerAspectRatio={context.actions.setPlayerAspectRatio}
    />
  }
}
</PixelStreamingContext.Consumer>
```

### CustomComponent と context

`PixelStreamingContext.Consumer`経由で子コンポーネントから`ReactPixelStreaming`のプロパティやメソッド等のコンテキストにアクセスできます。

* videoAspectRatio: Video Streamのアスペクト比,
* videoRes: Video Streamの幅/高さ
  * width
  * haight
* responseEventListeners: 登録済みのpixelStreamingResponseイベントリスナー
* addResponseEventListener: pixelStreamingResponseイベントリスナーの登録
* removeResponseEventListener: pixelStreamingResponseイベントリスナーの削除
* emitter: WebRTC経由でコマンドを送信する(UE4でPixelStreamingInputEventが発火する)
  * emitter(context.webRtcPlayerObj).emitUIInteraction
  * emitter(context.webRtcPlayerObj).emitMouseDown
  * emitter(context.webRtcPlayerObj).emitMouseUp
  * emitter(context.webRtcPlayerObj).emitMouseMove
  * emitter(context.webRtcPlayerObj).emitMouseWheel
  * emitter(context.webRtcPlayerObj).sendInputData
  * emitter(context.webRtcPlayerObj).emitUIInteraction
  * emitter(context.webRtcPlayerObj).emitCommand
  * emitter(context.webRtcPlayerObj).emitDescriptor
* controlScheme: マウスの制御オプション
* suppressBrowserKeys: ファンクションキーの制御オプション
* fakeMouseWithTouches: タッチスクリーンの制御オプション
* webrtcState: 
* webRtcPlayerObj: インスタンス課されたwebrtcオブジェクト
* webRtcPlayer: webrtcコンストラクタ
* connect: 
* clientConfig: webrtcの接続情報 
* socket: インスタンス化されたwsオブジェクト
* aggregatedStats<Array>: webRtcPlayerObjが収集したwebrtc統計(interval: 1sec)
  * avgBitrate : 平均ビットレート(Kbps)
  * highBitrate: 最大ビットレート(Kbps)
  * bitrate: ビットレート(Kbps)
  * bytesReceived: 受信データ量(bytes)
  * framerate: FPS
  * hightFramerate: 最大FPS
  * lowFramerate: 最小FPS
* actions: 基本的に気にしなくて良い
  * updateWebRTCStat: 
  * updateClientConfig:
  * updateSocket: 
  * setVideoAspectRatio: 
  * addLatestStats: 
  * setWebRTCPlayerObj: 
* load:
