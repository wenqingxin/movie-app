/**
 * Created by Administrator on 2017/8/28 0028.
 */
$('#test1').on('click',function () {
   $.ajax({
       url: '/cookie',
       type: 'post',
       success: function (res){
           //alert(JSON.stringify(res));
       }
   })
})