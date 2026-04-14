
##  页面com-data-loading组件说明

|  属性				|	说明							|	类型		|	默认值				|
|-------------------|-------------------------------|-----------|-----------------------|
status				|	加载状态						|	String	|	loading				|


## 示例

```html
用法：
<com-data-loading ref="dataLoading" :status="loadStatus" />
```

```js
	//loadStatus状态说明
	//loading	 =>	 '正在加载'
	//load 		 =>	 '上拉加载更多'
	//noData	 => 	 '没有更多数据了'
```