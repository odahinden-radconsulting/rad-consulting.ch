/* Contao Open Source CMS, (c) 2005-2015 Leo Feyer, LGPL license */
Request.Contao=new Class({Extends:Request.JSON,options:{followRedirects:!0,url:window.location.href},initialize:function(e){if(e)try{this.options.url=e.field.getParent("form").getAttribute("action")}catch(t){}this.parent(e)},success:function(e){var t=this.getHeader("X-Ajax-Location"),n;if(t&&this.options.followRedirects){location.replace(t);return}try{n=this.response.json=JSON.decode(e,this.options.secure)}catch(r){n={content:e}}n==null&&(n={content:""}),n.content!=""&&(n.content=n.content.stripScripts(function(e){n.javascript=e.replace(/<!--|\/\/-->|<!\[CDATA\[\/\/>|<!\]\]>/g,"")}),n.javascript&&this.options.evalScripts&&Browser.exec(n.javascript)),this.onSuccess(n.content,n)}}),Request.Mixed=Request.Contao,Tips.Contao=new Class({Extends:Tips,options:{id:"tip",onShow:function(){this.tip.setStyle("display","block")},onHide:function(){this.tip.setStyle("display","none")},title:"title",text:"",showDelay:1e3,hideDelay:100,className:"tip-wrap",offset:{x:16,y:16},windowPadding:{x:0,y:0},fixed:!0,waiAria:!0},position:function(e){this.tip||document.id(this);var t=window.getSize(),n=window.getScroll(),r={x:this.tip.offsetWidth,y:this.tip.offsetHeight},i={x:"left",y:"top"},s={y:!1,x2:!1,y2:!1,x:!1},o={};for(var u in i)o[i[u]]=e.page[u]+this.options.offset[u],o[i[u]]<0&&(s[u]=!0),o[i[u]]+r[u]-n[u]>t[u]-this.options.windowPadding[u]&&(u=="x"&&(o[i[u]]=e.page[u]-this.options.offset[u]-r[u]),s[u+"2"]=!0);var a=this.tip.getElement("div.tip-top");s.x2?(o.left+=24,a.setStyles({left:"auto",right:"9px"})):(o.left-=9,a.setStyles({left:"9px",right:"auto"})),this.fireEvent("bound",s),this.tip.setStyles(o)},hide:function(e){this.tip||document.id(this),this.fireEvent("hide",[this.tip,e])}}),Class.refactor(Drag,{attach:function(){return this.handles.addEvent("touchstart",this.bound.start),this.previous.apply(this,arguments)},detach:function(){return this.handles.removeEvent("touchstart",this.bound.start),this.previous.apply(this,arguments)},start:function(e){document.addEvents({touchmove:this.bound.check,touchend:this.bound.cancel}),this.previous.apply(this,arguments)},check:function(e){this.options.preventDefault&&e.preventDefault();var t=Math.round(Math.sqrt(Math.pow(e.page.x-this.mouse.start.x,2)+Math.pow(e.page.y-this.mouse.start.y,2)));t>this.options.snap&&(this.cancel(),this.document.addEvents({mousemove:this.bound.drag,mouseup:this.bound.stop}),document.addEvents({touchmove:this.bound.drag,touchend:this.bound.stop}),this.fireEvent("start",[this.element,e]).fireEvent("snap",this.element))},cancel:function(e){return document.removeEvents({touchmove:this.bound.check,touchend:this.bound.cancel}),this.previous.apply(this,arguments)},stop:function(e){return document.removeEvents({touchmove:this.bound.drag,touchend:this.bound.stop}),this.previous.apply(this,arguments)}}),Class.refactor(Sortables,{initialize:function(e,t){return t.dragOptions=Object.merge(t.dragOptions||{},{preventDefault:t.dragOptions&&t.dragOptions.preventDefault||Browser.Features.Touch}),this.previous.apply(this,arguments)},addItems:function(){return Array.flatten(arguments).each(function(e){this.elements.push(e);var t=e.retrieve("sortables:start",function(t){this.start.call(this,t,e)}.bind(this));(this.options.handle?e.getElement(this.options.handle)||e:e).addEvents({mousedown:t,touchstart:t})},this),this},removeItems:function(){return $$(Array.flatten(arguments).map(function(e){this.elements.erase(e);var t=e.retrieve("sortables:start");return(this.options.handle?e.getElement(this.options.handle)||e:e).removeEvents({mousedown:t,touchend:t}),e},this))},getClone:function(e,t){if(!this.options.clone)return(new Element(t.tagName)).inject(document.body);if(typeOf(this.options.clone)=="function")return this.options.clone.call(this,e,t,this.list);var n=this.previous.apply(this,arguments);return n.addEvent("touchstart",function(e){t.fireEvent("touchstart",e)}),n}});