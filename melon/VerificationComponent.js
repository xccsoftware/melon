/*
 *  表单验证使用说明：
 *  1、首先加载配置的json文件
 *     调用格式：var validataFields=$.fn.loadValidate('validate.json');  
 *  2、验证表单：
 *     调用格式：$.fn.validateData(id,validataFields);
 *     参数说明:
 *            id为表单的id，
 *            validataFields为json文件里的数据
 *     样例：$.fn.validateData('defaultForm',validataFields);
 *  3、json文件配置参数说明
 *     name        ：字段名称，不可空
 *	   nameCn      ：字段中文名称，不可空
 *	   required    ：是否必填，不可空
 *	                 true:必须有值
 *     identical   ：一致性(注：设置为true,则必须配置一个参照的对象field)
 *                   true:必须有值
 *                   (样例：identical: {
 *		                    field: 'password',
 *		                    message: '2次密码不一致'
 *		                   },password为参照的对象
 *		             )
 *		checkboxs  ：复选框验证
 *                   设置为true，则必须配置minValue和maxValue
 *	 4、提供特殊验证validateType (格式: validateType:10)
 *      基本类型
 *			10 	只能是字母
 *			11 	只能是汉字,配置minValue和maxValue可指定汉字个数，可不设置
 *			12	只能是数字，0-9
 *			13	只能是数字，包括"."
 * 			14 	只能是字母、数字
 *			15 	只能是下划线和字母、数字，且以字母开头
 *	        16     只能是字母、数字、汉字、中划线、下划线、空格  
 *          20	数字
 *  		21 	整形
 *       日期
 *          30	日期年月日(YYYY/MM/DD)
 *          31	自定义日期,必须输入验证格式(type)
 *              例子：(type:YYYY-MM-DD)
 *       其他类型
 * 			41     手机
 * 			42     电话
 * 			43  email
 * 			44     邮政编码
 * 			45  URL地址
 *       decimalDigits  小数位数
 *       minValue,maxValue
 *	        51      字符型：最小长度，最大长度
 *	        52       整形，浮点型：最小值，最大值
 *       tips  提示信息，可不要
 *   5、方法说明
 *     $.fn.loadValidate         加载json文件，返回json       
 *     $.fn.validateData         验证表单
 *     $.fn.prformVerification   执行表单验证，返回boolean值
 */

