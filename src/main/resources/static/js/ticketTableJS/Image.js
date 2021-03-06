// 立即顯示所選照片
function previewMultiple(event) {
    var images = document.getElementById("images");
    var number = images.files.length;
    document.getElementById("formFile").innerHTML = ""
    for (i = 0; i < number; i++) {
        var urls = URL.createObjectURL(event.target.files[i]);
        document.getElementById("formFile").innerHTML += 
            '<div class="col-sm-4"> <img class="w-100 rounded mb-3" src="' + urls + '" /> </div>';
    }
}

jQuery(document).ready(function($){
	

	
	
    $(function() {
        let contentMax = 200;
        let imagesMax = 3;

  
        function showInvalidText(selector) {
            selector.removeClass('is-valid').addClass('is-invalid');
            selector.siblings('.invalid-feedback').css('display', 'block')
        }
        
        function hideInvalidText(selector) {
            selector.removeClass('is-invalid').addClass('is-valid');
            selector.siblings('.invalid-feedback').css('display', 'none')
        }
        
        $('#itemTb').on('change', function () {
            if ($("form").hasClass('validated')) 
                $('#itemTb').val() == null ? showInvalidText($('#itemTb')) : hideInvalidText($('#itemTb'))
        })
        
        $('#itemId').keyup(function () {
            if ($("form").hasClass('validated')) 
                $('#itemId').val() == '' ? showInvalidText($('#itemId')) : hideInvalidText($('#itemId'))
        })

        $('#userId').keyup(function () {
            if ($("form").hasClass('validated')) 
                $('#userId').val() == '' ? showInvalidText($('#userId')) : hideInvalidText($('#userId'))
        })
        
        // 顯示評論字數
        $("#content").keyup(function(){
            let contentLength = $("#content").val().length;
            $("#content-length").text('('+contentLength+'/'+contentMax+')');
            if (contentLength > contentMax) {
                $('#content-length').removeClass('text-black-50').addClass('text-danger')
            } else {
                $('#content-length').removeClass('text-danger').addClass('text-black-50')
            }
            if ($("form").hasClass('validated')) {
                contentLength > contentMax ? showInvalidText($('#content')) : hideInvalidText($('#content'))				    	
            }
        });
        
        // 顯示上傳照片數量
        $("#images").on("change", function() {
            let imagesLength = $("#images")[0].files.length;
            $('#images-length').text('('+imagesLength+'/'+ imagesMax +')')
            if (imagesLength > imagesMax) {
                $('#images-length').removeClass('text-black-50').addClass('text-danger')
            } else {
                $('#images-length').removeClass('text-danger').addClass('text-black-50')
            }
            if ($("form").hasClass('validated')) {
                imagesLength > imagesMax ? showInvalidText($('#images')) : hideInvalidText($('#images'))				    	
            } 
        });

        
        // 顯示"行程"資訊
        $('#btn-ticket').on('click', function() {
            $.ajax({
                type: 'GET',
                url: 'findItem',
                dataType: 'json',
                data: {
                    "select": "tickets"
                },
                success: function (data) {
                    // 清空tbody內容
                    $("tbody").html('');
                    // ajax回傳資料放到tbody
                    $.each(data, function (i) {
                        let str = "<tr><td style='text-align: center'>行程</td>"+
                                  "<td style='text-align: center'>"+data[i].prod_no+"</td>"+
                                    "<td>"+data[i].prod_name+"</td>"+
                                  "<td class='info' style='text-align:center'><i class='bi bi-info-square'></i></td></tr>";
                        $("tbody").append(str)
                    })
                    // td on click 自動填入
                    $("td").on('click', function() {
                        let id = $(this).closest("tr").find('td').eq(1).html();
                        $("#itemId").val(id);
                        $("#itemTb").val("ticket")
                        // form validation 設定更改
                        if ($("form").hasClass('validated')) {
                            $('#itemTb').val() !== null ? hideInvalidText($('#itemTb')) : showInvalidText($('#itemTb'));
                            $('#itemId').val() !== '' ? hideInvalidText($('#itemId')) : showInvalidText($('#itemId'));
                        }
                    });
                    // info on click 找該商品資訊
                    $('.info').on('click', function() {
                        let row = $(this).closest("tr");        
                        let item = $(row).find('td').eq(0).html();
                        let id = $(row).find('td').eq(1).html();
                        popUpInfo(item, id);
                    });
                    
                },
                error: function () {
                    console.log('error')
                }
            })
        })
    })
})