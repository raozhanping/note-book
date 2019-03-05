## semver
> 語義化版本（Semantic Versioning）規範的一個實現，實現了版本和版本範圍的解析、計算、比較。

semver 定義了兩種概念：  
- 版本是指例如0.4.1、1.2.7、1.2.4-beta.0 這樣表示包的特定版本的字符串。
- 範圍則是對滿足特定規則的版本的一種表示，例如 1.2.3-2.3.4、1.x、^0.2、>1.4。

用semver 去比較版本將會是一個很好的選擇：  
```javascript
plugin.forEach(function () {
  if (!semver.satisfies(platformVersion, plugin.engines.platform)) {
    console.log(plugin.name, 'require', plugin.engines.platform, 'but unable to meet');
    }
  })
```

在你使用express 設計一個支持多版本的API服務器時，你可以這樣做：  
```javascript
app.get('/', appVersion('<0.6'), function (req, res) {
  res.send('less than 0.6');
  })

app.get('/', apiVersion('1.2.3 - 2.3.4'), function (req, res) {
  //..
  });

app.get('/', apiVersion('*'), function (req, res) {
  res.send('Unsupported version');
  })
```

選擇semver 的禮由很簡單， 讓裝專業的包去完成專業的工作