;(function($){
	
    ///////////////////////////////////////////////////
	//加载校验json文件，返回json数据
	$.fn.loadValidate = function(validateFileUrl){
		var validataFields={};
		$.ajax({
			url:validateFileUrl,//json文件路径
			cache: false, // 默认true,设置为 false 将不会从浏览器缓存中加载请求信息。
			type: 'POST',//请求方式
			async:false,//设置同步
			dataType: 'json',//数据类型
			timeout: 300000,//请求相应退出时间
			error: function(){
				alert('加载数据校验配置文件错误');//读取错误消息
			},
			success: function(data){//读取成功后解析数据
				validataFields=data;
			}
		})
		return validataFields;
	}
	
	////////////////////////////////////////////////////
	//验证表单
	$.fn.validateData = function(id,validataFields){
	   $('#'+id).bootstrapValidator({
		   message : '输入错误',
	       container: 'tooltip',
	       feedbackIcons: {
	            valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	       },
	  });
	   
     //循环验证字段
	 $.each(validataFields,function(i,e){
		 //必填
		 if(e.required){
			 var message=setUpTips(e.tips,'不能为空值');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				 validators: {
					 notEmpty: {
					     message: message,
					 }
				 },
			 }); 
		 }
         //一致性
         if(e.identical){
        	 var message=setUpTips(e.tips,'2次密码输入不一致');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  identical: {
		                    field: e.field,
		                    message: 'message'
		              },
				   }
			 }); 
		 }
         //复选框验证
         if(e.checkboxs){
        	 var message=setUpTips(e.tips,'选择'+e.minValue+'~'+e.maxValue+'个');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				 validators: {
					 choice: {
	                        min: e.minValue,
	                        max: e.maxValue,
	                        message: message
	                  }
				 }
			 }); 
		 }
         
         /************************特殊验证********************************/
         //10只能是字母
         if(e.validateType==10){
        	 var message=setUpTips(e.tips,'必须是字母');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					    regexp: {
						   regexp: /^[A-Za-z]+$/,
						   message: message
				        },
				   }
			 }); 
		 }
         //11只能是汉字
         if(e.validateType==11){
        	 var message=setUpTips(e.tips,'必须是汉字');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/,
						   message: message
				      },
				      stringLength: {
						     min: e.minValue,
							 max: e.maxValue,
							 message: '长度只能为%s-%s位'
					  },
				 }
			 }); 
		 }
         //12只能是数字，0-9
         if(e.validateType==12){
        	 var message=setUpTips(e.tips,'必须是数字，0-9');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^\d+$/,
						   message: message
				        },
				 }
			 }); 
		 }
         //13只能是数字，包括"."
         if(e.validateType==13){
        	 var message=setUpTips(e.tips,'必须为数字，格式XX.XX');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^(\+|-)?\d+($|\.\d+$)/,
						   message: message
				        },
				 }
			 }); 
		 }
         //14只能是字母、数字
         if(e.validateType==14){
        	 var message=setUpTips(e.tips,'必须为字母或数字');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^([a-z]|[A-Z]|[0-9])*$/,
						   message: message
				        },
				 }
			 }); 
		 }
         //15只能是下划线和字母、数字，且以字母开头
         if(e.validateType==15){
        	 var message=setUpTips(e.tips,'必须为字母或数字或下划线，且以字母开头');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^[a-zA-Z]{1}(\w)*$/,
						   message: message
				        },
				 }
			 }); 
		 }
         //16只能是下划线和字母、数字，且以字母开头
         if(e.validateType==16){
        	 var message=setUpTips(e.tips,'必须为字母、数字、汉字、中划线、下划线、空格');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^([a-z]|[A-Z]|[0-9]|[_-]|[\u4E00-\u9FA5\uF900-\uFA2D]|[\s])*$/,
						   message: message
				        },
				 }
			 }); 
		 }
         //20只能是数字
         if(e.validateType==20){
        	 var message=setUpTips(e.tips,'必须为数字，小数位数最多'+e.decimalDigits+'位');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  callback:{
							message:message,
							callback:function(value,validator){
							var value = $("input[name='"+e.name+"']").val();
							var regex=new RegExp("^(\\+|-)?\\d+($|\\.[0-9]{1,"+e.decimalDigits+"}$)+");    
							if(value.match(eval(regex))==null){
								return false;     
							}else{
								return true;  
							} 
						 }
					  }
				 }
			 }); 
		 }
         //21只能是整型数字
         if(e.validateType==21){
        	 var message=setUpTips(e.tips,'必须为整型数字，格式XX');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^(\\+|-)?[0-9]+$/,
						   message: message
				        },
				 }
			 }); 
		 }
         //30日期
         if(e.validateType==30){
        	 var message=setUpTips(e.tips,'输入正确的日期格式，YYYY/MM/DD');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  date:{
					     format: 'YYYY/MM/DD',
						 message:message
					  }
				 }
			 }); 
		 }
         //31自定义日期
         if(e.validateType==31){
        	 var message=setUpTips(e.tips,'输入正确的日期格式，'+e.type);
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  date:{
					     format: e.type,
						 message:message
					  }
				 }
			 }); 
		 }
         //41手机号
         if(e.validateType==41){
        	 var message=setUpTips(e.tips,'手机号长度为11位');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					    regexp: {
						   regexp: /^[\d]+$/,
						   message: '只能为数字'
					    },
					    stringLength: {
						   min: 11,
						   max: 11,
						   message: message
					    },
				   }
			 }); 
		 }
         //42电话号
         if(e.validateType==42){
        	 var message=setUpTips(e.tips,'格式错误，正确格式010-63608888,010-63608888-1581');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					    regexp: {
						   regexp: /^(0[\d]{2,3}-)?\d{6,8}(-\d{3,4})?(,?(0[\d]{2,3}-)?\d{6,8}(-\d{3,4})?)*$/,
						   message: message
				        },
				   }
			 }); 
		 }
         //43网址验证
         if(e.validateType==43){
        	 var message=setUpTips(e.tips,'输入正确的网址');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  uri: {
	                        allowLocal: true,
	                        message: message
	                  }
				 }
			 }); 
		 }
         //44邮箱验证
         if(e.validateType==44){
        	 var message=setUpTips(e.tips,'输入正确的邮箱地址');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  emailAddress: {
							 message: message
					  }
				 }
			 }); 
		 }
         //45邮政编码
         if(e.validateType==45){
        	 var message=setUpTips(e.tips,'请输入正确的格式');
			 $('#'+id).bootstrapValidator('addField',e.name,{
				  validators: {
					  regexp: {
						   regexp: /^\d{6}$/,
						   message: message
				      },
				  }
			 }); 
		 }
         //51字符长度限制
         if(e.validateType==51){
        	 var message=setUpTips(e.tips,'字符串的长度为'+e.minValue+'~'+e.maxValue);
			 $('#'+id).bootstrapValidator('addField',e.name,{
				 validators: {
					 stringLength: {
					     min: e.minValue,
						 max: e.maxValue,
						 message: message
					 },
				 }
			 }); 
		 }
         //52数字大小限制
         if(e.validateType==52){
        	 var message=setUpTips(e.tips,'数字最小为'+e.minValue+'，数字最大为'+e.maxValue);
			 $('#'+id).bootstrapValidator('addField',e.name,{
				 validators: {
					 callback:{
							message:message,
							callback:function(value,validator){
							var value = $("input[name='"+e.name+"']").val();
							value=Number(value);
							if(value<Number(e.minValue)||value>Number(e.maxValue)){
								return false;   
							}else{
								return true;  
							} 
						 }
					  }
				 }
			 }); 
		 }
	 });
  }
  //执行验证
  $.fn.prformVerification = function(id){
	  var bootstrapValidator = $('#'+id).data('bootstrapValidator');
	  bootstrapValidator.validate();
	  return bootstrapValidator.isValid();
  } 
  //重置表单
  $.fn.resetForm = function(id){
	  //清空表单验证内容
      $('#'+id)[0].reset();
	  //清空表单验证信息
	  $('#'+id).bootstrapValidator('resetForm');
  }
  //提示信息设置
  function setUpTips(tips,value){
	  var message=null;
		 if(tips!=undefined){
			 message=tips;
		 }else{
			 message=value;
		 }
	return  message;
  }
})(jQuery);