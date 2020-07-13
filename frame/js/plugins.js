/**
 * JavaScript for plugins extends jQuery
 * @author: glint.it@foxmail.com
 * @date: 2020/7/7
 */

jQuery.fn.extend({
	/**
	 * select
	 */
	select : function(options){
		return this.each(function(){
			var $t=$(this).addClass('select').empty();
			var name=options.label;
			if(!name){
				name='请选择...';
			}
			$t.append('<span class="name">'+name+'</span><i class="arr"></i>');
			var $ul=$('<div></div>').appendTo($t);
			$ul.addClass('options');
			var list=options.list;
			for(var i=0,size=list.length;i<size;i++){
				var d=list[i];
				$ul.append('<div class="option" value="'+d.value+'">'+d.label+'</div>');
			}
			//show
			$t.find('span.name').click(function(){
				_show();
			});
			$t.find('i.arr').click(function(){
				_show();
			});
			//select
			var tt=this;
			$ul.find('.option').click(function(){
				var $tt=$(this);
				var val=$tt.attr('value');
				$t.find('span.name').html($tt.text());
				$t.data(val);
				_hide();
			});
			//hide
			$(window).click(function(e){
				var load = $t[0],target = e.target;
				if (load !== target && !$.contains(load, target)) {
					_hide();
				}
			});
			
			function _show(){
				$t.find('i.arr').addClass('slide');
				$ul.show();
			}
			function _hide(){
				$t.find('i.arr').removeClass('slide');
				$ul.hide();
			}
		});
	},
	/**
	 * progress bar
	 */
	progress : function(options){
		return this.each(function(){
			var $this=$(this).addClass("progress");
			if(!options.value){
				options.value='0';
			}
			$this.empty();
			var gap=40;
			if(options.label){
				$this.append('<span class="label">'+options.label+'</span>');
				gap+=40;
			}
			$this.append('<b><i></i></b><span class="percent">'+options.value+'</span>');
			var _w=$this.width()-gap;
			$this.find('b').css('width',_w+'px');
			$this.find('b > i').css('width',options.value);
			if(options.color){
				$this.find('b > i').css('background-color',options.color);
				$this.find('span.percent').css('color',options.color);
			}
		});
	},
	/**
	 * dialog
	 */
	dialog : function(options){
		return this.each(function(){
			var $this=$(this);
			var domid=$this.attr('id');
			if(!domid){
				domid=_getid();
			}
			var mid='msk-'+domid;
			var buf=document.getElementById(mid);
			if(options.close){
				$(buf).hide();
				return;
			}
			if(buf){
				$(buf).show();
			}else{
				var $dom=$('#'+domid);
				var $msk=_mask(mid).append($dom);
				if(options.title){
					$dom.addClass('widthtitle').append('<div class="title">'+options.title+'</div>');
				}
				$dom.append('<span class="close">&times;</span>');
				$dom.addClass('dialog').show();

				$dom.find('span.close').click(function(){
					_close();
				});
				
				$msk.click(function(e){
					var load = $dom[0],target = e.target;
					if (load !== target && !$.contains(load, target)) {
						_close();
					}
				});
			}
			function _close(){
				$msk.hide();
			}
			
			//获取随机字符串
			function _getid(){
				return Math.random().toString(16).substring(2,6);
			}
			//template
			function _mask(id){
				return $(document.body).append('<div class="mask" id="'+id+'"></div>').find('#'+id);
			}
		});
	}
});