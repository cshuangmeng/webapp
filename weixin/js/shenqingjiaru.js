$(function(){
	var $joinBtn = $('#js-joinBtn'),
		$tipContent = $('#js-tipContent'),
		$qiyemingcheng = $('#qiyemingcheng'),
		$qiyewangzhi = $('#qiyewangzhi'),
		$zhudachanpin = $('#zhudachanpin'),
		$chanpinyoushi = $('#chanpinyoushi'),
		$lianxiren = $('#lianxiren'),
		$lianxifangshi = $('#lianxifangshi');
	
	var config = {};
	//share
	share('21','','','');
	//关闭弹框
	hideTip();
	$joinBtn.click(function(){
		config.company = $qiyemingcheng.val();
		config.website = $qiyewangzhi.val();
		config.product = $zhudachanpin.val();
		config.advantage = $chanpinyoushi.val();
		config.contact = $lianxiren.val();
		config.telephone = $lianxifangshi.val();
		if(config.company && config.website && config.product && config.advantage && config.contact && config.telephone){
			$.ajax({
			    type: "POST",
			    url: shopcooperate,
			    data:{"company":config.company,"website":config.website,"product":config.product,"advantage":config.advantage,"contact":config.contact,"telephone":config.telephone},
			    dataType:"json",
			    async:false,
			    success: function(data){
			    	if(data.code == 0){
			    		$tipContent.text('信息提交成功！');
						showTip();
			    	}else{
			    		$tipContent.text(data.msg);
						showTip();
			    	}
			    }
			});
		}else if(!config.company){
			$tipContent.text('请输入企业名称！');
			showTip();
		}else if(!config.website){
			$tipContent.text('请输入企业网址！');
			showTip();
		}else if(!config.product){
			$tipContent.text('请输入主打产品！');
			showTip();
		}else if(!config.advantage){
			$tipContent.text('请输入产品优势！');
			showTip();
		}else if(!config.contact){
			$tipContent.text('请输入联系人姓名！');
			showTip();
		}else if(!config.telephone){
			$tipContent.text('请输入联系方式！');
			showTip();
		}
	});
});
