var GamePrefix = "GF"
var Server     = 1
var mainTimer ;

$.ajaxSetup({
  crossDomain:true
});


$(document).ready(function(){
  mainTimer = setInterval(function(){exec();},1000);
  // 避免GAME亂傳資料
  Game.reportError = function(msg, url, line, column, err){
    console.info(msg)
    console.info(url)
    console.info(line)
    console.info(column)
    console.info(err)
  }
})

function exec(){
  if($(".txt-battle").length>0 && true){
      // 顯示隱藏的hp
      if($(".txt-hp-value.hide-hp").length>0){
        $(".txt-hp-value.hide-hp").attr("class","txt-hp-value")
      }

      if(typeof(window.stage.gGameStatus)=="object"){
        if(typeof(window.stage.gGameStatus.boss)=="object"){
          if(typeof(window.stage.gGameStatus.boss.param)=="object"){
            var thisData = window.stage.gGameStatus.boss.param
            var bossHtml  = ""
            for(var i=0;i<thisData.length;i++){
              var hpmax   = thisData[i].hpmax
              var hp      = Math.round(thisData[i].hp)
              var monster = thisData[i].name
              var attr    = thisData[i].attr
              bossHtml     += '<div>'
              bossHtml     += '<img src="http://kh.solamimi.org/GF/type' + attr + '.png" border=0 style="margin: 0px 0px -2px 0px;width:10px;">'
              bossHtml     += monster
              bossHtml     += " "
              bossHtml     += hp + "/" + hpmax + " " + Math.round((hp/hpmax)*100) + '%'
              bossHtml     += '</div>'
            }

            if($(".prt-raid-info").length<1){
                $(".prt-remain-time").after('<div class="prt-raid-info">'+ bossHtml + '</div>')
            }else{
              $(".prt-raid-info").html(bossHtml)
            }

            if(thisData.length>1){
              $(".prt-raid-info").css({
                 "margin"           : "26px 0px 0px 18px"
                ,"padding"          : "0px 5px 0px 0px"
                ,"font-size"        : "9px"
                ,"color"            : "white"
                ,"background"       : "rgba(0, 0, 0, 0.5)"
                ,"width"            : "250px"
                ,"height"           : 10 * i + "px"
                ,"text-align"       : "right"
                ,"border-radius"    : "25px 25px 25px 25px / 25px 25px 25px 25px"
              })
            }else{
              $(".prt-raid-info").css({
                 "margin"           : "76px 0px 0px 40px"
                ,"padding"          : "0px 5px 0px 0px"
                ,"font-size"        : "9px"
                ,"color"            : "white"
                ,"background"       : "rgba(0, 0, 0, 0.5)"
                ,"width"            : "237px"
                ,"height"           : 10 * i + "px"
                ,"text-align"       : "right"
                ,"border-radius"    : "25px 25px 25px 25px / 25px 25px 25px 25px"
              })
            }
          }
        }
      }
  }
}

