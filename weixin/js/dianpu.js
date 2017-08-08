$(function(){
	var $shopname = $('#js-dianpu-name'),
		$shoptouxiang = $('#js-dianpu-touxiang'),
		$goodsList = $('#js-p-dianpu-goodsList'),
		$followers = $('#js-followers'),
		$heart = $('#js-heart'),
		$guanzhuBtn = $('#js-guanzhuBtn');
		
	var config = {};
	config.shopId = getUrlParam('shopId');
	//获取url携带的参数
	config.openid = undefined != configData.openid ? configData.openid : getUrlParam('openid');
	config.uuid = undefined != configData.uuid ? configData.uuid : getUrlParam('uuid');
	config.unionId = undefined != configData.unionId ? configData.unionId : getUrlParam('unionId');
	//share
	share('7','','',config.shopId);
	//加载商铺详情(id=1)
	$.ajax({
		type: "POST",
	    url: shopinfo,
	    dataType:"json",
	    data:{"id":config.shopId,"uuid":config.uuid,"openId":config.openid},
	    async:false,
		success:function(data){
			if(data.code == 0){
				$shopname.text(data.data.name);
				$shoptouxiang.attr('src',data.data.headImg);
				$followers.text(data.data.followers);
				for(var i=0;i<data.data.flowers;i++){
	    			$heart.append('<img src="img/heart.png"/>');
				}
				config.isFollowed = data.data.extras.isFollowed;
				if(config.isFollowed == 1){
					//已关注
					$guanzhuBtn.text('已关注');
				}
				if(config.isFollowed == 0){
					//未关注
					$guanzhuBtn.text('关注');
				}
				//关注
				isFocus();
			}
		}
	});
	
	//关注,取消关注
	function isFocus(){
		$guanzhuBtn.click(function(){
			$.ajax({
			    type: "POST",
			    url: login,
			    data:{"unionId":configData.unionId,"openId":config.openid},
			    dataType:"json",
			    async:false,
			    success: function(data){
			    	if(data.code == 0){
						//关注
						if(config.isFollowed == 1){
							$.ajax({
							    type: "POST",
							    url: shopunsub,
							    data:{"shopId":config.shopId,"uuid":config.uuid,"openId":config.openid},
							    dataType:"json",
							    async:false,
							    success: function(data){
							    	if(data.code == 0){
							    		config.isFollowed = 0;
							    		$guanzhuBtn.text('关注');
							    		$followers.text(parseInt($followers.text())-1);
							    	}
							    }
							});
						}else if(config.isFollowed == 0){
							$.ajax({
							    type: "POST",
							    url: shopsub,
							    data:{"shopId":config.shopId,"uuid":config.uuid,"openId":config.openid},
							    dataType:"json",
							    async:false,
							    success: function(data){
							    	if(data.code == 0){
							    		config.isFollowed = 1;
							    		$guanzhuBtn.text('已关注');
							    		$followers.text(parseInt($followers.text())+1);
							    	}
							    }
							});
						}
			    	}else if(data.code == 104){
			    		window.location.href = "/weixin/bangdingPhone.html?openid="+config.openid+"&shopId="+config.shopId+"&loginReturn=4";
			    	}else{
			    		$tipContent.text(data.msg);
						showTip();
			    	}
			    }
			});
		});
	}
	
	//加载商品列表(shopId=1)
	$.ajax({
		type: "POST",
	    url: goodslist,
	    dataType:"json",
	    data:{"shopId":config.shopId},
	    async:false,
		success:function(data){
			if(data.code == 0){
				for(var i=0;i<data.data.goods.length;i++){
					$goodsList.append('<div class="good" goodid="'+data.data.goods[i].id+'"><img src="'+data.data.goods[i].headImg+'" alt="" /><p class="tit">'+data.data.goods[i].name+'</p><div class="con"><span class="price">￥'+data.data.goods[i].price+'</span></div><div class="clear"></div></div>');
				}
				position();
				$('.good').click(function(){
					config.goodId = $(this).attr('goodid');
					window.location.href="/weixin/shangpinxiangqing.html?openid="+config.openid+"&uuid="+config.uuid+"&goodId="+config.goodId+"&unionId="+config.unionId;
				});
			}
		}
	});
	
	//商品列表定位
	function position(){
		$('.p-dianpu-goodsList .good').each(function(){
			var _this = $(this);
			var index = _this.index()+1;
			if(index % 2 == 0){
				_this.css('float','right');
			}
			if(index % 2 != 0){
				_this.css('float','left');
			}
		});
	};
	
});