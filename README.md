# 1. 依存関係解消

```
npm install
```

# 2. run without UE4

```
npm run start
```

# 3. ビルド

```
npm run build
```


# 4. デプロイ

`npm run build`すると`./build`にビルドされた静的ファイルが生成されるので、PixelStreamingのSignalingServerのcustom_htmlあたりに突っ込む。

```
npm run build
cp -r build/* UE4/SignallingWebServer/custom_html/
```

# 5. Run PixelStreaming

1. `Start_WebRTCProxy.bat`起動
2. PixelStreamingが有効化されてるUE4のゲームインスタンスを起動
    * StandAloneかビルドする
3. `./UE4/SignalingWebServerrun.bat`を起動