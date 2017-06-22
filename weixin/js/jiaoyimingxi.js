$(function(){
	
	var $jiaoyimingxilist = $('#js-jiaoyimingxi-list'),
		$jiaoyimingxinoList = $('#js-p-jiaoyimingxi-noList');
	
	var config = {};
	//share
	share('12','','','');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	$.ajax({
	    type: "POST",
	    url: usertradeLog,
	    data:{"uuid":config.uuid,"openId":config.openid},
	    dataType:"json",
	    async:false,
	    success: function(data){
	    	if(data.data.logs.length == 0){
	    		$jiaoyimingxilist.hide();
	    		$jiaoyimingxinoList.show();
	    	}else{
	    		$jiaoyimingxilist.show();
	    		$jiaoyimingxinoList.hide();
	    		for(var i=0;i<data.data.logs.length;i++){
					$jiaoyimingxilist.append('<div class="list"><div class="l"><p class="tit">'+data.data.logs[i].item+'</p><p class="time">'+data.data.logs[i].createTime+'</p></div><div class="r"><p class="money"><b class="isPlus'+i+'"></b>'+data.data.logs[i].amount+'</p><p class="desc">'+data.data.logs[i].desc+'</p></div></div>');
					if(data.data.logs[i].amount < 0){
						$('.isPlus'+i).hide();
						$('.isPlus'+i).parent().css("color","#333");
					}
				}
	    		
	    	}
		}
	});
	
})
