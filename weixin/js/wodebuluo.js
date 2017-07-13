$(function(){
	var $goJymx = $('#js-goJymx'),
		$goZuqun = $('#js-goZuqun'),
		$daifukuan = $('#js-daifukuan'),
		$daifahuo = $('#js-daifahuo'),
		$daishouhuo = $('#js-daishouhuo'),
		$nickname = $('#js-nickname'),
		$headImg = $('#js-headImg'),
		$coin = $('#js-coin'),
		$point = $('#js-point'),
		$tipContent = $('#js-tipContent'),
		$ID = $('#js-ID');
	//share
	share('23',configData.uuid,'','');
	//关闭弹框
	hideTip();
	$.ajax({
	    type: "POST",
	    url: login,
	    data:{"unionId":configData.unionId,"openId":configData.openid},
	    dataType:"json",
	    async:false,
	    success: function(data){
	    	if(data.code == 0){
	    		//用户登录(openId=1234567890)显示页面数据common中已调用
				$nickname.text(configData.nickname);
				$headImg.text(configData.headImg);
				$coin.text(configData.coin);
				$point.text(configData.point);
				$ID.text(configData.ID);
				if($ID.text() == "马上获取"){
					$ID.click(function(){
						window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1be0f2a1f512729a&redirect_uri=http%3A%2F%2Fwww.tangseng.shop%2Fweixin%2Fhydlb.html&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
					});
				}
	    	}else if(data.code == 104){
	    		window.location.href = "/weixin/bangdingPhone.html?openid="+configData.openid+"&loginReturn=0";
	    	}
	    	
	    }
	});
	
	//交易明细
	$goJymx.click(function(){
		window.location.href="/weixin/jiaoyimingxi.html?openid="+configData.openid+"&uuid="+configData.uuid;
	});
	//我的族群
	$goZuqun.click(function(){
		$.ajax({
			type: "POST",
		    url: tribeinfo,
		    dataType:"json",
		    data:{"uuid":configData.uuid},
		    async:false,
			success:function(data){
				if(data.code == 0){
					if(data.data){
						window.location.href="/weixin/wodezuqun.html?openid="+configData.openid+"&uuid="+configData.uuid;
					}else{
						$tipContent.text('购买欢迎大礼包，才能创建族群哦~');
						showTip();
					}
				}
			}
		});
	});
	//daifukuan
	$daifukuan.click(function(){
		window.location.href="/weixin/daifukuan.html?openid="+configData.openid+"&uuid="+configData.uuid;
	});
	//daifahuo
	$daifahuo.click(function(){
		window.location.href="/weixin/daifahuo.html?openid="+configData.openid+"&uuid="+configData.uuid;
	});
	//daishouhuo
	$daishouhuo.click(function(){
		window.location.href="/weixin/daishouhuo.html?openid="+configData.openid+"&uuid="+configData.uuid;
	});
	
})
