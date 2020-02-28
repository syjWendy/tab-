;(function($) {
    "use strict"
    $.fn.extend({
        initDefineTab:function(options) {    
            //参数配置
            var defineTab = function(options){
                var self = this;
                self.options = options
                self.ParElelement = options.ParElelement
                self.id = options.id
                self.title = options.title
                self.url = options.url
                self.init(options) 
                Object.assign(self.options,options);
            }
            
            defineTab.prototype = {
                //初始化
                init: function() {
                    // this.loadContDiv();
                    // this.addContDiv();
                    this.tabClick();
                    this.addTab();
                    this.changeTab()
                    this.delTab()
                    this.scrollTabLeft()
                    this.scrollTabRight()
                },
                //点击标签
                tabClick: function(id) {
                    if(id){
                        let choicedId = $(".tab-list").find(".active").attr("data-tabid")
                        let minIfExit = $(".tab-list").css("display")
                        if(choicedId){
                            let choicedDiv = $("#cont_"+choicedId).find("#iframe-page-content")
                            this.changeFrameHeight(choicedDiv[0],138)
                        }
                        $(".tab-list").find('li').removeClass("active");
                        $("#tab_"+id).addClass("active");
                        this.loadContDiv(id)
                    }
                },
                //加载对应的div的显示内容
                loadContDiv: function(id) {
                    // let tabId = getContDivId(id); 
                    $("#cont_"+id).siblings().hide();
                    $("#cont_"+id).show()
                },
                //显示内容的div
                addContDiv: function(id,url) {
                    //this.height=this.contentWindow.document.documentElement.scrollHeight
                    var self = this;
                    let contHtml = `
                        <div id=cont_${id} class="tab-pane" data-contId=${id}>
                            <iframe id="iframe-page-content" src="${url}" width="100%" onload="this.height=${self.changeFrameHeight($(this),138)}"  name="targetText" frameborder="0" frameborder="0" marginheight="0" marginwidth="0"></iframe>
                        </div>  
                    `
                    let elements = $(self.ParElelement)
                    elements.append(contHtml)
                    self.loadContDiv(id)
                },
                //添加标签
                addTab: function(options) {
                    var self = this;                    
                    var $id = self.id;
                    var $title = self.title;
                    var $url = self.url;
                    //判断标签是否已存在，若已存在，则激活该标签，否则新增标签
                    let flag = true
                    let lists = $('.tab-list').children('li')
                    $(".tab-list li").each(function(index,item) {
                        let value = $(this).attr("data-tabid")
                        if($id === value){
                            flag = false;
                        }
                    })
                    if(flag===false){
                        //标签已存在，激活
                        self.tabClick($id)
                    }else{
                        let tabHtml =
                        //拼接tab标签栏的
                        `
                            <li id='tab_${$id}' class='active' data-tabId=${$id}>
                                <span>${$title}</span>
                                <i class="close_gray"></i>
                            </li>
                        `
                        $('.tab-list').append(tabHtml)
                        self.tabClick($id)
                        lists.length++
                        if(lists.length > 1){
                            $('.tab_card').show()
                        }
                        self.addContDiv($id,$url) 
                        
                    }
                    if(self.isBeyond()==true){
                        self.scrollTab()
                    } 
                },
                //切换标签
                changeTab: function() {
                    var self = this
                    $('.tab-list').on('click','li',function(params) {
                        let tabId = $(this).attr('data-tabid')
                        self.tabClick(tabId)
                        // loadContDiv(tabId)
                    })
                },

                //关闭标签
                delTab: function() {
                    let self = this
                    //关闭标签时，如果前一个存在，让前一个显示
                    $('.tab-list li').on('click','i',function(params) {
                        let lists = $('.tab-list').children('li')
                        //获取tab的id
                        var dataId = $(this).parent().attr('data-tabid')
                        let tab_this = $(this).parent()
                        let isActive = $(this).parent().hasClass("active")
                        if(isActive){
                            if(tab_this.prev().is("li")){
                                tab_this.prev().click();
                            }else if(tab_this.next().is("li")){
                                tab_this.next().click()
                            }
                        }
                        tab_this.remove()
                        let contDiv = $('#cont_'+ dataId)
                        let removeDiv = contDiv.remove()
                        if(removeDiv.length){
                            lists.length--
                            if(lists.length <= 1){
                                $('.tab_card').hide()
                                let contentDiv =  $(self.ParElelement).children(".tab-pane").children('#iframe-page-content')
                                contentDiv.each((index,item)=>{
                                    self.changeFrameHeight(item,95)
                                })
                            }
                        }
                        //考虑关闭之后，标签滚动的问题
                        self.scrollTabRightFun()
                    })
                },

                //点击右侧按钮，左滚动标签,查看右侧隐藏的标签
                scrollTabLeft: function(params) {
                    let self = this
                    $(".tab_left").on("click",function(){
                        let ul = $(".tab-list");
                        let contanier = $(".tab-wrap").width();
                        let liWidth = $(".tab-list").children().last().outerWidth();
                        let ulMarinLeft = parseInt(ul.css("margin-left"));
                        let lisWidth = self.getAllTabWidth();
                        if(lisWidth + ulMarinLeft > contanier){
                            ul.animate({
                                "margin-left" : ulMarinLeft + lisWidth - contanier > liWidth ? ulMarinLeft - liWidth : ulMarinLeft -(ulMarinLeft + lisWidth - contanier) 
                            })
                        }else{
                            return;
                        }
                    })
                },

                //点击左侧按钮，右滚动标签，查看左侧隐藏的标签
                scrollTabRight: function(params) {
                    var self = this
                    $(".tab_right").on("click",function(){
                        self.scrollTabRightFun()
                    })
                },
                //右滚动封装
                scrollTabRightFun : function(){
                    let ul = $(".tab-list");
                    // let contanier = $(".tab-wrap").width();
                    let liWidth = $(".tab-list").children().last().outerWidth();
                    // let lisWidth = that.getAllTabWidth();
                    let ulMarginLeft =parseInt(ul.css("margin-left"));
                    if(ulMarginLeft < 0){
                        ul.animate({
                            "margin-left" : Math.abs(ulMarginLeft) > liWidth ? ulMarginLeft + liWidth : 0
                        }) 
                    }else{
                        return;
                    }
                },
                
                //滚动事件
                scrollTab: function(id){
                    let ul = $(".tab-list");
                    let marginLeft = parseInt(ul.css("margin-left"));
                    let contanierWidth = $(".tab-wrap").width();
                    let liWidth = this.getAllTabWidth();
                    let newLeft = contanierWidth - liWidth;
                    ul.animate({
                        "margin-left":newLeft
                    })
                },

                //判断标签的总长度是否超过整个的宽度
                isBeyond: function(){
                    let contanierWidth = $(".tab-wrap").width();
                    let lisWidth = this.getAllTabWidth();
                    return lisWidth > contanierWidth
                },

                //获取全部tab的长度
                getAllTabWidth: function(){
                    let liWidth = 0;
                    let lis = $(".tab-list li")
                    $.each(lis,function(i,li){
                        liWidth += $(li).outerWidth();//outerWidth()返回元素的宽高 + padding + border
                    });
                    return liWidth;
                },
                //设置iframe高度
                changeFrameHeight:function(elementId,otherHeight){
                    elementId.height=document.documentElement.clientHeight-otherHeight;
                    return elementId.height;
                },
            }

            return new defineTab(options)

        }
    })
    
})(jQuery)