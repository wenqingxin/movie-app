/**
 * Created by Administrator on 2017/7/8 0008.
 */
$(function () {
    $('.comment').click(function (e) {
        var target = $(this);
        var toId = target.data('tid');
        var commentId = target.data('cid');
        if($('#toId').length > 0){
            $('#toId').val(toId);
        }else{
            $('<input>').attr({
                type:'hidden',
                id:'toId',
                name:'tid',
                value:toId
            }).appendTo('#commentForm');
        }

        if($('#commentId').length > 0){
            $('#commentId').val(commentId)
        }else{
            $('<input>').attr({
                id:'commentId',
                type:'hidden',
                name:'cid',
                value:commentId

            }).appendTo('#commentForm');
        }
    })
});