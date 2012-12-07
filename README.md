JsEvent
=======
Javascript的事件一直都饱受诟病，jsevent对事件进行了封转，包括两部分。一部分是对系统事件的封装，另外一部分是用来自定义事件的，同时实现了自定义事件的异步调用队列。

###系统事件的封装

> 增加一个系统事件监听：

    e = new JsEvent();
    dom = document.getElementById('a');
    fn = function(event){alert("hah1");};
    e.bind(dom, "click",fn);

> 删除这个系统监听：

    e.unbind(dom, "click",fn);

> 增加一个系统监听，只监听一次：

    e.bindOnce(dom, "click",fn);
    
###自定义事件及其扩展


> 增加监听：

    e.addListener("11",fn);

> 去除监听：

    e.removeListener("11",fn);

> 增加一次监听：

    e.once("11",fn);

> 触发事件：

    e.fire("11","11");

以上实现了自定义事件的所有功能

###自定义事件异步队列`

> 有时我们希望，几件事件触发后再执行其他的函数。这里就用到了异步执行队列了。

    e.when("11","22",function(data){console.log("when");console.log(data);});
    当11,22事件都触发后调用回调函数。之后触发11,22事件都会再次执行回调函数。

    e.whenOnce("11","22",function(data){console.log("whenonce");console.log(data);});
    当11,22事件都触发后调用回调函数。之后触发11,22事件不会再次执行回调函数。

    e.after("11",2,function(data){console.log("after");console.log(data);});
    当11事件触发两次后执行回调函数。之后触发11事件不会再次执行回调函数。
    
    
    
详细内容请见doc/doc.html    
