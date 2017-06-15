var	regNum = /^1[34578]\d{9}$/;

//获取url带的参数
function getUrlParam(name,url) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = undefined!=url?url.match(reg):window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


var $code = getUrlParam("code");
if($code){
	//正常流程
}else{
	var url="https%3A%2F%2Fapi.cwjia.cn%2Fstatic%2Fcontent%2Fhtml5%2F201705%2Fcerti%2Findex.html";
	//wxa45f2b3c39b095f5
	window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa45f2b3c39b095f5&redirect_uri="+url+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
}

//填写手机号
$('#tel').on('input',function(e){
   	if($(this).val().length==11){
   		$('#code').show();
   		$(this).blur();
   	}
});


//下发验证码倒计时
function time() {//o为按钮的对象，p为可选，这里是60秒过后，提示文字的改变 
	if (wait == 0) { 
		$getcodeBtn.removeAttr("disabled"); 
		$getcodeBtn.removeClass('daojishi')
		$getcodeBtn.val("重发验证码");//改变按钮中value的值 
		wait = 60; 
	} else {
		$getcodeBtn.attr("disabled","disabled");//倒计时过程中禁止点击按钮 
		$getcodeBtn.addClass('daojishi');
		$getcodeBtn.val(wait + "s");//改变按钮中value的值 
		wait--; 
		setTimeout(function() {
			time();//循环调用 
		}, 1000)
	}
} 

//显示提示框(定时关闭)
function showTip(){
	$body.on('touchmove',function(event) { event.preventDefault(); }, false);
	$tipObj.css('top',$(document).scrollTop()+$(window).height()/2.5);
	$tipObj.fadeIn(200,function(){
		setTimeout(function(){
			$tipObj.fadeOut(200);
			$("body").unbind("touchmove");
		},1000);
	});
}

//下发验证码
function sendcode(){
	var $telNum = $tel.val();
	if(!(regNum.test($telNum))){
		setTimeout(function () {
	     	showTip();
	        $tipCon.text('请输入正确的手机号');
	    }, 400);
		return false;
	}else{
		time();
		$.ajax({
			type:"get",
			url:sendCode+"?phone="+$telNum,
			dataType:"JSON",
			success:function(data){
				if(data.code!=0){
					setTimeout(function () {
				     	showTip();
	        			$tipCon.text(data.msg);
				    }, 400);
				}
			}
		});
	}
};


//注册
$openGift.click(function(){
	action('5');
	var $telNum = $tel.val();
	if(!(regNum.test($telNum))){
		 setTimeout(function () {
	     	showTip();
	        $tipCon.text('请填写正确手机号！');
	     }, 400);
		return false;
	}else{
		$.ajax({
			type:"get",
			url:certiRegister+"?cellPhone="+$telNum+"&openId="+config.openid+"&code="+$addcode.val(),
			dataType:"JSON",
			success:function(data){
				if(data.code!=0){
					setTimeout(function () {
				     	showTip();
	        			$tipCon.text(data.msg);
				     }, 400);
				}
				if(data.code==0){
					$.ajax({
						type:"get",
						url:certiLogin+"?openId="+config.openid,
						dataType:"JSON",
						success:function(data){
							if(data.code == 101){
								$body.on('touchmove',function(event) { event.preventDefault(); }, false);
								window.scrollTo(0,0);
								$giftTip.fadeIn();
								
								
							}else{
								console.log(data);
							}
						}
					});
				}
			}
		});
	}
});