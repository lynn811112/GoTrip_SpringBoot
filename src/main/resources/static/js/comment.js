

function saveComment(e) {
    Swal.fire({
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
    })
}

jQuery(document).ready(function ($) {
	
    // const settings = {
    //     "async": true,
    //     "crossDomain": true,
    //     "url": "https://car-data.p.rapidapi.com/cars/years",
    //     "method": "GET",
    //     "headers": {
    //         "X-RapidAPI-Key": "05d771cdbemshe143263788b0713p19cda0jsn7c44fa1258b1",
    //         "X-RapidAPI-Host": "car-data.p.rapidapi.com"
    //     }
    // };

    // $.ajax(settings).done(function (response) {
    //     console.log(response);
    // });
	
    // 立即顯示多張照片 - 評論
    $('#imagefiles').on('change', function () {
        var imagefiles = document.getElementById("imagefiles");
        var number = imagefiles.files.length;
        document.getElementById("formFile").innerHTML = ""
        for (i = 0; i < number; i++) {
            var urls = URL.createObjectURL(event.target.files[i]);
            document.getElementById("formFile").innerHTML +=
                '<div class="col-12 mb-3"> <img class="rounded mb-3" src="' + urls + '" /> </div>';
            processImageFile(event.target.files[i]);
			
        }
    })

	// 立即顯示多張照片 - 租車
    $('#carImage').on('change', function () {
        var imagefiles = document.getElementById("carImage");
        var number = imagefiles.files.length;
        document.getElementById("formFileCar").innerHTML = ""
        for (i = 0; i < number; i++) {
            var urls = URL.createObjectURL(event.target.files[i]);
            document.getElementById("formFileCar").innerHTML +=
                '<div class=""> <img class=" mb-3" src="' + urls + '" /> </div>';
        }
    })

    function processImageFile(imageObject) {
            //確認區域與所選擇的相同，因為使用免費的，所以區域選West Center US
        var uriBase = "https://computer-vision-lynn.cognitiveservices.azure.com/vision/v2.1/analyze";
        
        var params = {
            "visualFeatures": "Adult",
            "details": "",
            "language": "en",
        };
        //顯示分析的圖片
		let result = true;
        //送出分析
        $.ajax({
            url: uriBase + "?" + $.param(params),
            // Request header
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "6f158e623cca4015bc077bf379c7186d");
            },
            type: "POST",
            processData:false,
            contentType:false,
            // Request body
            data: imageObject
        })
        .done(function(data) {
            //顯示JSON內容
            
            if (data.adult.isAdultContent == true || data.adult.isRacyContent == true ||  data.adult.isGoryContent == true) {
                console.log('請勿上傳色情、暴力或任何包含成人內容的圖片')
                $('#isAdult').css('display', 'block');
            } else {
            	hideInvalidText($('#formFile'));
            	$('#isAdult').css('display', 'none');
			}

        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            //丟出錯誤訊息
//            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
//            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
//            alert(errorString);
        });
    };




    let contentMax = 200;
    let imagefilesMax = 3;

    $(function () {

        let contentLength = $("#content").val().length;
        $("#content-length").text('(' + contentLength + '/' + contentMax + ')');

        // 確認表單內容
        $('#btn-insert').click(function (e) {
            let isItemTbValid = $('#itemTb').val() !== 'no';
            let isItemIdVaild = $('#itemId').val() !== '';
            let isUserIdVaild = $('#userId').val() !== '';
            let isContentVaild = $("#content").val().length <= contentMax;
            let isimagefilesVaild = $("#imagefiles")[0].files.length <= imagefilesMax;

            if (!isItemTbValid || !isItemIdVaild || !isUserIdVaild || !isContentVaild || !isimagefilesVaild) {
                e.preventDefault();
                isItemTbValid ? hideInvalidText($('#itemTb')) : showInvalidText($('#itemTb'));
                isItemIdVaild ? hideInvalidText($('#itemId')) : showInvalidText($('#itemId'));
                isUserIdVaild ? hideInvalidText($('#userId')) : showInvalidText($('#userId'));
                isContentVaild ? hideInvalidText($('#content')) : showInvalidText($('#content'));
                isimagefilesVaild ? hideInvalidText($('#imagefiles')) : showInvalidText($('#imagefiles'));
                $("form").addClass('validated');
            } else {
                e.preventDefault();
                Swal.fire({
                    icon: 'success',
                    title: '儲存成功',
                    showConfirmButton: false,
                    timer: 1500
                });

                setInterval(function () {
                    $('#insertForm').submit()
                }, 1500);
            }
        })
    });

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
    $("#content").keyup(function () {
        let contentLength = $("#content").val().length;
        $("#content-length").text('(' + contentLength + '/' + contentMax + ')');
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
    $("#imagefiles").on("change", function () {
        let imagefilesLength = $("#imagefiles")[0].files.length;
        $('#images-length').text('(' + imagefilesLength + '/' + imagefilesMax + ')')
        if (imagefilesLength > imagefilesMax) {
            $('#images-length').removeClass('text-black-50').addClass('text-danger')
        } else {
            $('#images-length').removeClass('text-danger').addClass('text-black-50')
        }
        if ($("form").hasClass('validated')) {
            imagefilesLength > imagefilesMax ? showInvalidText($('#imagefiles')) : hideInvalidText($('#imagefiles'))
        }
    });


    // 顯示商品資訊
    $('.btn-select').on('click', function () {
        let itemTb = $(this).attr('value');
        let mapping = "";
        if (itemTb == 'hotels') {
            mapping = 'hotel/'
        }
        $.ajax({
            type: 'GET',
            url: '/gotrip/' + mapping + 'api/' + itemTb,
            dataType: 'json',
            success: function (data) {
                // 清空tbody內容
                $("tbody").html('');
                let str = "";
                // ajax回傳資料放到tbody
                $.each(data, function (i) {
                    if (itemTb == 'tickets') {
                        str = "<tr>" +
                            "<td style='text-align: center' value='tickets'>景點行程</td>" +
                            "<td style='text-align: center'>" + data[i].ticketNo + "</td>" +
                            "<td>" + data[i].ticketName + "</td>" +
                            "<td class='info' style='text-align:center'><i class='ti-info-alt'></i></td>" +
                            "</tr>";
                    } else if (itemTb == 'hotels') {
                        str = "<tr>" +
                            "<td style='text-align: center' value='tickets'>飯店住宿</td>" +
                            "<td style='text-align: center'>" + data[i].id + "</td>" +
                            "<td>" + data[i].hotel_name + "</td>" +
                            "<td class='info' style='text-align:center'><i class='ti-info-alt'></i></td>" +
                            "</tr>";
                    } else if (itemTb == 'cars') {
						str = "<tr>" +
                            "<td style='text-align: center' value='tickets'>租車車款</td>" +
                            "<td style='text-align: center'>" + data[i].id + "</td>" +
                            "<td>" + data[i].makeEn + "</td>" +
                            "<td>" + data[i].model + "</td>" +
                            "<td class='info' style='text-align:center'><i class='ti-info-alt'></i></td>" +
                            "</tr>";
					}
                    $("tbody").append(str)
                })
                // td on click 自動填入
                $("td").on('click', function () {
                    let id = $(this).closest("tr").find('td').eq(1).html();
                    $("#itemId").val(id);
                    $("#itemTb").val(itemTb)
                    // form validation 設定更改
                    if ($("form").hasClass('validated')) {
                        $('#itemTb').val() !== null ? hideInvalidText($('#itemTb')) : showInvalidText($('#itemTb'));
                        $('#itemId').val() !== '' ? hideInvalidText($('#itemId')) : showInvalidText($('#itemId'));
                    }
                });
                // info on click 找該商品資訊
                $('.info').on('click', function () {
                    let row = $(this).closest("tr");
                    let id = $(row).find('td').eq(1).html();
                    popUpInfo(itemTb, id);
                });

            },
            error: function () {
                console.log('error')
            }
        })
    })



    function popUpInfo(itemTb, itemId) {
	    let mapping = "";
        if (itemTb == 'hotels') {
            mapping = 'hotel/'
        }
        $.ajax({
            type: 'GET',
            url: '/gotrip/' + mapping + 'api/' + itemTb + '/' + itemId,
            dataType: 'json',
            success: function (data) {
                let itemInfo;
                if (itemTb == "tickets") {
                    itemInfo = "<table class='text-left'><colgroup><col span='1' style='width: 20%;'><col span='1' style='width: 80%;'>" + 
                    	"<tbody><tr><td>商品項目：</td><td>景點票券</td></tr>" +
                        "<tr><td>商品類型：</td><td>" + data.tagName +"</td></tr>" +
                        "<tr><td>商品編號：</td><td>" + data.ticketNo +"</td></tr>" +
                        "<tr><td>商品名稱：</td><td>" + data.ticketName +"</td></tr>" +
                        "<tr><td>商品價格：</td><td>NT$" + data.price +"</td></tr>" +
                        "<tr><td>電話：　　</td><td>" + data.phone +"</td></tr>" +
                        "<tr><td>地址：　　</td><td>" + data.city + data.location + data.address+"</td></tr>" +
                        "<tr><td>商品簡述：　　</td><td>" + data.ticketIntro +"</td></tr></tbody></table>" ;
                } else if (itemTb == "hotels") {
					 itemInfo = "<table class='text-left'>" + 
                    	"<tbody><tr><td>商品項目：</td><td>飯店住宿</td></tr>" +
                        "<tr><td>商品類型：</td><td>" + data.hotelStyle +"</td></tr>" +
                        "<tr><td>商品編號：</td><td>" + data.id +"</td></tr>" +
                        "<tr><td>商品名稱：</td><td>" + data.hotel_name +"</td></tr>" +
                        "<tr><td>商品價格：</td><td>NT$" + data.price +"</td></tr>" +
                        "<tr><td>電話：　　</td><td>" + data.phone +"</td></tr>" +
                        "<tr><td>地址：　　</td><td>" + data.city + data.fullAddress +"</td></tr>" +
                        "<tr><td>商品簡述：　　</td><td>飯店設備 - " + data.provide +"</td></tr></tbody></table>" ;
				}
                //                    else if (String(parsed.tableName) == "行程") {
                //                        itemInfo = "商品項目：" + parsed.tableName +
                //                            "<br>商品編號：" + parsed.itemId +
                //                            "<br>商品名稱：" + parsed.itemName +
                //                            "<br>商品價格：NT$" + parsed.price +
                //                            "<br>電話：　　" + parsed.phone +
                //                            "<br>地址：　　" + parsed.city + parsed.district + parsed.address +
                //                            "<br>商品介紹：<br>" + parsed.info;
                //                    }
                Swal.fire({
                    html: '<div class="text-dark text-start small">' + itemInfo + '</div>',
                    // width: 800,
                    confirmButtonColor: '#FF8D29',
                })
            },
            error: function () {
                console.log('error')
            }
        })
    }



})


