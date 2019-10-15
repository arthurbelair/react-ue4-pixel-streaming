# 1. Reactプロジェクト作成しとく

ex)
```
create-react-app your_react_project
```

# 2. package.jsonに追加

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