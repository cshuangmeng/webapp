$(function(){
	var $more = $('#js-more'),
		$moreList = $('#js-moreList');
	
	var config = {};
	
	//显示隐藏更多
	$more.mouseenter(function(){
		$moreList.css("display","block");
	});
    $more.mouseleave(function(){
		$moreList.css("display","none");
	});
	
	//数量加减
	$(".changenum").blur(function(){
		var _this = $(this);
        if(_this.val() > 1){
        	_this.prev().css('color','#333');
			_this.prev().removeAttr('disabled');
        }
    });
    //减
    reduce();
    function reduce(){
    	$('.reduce').click(function(){
    		console.log('--');
    		var _this = $(this);
    		var val = _this.next().val();
    		val--;
    		if(val >= 1){
				_this.next().val(val);
    		}
    		if(val == 1){
    			_this.css('color','#ccc');
				_this.attr('disabled','disabled');
    		}
		});
    }
	//加
	increase();
	function increase(){
		$('.increase').click(function(){
			console.log('++');
			var _this = $(this);
			_this.prev().prev().css('color','#333');
			var val = _this.prev().val();
			val++;
			_this.prev().val(val);
		});
	}
	
	//加载商品详情(id=1)
	$.ajax({
		type: "POST",
	    url: goodsinfo,
	    dataType:"json",
	    data:{"id":config.goodId,"uuid":config.uuid,"openId":config.openid},
	    async:false,
		success:function(data){
			if(data.code == 0){
				config.goodId = data.data.id;
				$goshop.attr("shopId",data.data.shopId);
				if(data.data.infoImgs){
					var infoImgsArr = new Array();  
					var infoImgsList = data.data.infoImgs;
					infoImgsArr = infoImgsList.split(',');
					for(var i=0;i<infoImgsArr.length;i++){
						$banner.append('<div class="item"><img src="'+infoImgsArr[i]+'" alt=""></div>');
					}
					$('.item:eq(1)').addClass('active');
					$('.item:eq(0)').remove();
					$('.carousel').carousel();
				}
				
				if(data.data.details){
					var detailsArr = eval(data.data.details);
					for(var i=0;i<detailsArr.length;i++){
						$canshulist.append('<p class="li"><b>'+detailsArr[i].label+':</b><span>'+detailsArr[i].value+'</span></p>');
					}
				}
				if(data.data.detailImgs){
					var detailImgsArr = new Array();  
					var detailImgsList = data.data.detailImgs;
					detailImgsArr = detailImgsList.split(',');
					for(var i=0;i<detailImgsArr.length;i++){
						$detailImgs.append('<img src="'+detailImgsArr[i]+'"/>');
					}
				}
				
				$goodName.text(data.data.name);
				$price.text(data.data.price);
				//extras
				$lowPrice.text(data.data.extras.miniPrice);
				$isFree.text(data.data.extras.freight);
				$sales.text(data.data.extras.sellAmount);
				$address.text(data.data.extras.goodsArea);
				$buluofen.text(data.data.extras.backPoint);
			}
		}
	});
	
	
	
});

