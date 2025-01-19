	$(document).ready(function(){
	    $('#hamburger').on('click', function(){
	        $('#sidebar').toggleClass('active');
	        $('#overlay').toggleClass('active');
	    });

	    $('#overlay').on('click', function(){
	        $('#sidebar').removeClass('active');
	        $('#overlay').removeClass('active');
	    });

	    $('#category-toggle-btn').on('click', function () {
	        $('#sidebar').toggleClass('active');
	        $('#overlay').toggleClass('active');
	    });

	    $('#search-form').on('submit', function(e){
	        e.preventDefault();  
	        const keyword = $('#keyword').val().trim();  
	        if(keyword) {
	            const url = contextPath+'/main?keyword=' + encodeURIComponent(keyword) + '&page=1';
	            window.location.href = url;  
	        } else {
	            alert('검색어를 입력해주세요.'); 
	        }
	    });


	    $('#sidebar .nav-link').on('click', function(e){
	        e.preventDefault();  
	        const cateCode = $(this).data('catecode');  
	        if(cateCode) {
	            const url = contextPath+'/main?cateCode=' + encodeURIComponent(cateCode) + '&page=1';
	            window.location.href = url;  
	        }
	    });

	    $('.subcategory-button').on('click', function(){
	        const cateCode = $(this).data('catecode');
	        const url = contextPath+'/main?cateCode=' + encodeURIComponent(cateCode) + '&page=1';
	        window.location.href = url;  
	    });


	    $(window).resize(function () {
	        if ($(window).width() > 767.98) {
	            if ($('#overlay').hasClass('active')) {
	                $('#sidebar').addClass('active'); 
	            }
	            $('#category-toggle-btn').hide();
	        } else {
	            if ($('#overlay').hasClass('active')) {
	                $('#sidebar').addClass('active'); 
	            } else {
	                $('#sidebar').removeClass('active');
	            }
	            $('#category-toggle-btn').show();
	        }
	    }).resize(); 
	    $('#inquiry-link').on('click', function (event) {
	        event.preventDefault();
	        window.open('/inquiry', '문의하기', 'width=800,height=600,scrollbars=yes,resizable=yes');
	    });
	});

