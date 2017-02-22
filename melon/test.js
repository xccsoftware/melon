/*
 *    
 * 
 */

$(function(){
	 //加载json文件
	 var validataFields=$.fn.loadValidate('validate.json');
     $.fn.validateData('defaultForm',validataFields);
	 //取消表单默认行为
	 $("#defaultForm").submit(function(ev){ev.preventDefault();});
	 $("#submitBtn").on("click", function(){
		    var info = $.fn.prformVerification('defaultForm');
		    if(info){
			  alert('验证成功');
			  //此处可提交表单信息
			  window.location.href = 'icon2.jsp';
		    }else{
			  alert('验证失败')
		      return; 
		    }
	     }); 
	 
	 //重置
	 $('#resetBtn').click(function(){
		 $.fn.resetForm('defaultForm');
	 });
})