define(['jquery','template'],function($,tpl){
	var hotelTpl = 
			"<%for(var i = 0; i<hotel_list.length; i++) { %>"+	
					"<div class='hotel_rows'>"+
						"<a href='#'>"+
							"<dl>"+
								"<dt>"+
									"<img src='../<%= hotel_list[i].image %>' alt=''>"+
								"</dt>"+
								"<dd>"+
									"<h2><%= hotel_list[i].name %></h2>"+
									"<ul>"+
										"<li class='pf'>4.5分</li>"+
										"<li>礼</li>"+
										"<li>促</li>"+
										"<li>返</li>"+
									"</ul><br/>"+
									"<p><%= hotel_list[i].stars %>级<img src='../img/icon-wifi.png'><img src='../img/icon-park.png'></p>"+
									"<address><%= hotel_list[i].addr %><span><%= hotel_list[i].distance %>km</span></address>"+
								"</dd>"+
							"</dl>"+
							"<p class='hotel_money'>￥<%= hotel_list[i].low_price %><b>起</b></p>"+
						"</a>"+
					"</div>"+
			"<% } %>";
	var render = tpl.compile(hotelTpl);
	$.when($.ajax('../data/hotel.json'))
	.then(function(data){
		//console.log(data.result);
		var html = render(data.result);
		$(".hotel_list").html(html);
	}),function(err){
		console.log(err);
	};

	//滑框筛选操作
    var filter = function(data){
        this.data = data;
        this.domWrap = document.querySelector('.filter');
        this.init();
        this.render();
        this.bindEvent();
    };
    filter.prototype={
        tpl:{
            range:'<p class="unlimited active" data-flag="1"><span class="left">由近到远</span><span class="checkbox checked right"></span></p><p data-flag="2"><span class="left">由远到近</span><span class="checkbox right"></span></p>',
            price:'<p class="unlimited active"><span class="left">不限</span><span class="checkbox checked right"></span></p><p><span class="left">100以下</span><span class="checkbox right"></span></p> <p><span class="left">100-200</span><span class="checkbox right"></span></p> <p><span class="left">200-300</span><span class="checkbox right"></span></p> <p><span class="left">300以上</span><span class="checkbox right"></span></p>',
            brand:'',
            star:'<p class="unlimited active" star = "0"><span class="left">不限</span><span class="checkbox checked right"></span></p> <p star = "二星"><span class="left">二星及以下</span><span class="checkbox right"></span></p> <p star = "三星"><span class="left">三星</span><span class="checkbox right"></span></p> <p star = "四星"><span class="left">四星</span><span class="checkbox right"></span></p> <p star = "五星"><span class="left">五星</span><span class="checkbox right"></span></p>'
        },
        init:function(){
            var str ='<p class="unlimited active"><span class="left">不限</span><span class="checkbox checked right"></span></p>';
            this.data.brand.forEach(function(v){
                str+='<p><span class="left">'+v+'</span><span class="checkbox right"></span></p>'
            });
            this.tpl.brand ='<div class="scroller">'+str+'</div>';
        },
        render:function(){
            for(var i in this.tpl){
                 $(this.domWrap).append($('<div class="act-area '+i+'" data = "'+i+'"></div>').html(this.tpl[i]));
            }
     
        },
        bindEvent:function(){
            var actArea = $(this.domWrap).find('.act-area'),that =this;
            actArea.on('click','p',function(){
                if($(this).hasClass('unlimited')){
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                }else{
                    $(this).addClass('active').siblings('.unlimited').removeClass('active');

                }
                that.filterMethod(that.flag,$(this).attr('data-flag'));
            });
            $(this.domWrap).next().on('click',function(){
                
                that.hide();
            })
        },
        filterMethod:function(type,flag){
            var allli = $('.hotel_list').find('div'),arr=[];
            allli.each(function(i,v){
                arr.push({
                    datadis: $(this).attr('data-dis'),
                    dom: v
                })
            });

            if(type=='range'){
                arr.sort(function(a,b){
                    if(a.datadis*1> b.datadis*1){
                        return 1
                    }else if(a.datadis*1< b.datadis*1  ){
                        return -1
                    }else{
                        return 0;
                    }
                });
                if(flag != '1'){
                    arr = arr.reverse();
                }
                var str ='';
                arr.forEach(function(v,i){
                    str+= v.dom.outerHTML
                });
                $('.hotel_list').html(str);
            }else
            if(type == 'price'){

            }
        },
        hide:function(){
            this.domWrap.className = this.domWrap.className.replace('filter-show','filter-hide');
            $(this.domWrap).next().addClass('hide');
        },
        show:function(flag){
            this.flag = flag;
            $(this.domWrap).next().removeClass('hide');
            this.domWrap.className = this.domWrap.className.replace('filter-hide','filter-show');

            /*var tmpDom = $(this.domWrap).find('div');
            tmpDom.html(this.tpl[flag]);*/
            $(this.domWrap).find('.'+flag).addClass('area-show').siblings().removeClass('area-show')
        }
    };
    var Filter = new filter({
        brand: ['汉庭酒店','和颐酒店','希尔顿酒店','四季酒店','如家酒店','7天酒店','格林豪泰酒店','金叶子大酒店','云怡大酒店','檀驿栈酒店']
    });
     $('.bottom-bar').on('click','li',function(){

        if($(this).hasClass('high')){
            $(this).removeClass('high');
            Filter.hide();
        }else{
            $(this).addClass('high').siblings().removeClass('high');
            var data = $(this).attr('data');
            Filter.show(data);
        }

    });
    $('.star').on('click','p',screencheck);
    function screencheck(){
        if($(this).hasClass('unlimited')){
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        }else{
            $(this).addClass('active').siblings('.unlimited').removeClass('active');

        }
        var str="";
        $('.star').find('.active').each(function(i,v){
            console.log($(this).attr('star'))
            if($(this).attr('star')==0){
                str='[star],'
            }else{
                str+='[star="'+$(this).attr('star')+'"],';
            }
            
        })
        filter_1(str.substr(0,str.length-1));
    }

    function filter_1(str){
        var dls=$('.hotel_list div').show();
        console.log(str);
        dls.not(str).hide();
    }
});
