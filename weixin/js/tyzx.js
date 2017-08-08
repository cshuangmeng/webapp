$(function(){
	var $shopList = $('#js-shopList');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	config.unionId = undefined != configData.unionId ? configData.unionId : getUrlParam('unionId');
	//share
	share('22','','','');
	//合作商户列表
	$.ajax({
	    type: "POST",
	    url: shopstars,
	    dataType:"json",
	    async:false,
	    success: function(data){
	    	if(data.code == 0){
	    		for(var i=0;i<data.data.length;i++){
	    			$shopList.append('<span shopid="'+data.data[i].id+'" class="l js-goSpxq">'+data.data[i].name+'</span>');
				}
	    		$('.js-goSpxq').click(function(){
	    			var shopId = $(this).attr('shopid');
	    			window.location.href = "/weixin/hzspxq.html?openid="+config.openid+"&uuid="+config.uuid+"&shopId="+shopId+"&unionId="+config.unionId;
	    		});
	    	}
	    }
	});
});
