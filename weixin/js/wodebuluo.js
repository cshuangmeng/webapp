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
		$ID = $('#js-ID');
	//share
	share('23',configData.uuid,'','');
	
	$.ajax({
	    type: "POST",
	    url: login,
	    data:{"openId":configData.openid},
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
		window.location.href="/weixin/wodezuqun.html?openid="+configData.openid+"&uuid="+configData.uuid;
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
