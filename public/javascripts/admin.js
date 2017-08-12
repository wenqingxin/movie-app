/**
 * Created by Administrator on 2017/7/8 0008.
 */
$(function () {
   $('.del').click(function (e) {
       var target = $(e.target);
       var id = target.data('id');
      $.ajax({
          type:'DELETE',
          url:'/admin/movie/delete?id='+id
      }).done(function (result) {
          if(result.success === 1){
              $('.item-id'+id).remove();
          }
      });
   })

    $('#douban').blur(function () {
        var douban = $(this);
        var id = douban.val();
        if(id){
            $.ajax({
                url:'https://api.douban.com/v2/movie/subject/'+id,
                type:'get',
                dataType:'jsonp',
                cache:true,
                crossDomain:true,
                jsonp:'callback',
                success:function (data) {
                    alert(JSON.stringify(data));
                    $('#inputTitle').val(data.title)
                    $('#inputDirector').val(data.directors[0].name)
                    $('#inputCountry').val(data.countries[0])
                    //$('#inputLanguage').val(data)
                    $('#inputYear').val(data.year)
                    $('#inputSummary').val(data.summary)
                    $('#inputPoster').val(data.images.large)
                    //$('#inputFlash').val(data)
                }
            })
        }
    })
});