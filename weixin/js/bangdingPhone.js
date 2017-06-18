$(function(){
	var $bangdingBtn = $('#js-bangdingBtn'),
		$tel = $('#js-tel'),
		$getcodeBtn = $('#js-getcodeBtn'),
		$addcode = $('#js-addcode'),
		$tipContent = $('#js-tipContent'),
		wait = 60;
	
	var	regNum = /^1[34578]\d{9}$/;
	//关闭弹框
	hideTip();
	var config = {};
	//share
	share('3','','','');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.loginReturn = getUrlParam('loginReturn');
	//下发验证码倒计时
	function time() {//o为按钮的对象，p为可选，这里是60秒过后，提示文字的改变 
		if (wait == 0) { 
			$getcodeBtn.removeAttr("disabled"); 
			$getcodeBtn.removeClass('daojishi');
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
	};
	
	$getcodeBtn.click(function(){
		sendcode()
	});
	
	//下发验证码
	function sendcode(){
		var $telNum = $tel.val();
		if(!(regNum.test($telNum))){
		    $tipContent.text('请输入正确的手机号！');
			showTip();
			return false;
		}else{
			time();
			$.ajax({
				type:"post",
				url:code,
				data:{"mobile":$telNum},
				dataType:"json",
        		async:false,
				success:function(data){
					if(data.code!=0){
		        		$tipContent.text(data.msg);
						showTip();
					}
				}
			});
		}
	};
	
	//isrule
	config.isrule = 0;
	$('#js-isrule labal').click(function(){
		var _this = $(this);
		if(_this.hasClass('isDefaultHover')){
			_this.removeClass('isDefaultHover');
			config.isrule = 0;
		}else{
			_this.addClass('isDefaultHover');
			config.isrule = 1;
		}
	});
	
	//绑定
	$bangdingBtn.click(function(){
		if(config.isrule == 1){
			var $telNum = $tel.val();
			if(!(regNum.test($telNum))){
			    $tipContent.text('请填写正确手机号！');
				showTip();
				return false;
			}else{
				$.ajax({
					type:"post",
					url:register,
					data:{"mobile":$telNum,'openId':config.openid,'code':$addcode.val()},
					dataType:"json",
	        		async:false,
					success:function(data){
						if(data.code==0){
							config.uuid = data.data.uuid;
							$tipContent.text('绑定成功！');
							showTip();
							//loginReturn 0:我的部落   1:订单确认
							if(config.loginReturn){
								if(config.loginReturn == 0){
									window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1be0f2a1f512729a&redirect_uri=http%3A%2F%2Fwww.tangseng.shop%2Fweixin%2Fwodebuluo.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
								}
								if(config.loginReturn == 1){
									config.goodIds = getUrlParam('itemIds');
									window.location.href="/weixin/dingdanqueren.html?openid="+config.openid+"&uuid="+config.uuid+"&itemIds="+config.goodIds;
								}
								if(config.loginReturn == 2){
									window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1be0f2a1f512729a&redirect_uri=http%3A%2F%2Fwww.tangseng.shop%2Fweixin%2Fgouwuche.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
								}
								if(config.loginReturn == 3){
									config.goodId = getUrlParam('goodId');
									config.isInviteCode = getUrlParam('isInviteCode');
									window.location.href="/weixin/shangpinxiangqing.html?openid="+config.openid+"&uuid="+config.uuid+"&goodId="+config.goodId+"&isInviteCode="+config.isInviteCode;
								}
								if(config.loginReturn == 4){
									config.shopId = getUrlParam('shopId');
									window.location.href="/weixin/dianpu.html?openid="+config.openid+"&uuid="+config.uuid+"&shopId="+config.shopId;
								}
							}
						}else{
							$tipContent.text(data.msg);
							showTip();
						}
					}
				});
			}
		}
		if(config.isrule == 0){
			$tipContent.text('请先同意《唐僧商城用户服务协议》！');
			showTip();
		}
	});
	
	$('#js-ruleCon').click(function(){
		$('.ruleCon').show();
	});
	$('.close-ruleCon').click(function(){
		$('.ruleCon').hide();
	});
	
});
