$(function(){
	//加载商品列表(type=3)
	var $goodsList = $('#js-p-jtjk-goodsList'),
		$search = $('#js-search');
	var config = {};
	//share
	share('13','','','');
	$.ajax({
		type: "POST",
	    url: goodslist,
	    dataType:"json",
	    data:{"typeId":"3"},
	    async:false,
		success:function(data){
			if(data.code == 0){
				for(var i=0;i<data.data.goods.length;i++){
					$goodsList.append('<div class="good js-good" goodId="'+data.data.goods[i].id+'"><img src="'+data.data.goods[i].headImg+'" alt="" /><p class="tit">'+data.data.goods[i].name+'</p><p class="yuanjia">￥'+data.data.goods[i].price+'</p><p class="zdshifu">最低实付价：￥'+data.data.goods[i].extras.miniPrice+'</p></div>');
				}
				position();
				//去商品详情
				$('.js-good').click(function(){
					config.goodId = $(this).attr('goodId');
					window.location.href="/weixin/shangpinxiangqing.html?openid="+configData.openid+"&uuid="+configData.uuid+"&goodId="+config.goodId+"&unionId="+configData.unionId;
				});
			}
		}
	});
	//搜索
	$search.change(function(){
		if($search.val()!="" && $search.val()!=undefined){
			$goodsList.empty();
			$.ajax({
				type: "POST",
			    url: goodslist,
			    dataType:"json",
			    data:{"name":$search.val()},
			    async:false,
				success:function(data){
					if(data.code == 0){
						for(var i=0;i<data.data.goods.length;i++){
							$goodsList.append('<div class="good js-good" goodId="'+data.data.goods[i].id+'"><img src="'+data.data.goods[i].headImg+'" alt="" /><p class="tit">'+data.data.goods[i].name+'</p><p class="yuanjia">￥'+data.data.goods[i].price+'</p><p class="zdshifu">最低实付价：￥'+data.data.goods[i].extras.miniPrice+'</p></div>');
						}
						position();
						//去商品详情
						$('.js-good').click(function(){
							config.goodId = $(this).attr('goodId');
							window.location.href="/weixin/shangpinxiangqing.html?openid="+configData.openid+"&uuid="+configData.uuid+"&goodId="+config.goodId;
						});
					}
				}
			});
		}
	});
	
	//商品列表定位
	function position(){
		$('.p-jtjk-goodsList .good').each(function(){
			var _this = $(this);
			var index = _this.index()+1;
			if(index % 2 == 0){
				_this.css('float','right');
			}
			if(index % 2 != 0){
				_this.css('float','left');
			}
		});
	}
	
})
