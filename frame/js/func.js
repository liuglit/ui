/**
 * functions
 * @author: glint.it@foxmail.com
 * @date: 2020/7/7
 */
var func={};

$.extend(func,{
	/**
	 * short message
	 */
	tip : function(text){
		var $tip=$(document.body).append('<div class="tip">'+text+'</div>').find('.tip');
		window.setTimeout(function(){
			$tip.remove();
		},3000);
	},
	/**
	 * notification
	 */
	notify : {
		list:[],
		seed:1,
		alert : function(text){
			var dom= document.createElement('div');
			dom.id='notification_'+this.seed++;
			dom.innerHTML=text;
			dom.className='notification';
			document.body.appendChild(dom);
			
			var close=document.createElement('span');
			close.className='close';
			close.innerHTML='&times;';
			dom.appendChild(close);
			var tt=this;
			setTimeout(function(){
				dom.style.bottom=tt.getPosition()+'px';
			    tt.list.push(dom);
			    tt.startTimer(dom);
			},20);
			close.onclick=function(){
			    tt.close(dom);
			}
		},
		startTimer : function(dom){
			var tt=this;
		    this.timer=setTimeout(function(){
		        tt.close(dom);
		    },5000);
		},
		getPosition : function(){
			var size=this.list.length;
	        return (size+1)*15+size*80;
		},
		close : function(dom){
			if(!dom || !dom.parentNode){
		         return;
		    }
		    dom.parentNode.removeChild(dom);
		    var list=this.list;
		    for(var i=0,size=list.length;i<size;i++){
		        var d=list[i];
		        if(d.id==dom.id){
		             list.splice(i, 1);
		             break;
		        }
		    }
		    this.reset();
		},
		reset : function(){
			var list=this.list;
		    for(var i=0,size=list.length;i<size;i++){
		        var d=list[i];
		        d.style.bottom=(i+1)*15+i*80+'px';
		    }
		}
	}
});