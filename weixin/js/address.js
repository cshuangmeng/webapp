$(function(){
	var $addAddress = $('#js-addAddress'),
	    $addressList = $('#js-addressList');
	    
	//share
	share('2','','','');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	//加载用户地址(uuid=100000)
	$.ajax({
	    type: "POST",
	    url: addressmy,
	    data:{"uuid":config.uuid,"openId":config.openid},
	    dataType:"json",
	    async:false,
	    success: function(data){
	    	if(data.code == 0){
	    		for(var i=0;i<data.data.length;i++){
	    			if(data.data[i].isDefault == 1){
	    				$addressList.append('<div class="p-address-li" areaId="'+data.data[i].id+'" consigner="'+data.data[i].consigner+'" mobile="'+data.data[i].mobile+'" areaName="'+data.data[i].areaName+''+data.data[i].address+'"><div class="top"><span class="name">'+data.data[i].consigner+'</span><span class="tel">'+data.data[i].mobile+'</span><span upid="'+data.data[i].id+'" class="redact js-redact">编辑</span><div class="clear"></div></div><div class="bot"><span id="isDefault">[ 默认地址 ] </span>'+data.data[i].areaName+'</div></div>');
	    			}else{
	    				$addressList.append('<div class="p-address-li" areaId="'+data.data[i].id+'" consigner="'+data.data[i].consigner+'" mobile="'+data.data[i].mobile+'" areaName="'+data.data[i].areaName+'"><div class="top"><span class="name">'+data.data[i].consigner+'</span><span class="tel">'+data.data[i].mobile+'</span><span upid="'+data.data[i].id+'" class="redact js-redact">编辑</span><div class="clear"></div></div><div class="bot">'+data.data[i].areaName+'</div></div>');
	    			}
	    		}
	    		//编辑地址
	    		$('.js-redact').click(function(){
	    			var upid = $(this).attr('upid');
	    					window.location.href="/weixin/addAddress.html?openid="+config.openid+"&uuid="+config.uuid+"&upid="+upid+"&isUpdata=1";
	    		});
	    	}
	    }
	});
	
	//添加新地址
	$addAddress.click(function(){
		window.location.href="/weixin/addAddress.html?openid="+config.openid+"&uuid="+config.uuid;
	});
	
	
	
	
	
	
});
