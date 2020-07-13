/**
 * a page frame
 * @author: glint.it@foxmail.com
 * @date: 2020/7/7
 */

var frameJs={};
$.extend(frameJs,{
	init : function(){
		this.TAB_WIDTH=105;
		
		var navs=[{id:'1001',pid:'0',text:'基础',icon:'img/nav/1.png'},
				  {id:'1002',pid:'0',text:'表单',icon:'img/nav/2.png'},
				  {id:'1003',pid:'0',text:'数据',icon:'img/nav/3.png'},
				  {id:'1004',pid:'0',text:'弹框',icon:'img/nav/4.png'},
				  {id:'1005',pid:'0',text:'导航',icon:'img/nav/5.png'},
				  {id:'1006',pid:'0',text:'其他',icon:'img/nav/6.png'},
				  {id:'100101',pid:'1001',text:'按钮',url:'pages/btns.html',open:true},
				  {id:'100201',pid:'1002',text:'单选框',url:'pages/radio.html'},
				  {id:'100202',pid:'1002',text:'多选框',url:'pages/checkbox.html'},
				  {id:'100203',pid:'1002',text:'下拉选择框',url:'pages/select.html'},
				  {id:'100204',pid:'1002',text:'开关',url:'pages/switch.html'},
				  {id:'100301',pid:'1003',text:'表格',url:'pages/table.html'},
				  {id:'100302',pid:'1003',text:'完成进度条',url:'pages/progress.html'},
				  {id:'100401',pid:'1004',text:'信息提示框',url:'pages/notify.html'},
				  {id:'100402',pid:'1004',text:'对话框',url:'pages/dialog.html'},
				  {id:'100501',pid:'1005',text:'--',url:''},
				  {id:'100601',pid:'1006',text:'--',url:''}];
		this.loadNavs(navs);
		this.resize();
	},
	//load navigation
	loadNavs : function(list){
		this.navs=list;
		
		//load main navigations
		this.renderNavs(this.getByPid(),$('.navtree'));
		this.action();
	},
	loadSubNavs : function(id,$ct){
		if($ct.html()){
			return;
		}
		this.renderNavs(this.getByPid(id),$ct);
		var tt=this;
		$ct.find('li').click(function(){
			var $t=$(this);
			var text=$t.find('a:first').text();
			tt.openTab($t.data('id'),text,$t.data('url'));
		});
	},
	//render navigation
	renderNavs : function(list,$ct){
		$ct.empty();
		for(var i=0,size=list.length;i<size;i++){
			var data=list[i];
			var $li=$('<li></li>').appendTo($ct);
			var str='<a href="javascript:;">';
			if(data.icon){
				str+='<img src="'+data.icon+'"/>';
			}
			if(data.pid=='0'){//main navigation
				str+='<span>'+data.text+'<span>';
			}else{
				str+=data.text;
			}
			str+='</a>';
			$li.append(str);
			if(data.pid=='0'){
				$li.addClass('mainnav');
				$li.append('<ul class="subnav"></ul>');
			}
			
			if(data.newtab){
				var $a=$li.find('a:first');
				$a.attr('href',data.url).attr('target','_blank');
			}else{
				$li.data('id',data.id).data('url',data.url);				
			}
			if(data.open){
				this.openTab(data.id,data.text,data.url);
			}
		}
	},
	//get nodes by parent id
	getByPid : function(pid){
		if(!pid){
			pid='0';
		}
		var list=this.navs;
		var buf=[];
		for(var i=0,size=list.length;i<size;i++){
			var data=list[i];
			if(data.pid==pid){
				buf.push(data);
			}
		}
		return buf;
	},
	//register actions
	action : function(){
		var tt=this;
		var $lft=$('.leftnav');
		$('.mainnav').click(function(){
			if($lft.hasClass('mini')){
				return;
			}
			var $t=$(this);
			if($t.hasClass('on')){
				return;
			}
			$t.addClass('on').siblings('.mainnav').removeClass('on');
			tt.loadSubNavs($t.data('id'),$t.find('.subnav'));
		});
		
		var timeout;
		$('.mainnav').hover(function(){
			var $t=$(this);
			timeout = window.setTimeout(function(){
				tt.loadSubNavs($t.data('id'),$t.find('.subnav'));				
			},100);
		},function(){
			clearTimeout(timeout);
		});
		
		$('.navtree').find('.mainnav:first').trigger('click');
		
		//navi slide
		$('.navslide').click(function(){
			if($lft.hasClass('mini')){
				$lft.removeClass('mini');
				$('.ct').removeClass('exp');
			}else{
				$lft.addClass('mini');
				$('.ct').addClass('exp');
			}
		});
	},
	resize : function(){
		var h=$(window).height();
		h-=50;
		$('.ct').css('height',h+'px');
		h-=40;
		$('.iframe-page').css('height',h+'px');
		this.frameHeight=h;
	},
	/********* tab operation ***********/
	openTab : function(id,text,url){
		if(!url){
			return;
		}
		var tt=this;
		var $tab=$('.page-title'),$ct=$('.ct');
		var $item=$tab.find('#tab'+id);
		var $iframe=$ct.find('#iframe'+id);
		
		if(!$item.length){
			var w=$tab.width();
			$tab.width(w+this.TAB_WIDTH);
			
			$item=$('<span></span>').appendTo($tab);
			$item.attr('id','tab'+id);
			$item.append(text).append('<i></i>');
			$item.data('data',{id:id,text:text,url:url});
			
			$item.click(function(){
				var d=$(this).data('data');
				tt.openTab(d.id,d.text,d.url);
			});
			$item.find('i:first').click(function(){
				var d=$(this).parent('span').data('data');
				tt.closeTab(d.id);
			});

			//append iframe
			$iframe=$(this.getIframe(url)).appendTo($ct);
			$iframe.attr('id','iframe'+id);
			$iframe.css('height',this.frameHeight+'px');
		}
		
		$item.addClass('on').siblings('span').removeClass('on')
		$iframe.show().siblings('.iframe-page').hide();
		
		this.setTabPos($tab[0],$item[0]);
	},
	closeTab : function(id){
		var $tab=$('.page-title'),$ct=$('.ct');
		var $item=$tab.find('#tab'+id);
		var $iframe=$ct.find('#iframe'+id);
		var idx=-1;
		if($item.hasClass('on')){
			idx=$item.index();
		}
		$item.remove();
		$iframe.remove();
		if(idx!==-1){
			idx--;
			if(idx<0){
				idx=0;
			}
			var $buf=$tab.find('span').eq(idx);
			var d=$buf.data('data');
			if(d){
				this.openTab(d.id,d.text,d.url);	
			}
		}
		var w=$tab.width()-this.TAB_WIDTH;
		w=w<0?0:w;
		$tab.width(w);
		this.setTabPos($tab[0]);
	},
	setTabPos : function(tab,item){
		var base=$('.ct')[0].getBoundingClientRect();
		var tabp=tab.getBoundingClientRect();

		var offset=-1;
		
		if(item){ //open
			var itemp=item.getBoundingClientRect();
			//need to move right
			if(itemp.left < base.left){
				offset=tabp.left-itemp.left+110;
			}
			//need to move left
			if(itemp.right > base.right){
				offset=tabp.left-base.left+base.right-itemp.right-5;
			}			
		}else{ //close, just need to move right
			if(tabp.right < base.right){
				offset=base.right-tabp.right-base.left+tabp.left
			}
		}
		if(offset>0){
			offset=0;
		}
		if(offset!==-1){
			tab.style.transform='translateX('+offset+'px)';			
		}
	},
	getIframe : function(url){
		if(!url){
			url='pages/test.html';
		}
		return '<iframe class="iframe-page" frameborder="0" marginwidth="0" src="'+url+'"></iframe>';
	}
});

$(function(){
	frameJs.init();
});

//public
function openTab(id,name,url){
	frameJs.openTab(id,name,url);
};