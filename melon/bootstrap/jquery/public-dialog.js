/**
 * bootstrp的模态框的二次封装，用于系统弹出层
 * 使用：
 * 打开模态窗口：$.modalDialog(options);顶层弹出 top.$.modalDialog(options),当前页面弹出 $("body").modalDialog(options)
 * 关闭模态窗口：$("#modelDialogId").closeDialog();
 */

;(function($){
	var defaults = {
		id:null,//模态窗口的ID
		//container:top.$,//显示位置，，默认为top
		title: '标题',
		content: '<p>内容</p>',
		url : '',//iFrame请求地址
		data:{},//请求参数
		width:70,//dialog宽度，百分比
		height:90,//dialog高度，百分比
		buttonAlign:"center",
		isDraggable:true,//是否能够拖动
		showCloseButton:true,//显示关闭按钮
		closeEvent:null,//关闭按钮事件，点击右上角和默认关闭按钮的事件
		backdrop:'static',//指定一个静态的背景，当用户点击模态框外部时不会关闭模态框。 backdrop:boolean 或 string 'static' 默认值：true。
		keyboard:false,//当按下 escape 键时关闭模态框，设置为 false 时则按键无效。 默认的bootstrap模态对话框参数。keyboard: boolean默认值：true。
		dialogShow:null,//对话框即将显示事件
		dialogShown:null,//对话框已经显示事件
		dialogHide:null,//对话框即将关闭
		dialogHidden:null,//对话框已经关闭事件
		buttons:null,//json数组，[{id:"closeButton",name:"关闭",className:"btn btn-default",click:function(){}}]
		maximize:true//是否加入模块窗口进行最大化设置，true或false。默认true进行最大化设置。
	},
	_random=function(a,b){
		return Math.random() > 0.5 ? -1 : 1;
	},
	_getModalID= function(){
		//生成一个惟一的ID
		return "beamDialog-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(_random).join('').substring(5, 20);
	},
	_setZIndex=function(container){
		//设置显示层次z-index
		var zIndex=0;
		$(container).find(".modal").each(function(index){
			
			if(index==0){
				zIndex=parseInt($(this).css("z-index"));
			}else{
				$(this).css("z-index",zIndex+10);
				$(container).find(".modal-backdrop").eq(index).css("z-index",zIndex);
			}
		});
	},
	_setModelDialogPosition=function (modelDialog,width,height) {   
		//设置模态框的高度、宽度、以及在页面垂直居中
		
		//获取原来模态框中.modal-body的高度
		var $clone = $(modelDialog).clone().css('display', 'block').appendTo('body');
		var contentHeight=$clone.find('.modal-body').height();
		$clone.remove();
		
		//设置.modal-body无padding
		$(modelDialog).find(".modal-body").css("padding",0);
		
		var winWidth=$(window).width();
		var winHeight=$(window).height();
		
		var dialogWidth=winWidth*width/100;
		var dialogHeight=winHeight*height/100;
		var topHeight=0;
		
		//设置.modal-header的高度
		if($(modelDialog).find(".modal-header").length>0){
			$(modelDialog).find(".modal-header").css("height",60);
			dialogHeight=dialogHeight-60;
			topHeight=topHeight+60;
		}
		
		//设置.modal-footer的高度
		if($(modelDialog).find(".modal-footer").length>0){
			$(modelDialog).find(".modal-footer").css("height",70);
			dialogHeight=dialogHeight-70;
			topHeight=topHeight+70;
		}
		
		//设置.modal-dialog和.modal-content的宽度为当前window宽度的百分比
		$(modelDialog).find(".modal-dialog").css("width",dialogWidth);
		$(modelDialog).find(".modal-content").css("width",dialogWidth);
			
		//设置.modal-body的高度，当原来内容的高度大于计算后的高度，使用原来的内容的高度，否则为计算后的高度
		if(dialogHeight<contentHeight){
			dialogHeight=contentHeight;
			$(modelDialog).find(".modal-body").css("height",contentHeight);
		}else{
			$(modelDialog).find(".modal-body").css("height",dialogHeight);
		}

		//设置.modal-dialog的top值
        var top = Math.round((winHeight - dialogHeight - topHeight) / 2);   
        top = top > 0 ? top : 0;   
        $(modelDialog).find('.modal-dialog').css("margin-top", top);
        
        //返回最后dialog设置的width、height、top值
        var dialogSetting={
        		dialogWidth:dialogWidth,
        		dialogHeight:dialogHeight,
        		dialogTop:top
        	};
        return dialogSetting;
	},
	_setMaxDialog=function(modelDialog){
		//最大化
		$(modelDialog).find(".modal-header .fa-window-maximize").bind("click",function(){
			
			var winWidth=$(window).width();
			var winHeight=$(window).height();
			
			var dialogHeight=winHeight;
			
			if($(modelDialog).find(".modal-header").length>0){
				$(modelDialog).find(".modal-header").css("height",60);
				dialogHeight=dialogHeight-60;
			}
			
			if($(modelDialog).find(".modal-footer").length>0){
				$(modelDialog).find(".modal-footer").css("height",70);
				dialogHeight=dialogHeight-70;
			}
			
			$(modelDialog).find(".modal-dialog").css("width",winWidth);
			$(modelDialog).find(".modal-content").css("width",winWidth);
				
			$(modelDialog).find(".modal-body").css("height",dialogHeight);

	        $(modelDialog).find('.modal-dialog').css("margin-top", 0);

	        //修改窗口图标
	        $(modelDialog).find(".modal-header .fa-window-maximize").parent().css("display","none");
	        $(modelDialog).find(".modal-header .fa-window-restore").parent().css("display","");
	        
	        //禁用拖动事件
	        $(modelDialog).find(".modal-content").draggable( 'disable');
	        $(modelDialog).find(".modal-content").css("left",0);
	        $(modelDialog).find(".modal-content").css("top",0);
		});
	},
	_restoreDialogSize=function(modelDialog,dialogSetting){
		//模态框大小还原
		$(modelDialog).find(".modal-header .fa-window-restore").bind("click",function(){
			
			$(modelDialog).find(".modal-dialog").css("width",dialogSetting.dialogWidth);
			$(modelDialog).find(".modal-content").css("width",dialogSetting.dialogWidth);
				
			$(modelDialog).find(".modal-body").css("height",dialogSetting.dialogHeight);

	        $(modelDialog).find('.modal-dialog').css("margin-top", dialogSetting.dialogTop);
	        
	        //修改窗口图标
	        $(modelDialog).find(".modal-header .fa-window-restore").parent().css("display","none");
	        $(modelDialog).find(".modal-header .fa-window-maximize").parent().css("display","");
	        
	        //激活拖动事件
	        $(modelDialog).find(".modal-content").draggable('enable');
		});
	}
	_dialogDrag=function(modelDialog){
		//拖动事件
		var id=$(modelDialog).attr("id");
		var event_counter=$(modelDialog).find(".modal-content");
		event_counter.draggable({  
		    handle: ".modal-header",   
		    cursor: 'move',   
		    refreshPositions: false,
		    containment: "#"+id, 
		    scroll: false,
		    drag: function() {
		    	$(modelDialog).find('.modal-content').css("margin-top", 0);   
	        },
		}); 
		
	},
	_buttonClickEvent=function(modelDialog,options){
		//按钮绑定点击事件
		//自定义按钮点击事件
		var buttons=options.buttons;
		if(buttons!=null) {
			for (var i = 0; i < buttons.length; i++) {
				if ((typeof buttons[i].click) == "function") {
					$(modelDialog).find("#"+buttons[i].id).bind("click",buttons[i].click);
				}
			}
		}
		//关闭按钮事件
		if (options.showCloseButton) {
			$(modelDialog).find("#closeButton").bind("click",options.closeEvent);
		}
		//右上角关闭按钮的点击事件
		if(options.closeEvent&&(typeof options.closeEvent) == "function"){
			$(modelDialog).find("#rightTopBtn").bind("click",options.closeEvent);
		}
	},
	_modelDialogEvent=function(modelDialog,options){
		//绑定模态窗口本身的事件
		if(options.dialogShow&&(typeof options.dialogShow) == "function"){
			modelDialog.on('show.bs.modal', function() {
				options.dialogShow();
			});
		}
		if(options.dialogShown&&(typeof options.dialogShown) == "function"){
			modelDialog.on('shown.bs.modal', function() {
				options.dialogShown();
			});
		}
		if(options.dialogHide&&(typeof options.dialogHide) == "function"){
			modelDialog.on('hide.bs.modal', function() {
				options.dialogHide();
			});
		}
		modelDialog.on('hidden.bs.modal', function() {
			if(options.dialogHidden&&(typeof options.dialogHidden) == "function"){
				options.dialogHidden();
			}
			modelDialog.remove();//删除模态窗口
		});
	},
	_init=function(container,options){
		
		if(options.id){
			modalID = options.id;
		}else{
			modalID = _getModalID();
		}
		
		//生成按钮
		var buttonHtml="";
		if(options.buttons!=null) {
			for (var i = 0; i < options.buttons.length; i++) {
				buttonHtml += '<button  id="' + options.buttons[i].id + '" type="button" class="' + options.buttons[i].className + '">' + options.buttons[i].name + '</button>';
			}
		}
		
		//是否显示关闭按钮
		if (options.showCloseButton) {
			buttonHtml += '<button id="closeButton" type="button" class="btn btn-default btn-sm"  data-dismiss="modal"><i class="ace-icon fa fa-times bigger-110"></i>关闭</button>';
		}
		var dialogHtml= 
			'   <div class="modal fade" style="overflow-x:auto;overflow-y:hidden;" id="'+modalID+'" role="dialog" tabindex="-1" aria-hidden="true" data-backdrop="'+options.backdrop+'" data-keyboard="'+options.keyboard+'">'+
			'	   <div class="modal-dialog">'+
			'	      <div class="modal-content" style="width:100%;height:100%;background-color: #F5F5F5;">'+
			'	         <div class="modal-header" style="border-bottom: 1px solid #E5E5E5;">'+
			//'	            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>'+
			'	         	<div  class="action-buttons" style="float:right;padding-right:20px;">';
		if(options.maximize){
			dialogHtml+='	    <a href="#" style="color:#aaa;" title="最大化"><i class="ace-icon fa fa-window-maximize bigger-140"></i></a>';
			dialogHtml+='	    <a href="#" style="color:#aaa;display:none;" title="还原"><i class="ace-icon fa fa-window-restore bigger-140"></i></a>';
		}
		
		dialogHtml+=	'	    <a href="#" id="rightTopBtn" style="color:#aaa;padding-left:10px;" data-dismiss="modal" aria-hidden="true" title="关闭"><i class="ace-icon fa fa-times bigger-160"></i></a>';
		dialogHtml+=    '	</div>';
		
		dialogHtml+=	'	<h4 class="modal-title" id="myModalLabel">'+options.title+'</h4>';
		dialogHtml+=	'</div>';
		
		if(options.url!=''){
			dialogHtml+='<div class="modal-body" style="overflow-x:auto;overflow-y:hidden;"><iframe name="Iframe_modeDialog_'+modalID+'" id="Iframe_modeDialog_'+modalID+'" src="" frameborder="0" width="100%" height="100%" ></iframe></div>';
		}else{
			dialogHtml+='<div class="modal-body" style="overflow-x:auto;overflow-y:hidden;margin:10px;">'+options.content+'</div>';
		}	
		if (buttonHtml) {
			dialogHtml+='<div class="modal-footer" style="text-align:'+options.buttonAlign+'">'+buttonHtml+'</div>';
		};
		dialogHtml+=
			'	      </div>'+
			'	   </div>'+
			'	</div>';
		
		container.append(dialogHtml);
	
		
		var modelDialog = $(container).find('#' + modalID);
		
		//按钮绑定事件
		_buttonClickEvent(modelDialog,options);
		
		//绑定拖动事件
		if(options.isDraggable){
			_dialogDrag(modelDialog);
		}
		
		
		//绑定本身的事件
		_modelDialogEvent(modelDialog,options);
		
		if(options.url!=''){
			
			//远程获取数据
			/*modelDialog.find(".modal-body").load(options.url, options.data,function() {
				modelDialog.modal('show');
				//设置弹出层z-index
				_setZIndex(container);
			});*/
			
			//参数处理
			var requestParams="";
			var data=options.data;
			if(options.data){
				 for(var key in options.data){
					 var param="&"+key+"="+data[key];
					 requestParams+=param;
				 }
			}
			var requestUrl="";
			if(options.url.indexOf("?") != -1) { //当url带有参数时
				requestUrl=options.url+requestParams;
			}else{
				requestUrl=options.url+"?"+requestParams.substring(1);
			}
			
			//iframe跳转
			//ws.tools.location.href(requestUrl,"Iframe_modeDialog_"+modalID);
			$("#Iframe_modeDialog_"+modalID).attr("src",requestUrl);
			
			modelDialog.modal('show');
			
			//设置弹出层z-index
			_setZIndex(container);
			
			
		}else{
			modelDialog.modal('show');
			
			//设置弹出层z-index
			_setZIndex(container);
		}
		
		//设置模态框垂直居中显示
		var dialogSetting=_setModelDialogPosition(modelDialog,options.width,options.height);
		
		if(options.maximize){
			//最大化事件
			_setMaxDialog(modelDialog);
			
			//模块框还原事件
			_restoreDialogSize(modelDialog,dialogSetting);
		}
		
		return modelDialog;
	};
	
	$.fn.modalDialog = function(){
			this.container=this;
			
			this.show=function(options){
				var options = $.extend({},defaults, options);
				var modelDialog = _init(this.container,options);
				return modelDialog;
			};
			this.alert=function(msg,callFun,options){
				var settings={
					title:"系统提示",
					content:msg,
					width:40,
					height:20,
					maximize:false
				};
				if(callFun&&(typeof callFun) == "function"){
					settings.closeEvent=callFun;
				}
				
				var options=$.extend({},settings, options);
				
				options = $.extend({},defaults, options);
				
				
				var modelDialog = _init(this.container,options);
				
				return modelDialog;
				
			};
			this.confirm=function(msg,callFun,options){
				var settings={
					id:_getModalID(),
					title:"系统警告",
					content:msg,
					showCloseButton:false,
					width:40,
					height:20,
					maximize:false
				};
				if(callFun&&(typeof callFun) == "function"){
					settings.buttons=[{
						id:"okButton",
						name:"确定",
						className:"btn btn-primary",
						click:callFun
					},
					{
						id:"cancelButton",
						name:"取消",
						className:"btn btn-default",
						click:function(){
							//location.reload();
							$("#"+options.id).modalDialog().close();
							
						} 
					}];
				}
					
				var options=$.extend({},settings, options);
				
				options = $.extend({},defaults, options);
				
				
				var modelDialog = _init(this.container,options);
				
				return modelDialog;
			};
			
			this.close=function(modelDialog){
				this.modal('hide');
			};
			
			return this;
			
			
	};
	

})(jQuery);