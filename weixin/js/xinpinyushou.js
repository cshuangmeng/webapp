$(function(){
	//加载商品列表(type=4)
	var $goodsList = $('#js-p-xpys-goods'),
		$banner = $('#js-p-xpys-banner'),
		$intro = $('#js-p-xpys-con');
	
	//share
	share('25','','','');
	$.ajax({
		type: "POST",
	    url: goodslist,
	    dataType:"json",
	    data:{"typeId":"4"},
	    async:false,
		success:function(data){
			if(data.code == 0){
//				recommend
//				$banner.attr("src",data.data.recommend.imgs);
//				$intro.text(data.data.recommend.desc);
//				goods
//				if(data.data.goods){
//					for(var i=0;i<data.data.goods.length;i++){
//						$goodsList.append('<div class="good js-good" goodId="'+data.data.goods[i].id+'"><img src="'+data.data.goods[i].headImg+'" alt="" /><p class="tit">'+data.data.goods[i].name+'</p><div class="con"><span class="price">￥'+data.data.goods[i].price+'</span><span class="tag">马上抢</span></div><div class="clear"></div></div>');
//					}
//				}
//				position();
//				//去商品详情
//				$('.js-good').click(function(){
//					config.goodId = $(this).attr('goodId');
//					window.location.href="/weixin/shangpinxiangqing.html?openid="+configData.openid+"&uuid="+configData.uuid+"&goodId="+config.goodId;
//				});
				var detailImgsArr = new Array();  
				var detailImgsList = data.data.recommend.imgs;
				detailImgsArr = detailImgsList.split(',');
				for(var i=0;i<detailImgsArr.length;i++){
					$('.imgList').append('<img src="'+detailImgsArr[i]+'"/>');
				}
				
			}
		}
	});
	//商品列表定位
	function position(){
		$('.p-xpys-goods .good').each(function(){
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
});
