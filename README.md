# crxTool
#### chrome 插件工具库
#### 封装一些chrome 插件开发过程中一些常用的需求。

-------------------

## 如何使用crxTool
#### crxTool 提供一个工具对象，封装了chrome插件开发中一些常见的技术方案
#### 在AMD环境下仍可修改这个引用。以下列出当crxTool为引用时的api说明文档

============

## crxTool.send(tag, data, cb) 

#### 用于从chrome扩展中想当前页面的content script 发送数据，其中`tag`为自定义的字符串类型，用于表示发送数据的标识，以方便content script在接收数据的时候区分数据的来源。`data`为要传递的数据对象。cb为数据被接收后的回调函数。

```javascript
crxTool.send("getDomWidth", {"id": 'box-1'}, function (res){
	console.log('box-1 元素的宽度为：  ', res.width);
});

```

## crxTool.sendListen(tag, cb)

#### 用于在 content script接收数据，其中`tag`为自定义的字符串类型，用于表示接收数据的标识，crxTool.send的`tag`对应的时候，即可接收到send发送的数据。`cb`表示处理接收数据的函数，与chrome.api中chrome.runtime.onMessage.addListener的处理函数保持一致的参数列表，使用方法如下：

```javascript
crxTool.sendListen('getDomWidth', function (request, sender, sendResponse){
	sendResponse({width: document.getElementById(request.id).offsetWidth});
});


```

## crxTool.getPageValue(valueName)
#### 用于在content script 获取当前页面中的页面变量。由于chrome有安全限制，不能直接获取在页面中script标签包裹的页面变量，比如token和页面信息，这些变量可能是通过服务端模板渲染好的，输出在页面中，以在页面中定义为全局变量供js文件中去获取。往往这些变量对我们的chrome 扩展程序很重要，但chrome不允许 content script 直接获取页面变量。crxTool提供一个函数用于根据参数 `valueName`获取变量定义处的数值作为返回值。

例如页面中如下定义：

``` html
<script type="text/javascript">
	var pageObj = {
		userName: 'abc',
		otherList: ['sasda','dsadasda','sasdad']
	}
</script>

```

```javascript
crxTool.getPageValue(valueName);

=>{"userName": "abc","otherList": ["sasda","dsadasda","sasdad"]}

```
