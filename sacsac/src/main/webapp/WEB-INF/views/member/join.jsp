<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!-- <link rel="stylesheet" href="/resources/css/member/join.css"> -->
	<%@include file="../../views/includes/header.jsp"%>
	
	<div class="container mt-5">
        <div class="row">
            <div class="col-md-6">
                <h2 class="mb-4">회원가입</h2>
				<form id="join_form" method="post">
					<!-- form 의 id값과 post방식인것을 명시 -->
			 		<div class="form-group">
                        <label for="userId">아이디</label>
							<div class="id_input_box">
								<input class="id_input" name="memberId" class="form-control" placeholder="아이디를 입력하세요">
							</div>
							<span class="id_input_re_1">사용 가능한 아이디입니다.</span>
							<span class="id_input_re_2">아이디가 이미 존재합니다.</span> <span
								class="final_id_ck">아이디를 입력해주세요.</span>
						</div>
						<div class="form-group">
                        <label for="password">비밀번호</label>
							<div class="pw_input_box">
								<input type="password" class="pw_input" name="memberPw" placeholder="비밀번호를 입력하세요">
							</div>
							<span class="final_pw_ck">비밀번호를 입력해주세요.</span>
						</div>
						<div class="pwck_wrap">
							<div class="pwck_name">비밀번호 확인</div>
							<div class="pwck_input_box">
								<input class="pwck_input">
							</div>
							<span class="final_pwck_ck">비밀번호 확인을 입력해주세요.</span> <span
								class="pwck_input_re_1">비밀번호가 일치합니다.</span> <span
								class="pwck_input_re_2">비밀번호가 일치하지 않습니다.</span>
						</div>
						<div class="user_wrap">
							<div class="user_name">이름</div>
							<div class="user_input_box">
								<input class="user_input" name="memberName">
							</div>
							<span class="final_name_ck">이름을 입력해주세요.</span>
						</div>
						<div class="mail_wrap">
							<div class="mail_name">이메일</div>
							<div class="mail_input_box">
								<input class="mail_input" name="memberMail">
							</div>
							<span class="final_mail_ck">이메일을 입력해주세요.</span>
							<sapn class="mail_input_box_warn"></sapn>
							<div class="mail_check_wrap">
								<div class="mail_check_input_box"
									id="mail_check_input_box_false">
									<input class="mail_check_input" disabled="disabled">
									<!-- 기본적으로 인증메일 전송되기전에는 맏아둔다 -->
								</div>
								<div class="mail_check_button">
									<span>인증번호 전송</span>
								</div>
								<div class="clearfix"></div>
								<span id="mail_check_input_box_warn"></span>
								<!--  메일코드 일치여부를 알려주는 span -->
							</div>
						</div>
						<div class="address_wrap">
							<div class="address_name">주소</div>
							<div class="address_input_1_wrap">
								<div class="address_input_1_box">
									<input class="address_input_1" name="memberAddr1"
										readonly="readonly">
									<!-- disable속성을 하면 Controller로 데이터 전송 불가 -->
								</div>
								<div class="address_button" onclick="execution_daum_address()">
									<!--  버튼클릭시 해당 함수 실행 -->
									<span>주소 찾기</span>
								</div>
								<div class="clearfix"></div>
							</div>
							<div class="address_input_2_wrap">
								<div class="address_input_2_box">
									<input class="address_input_2" name="memberAddr2"
										readonly="readonly">
								</div>
							</div>
							<div class="address_input_3_wrap">
								<div class="address_input_3_box">
									<input class="address_input_3" name="memberAddr3"
										readonly="readonly">
								</div>
							</div>
							<span class="final_addr_ck">주소를 입력해주세요.</span>
						</div>
						<div class="join_button_wrap">
							<input type="button" class="join_button" value="가입하기">
						</div>
					</div>
				</form>
				<div class="col-md-6">
					<div class="contact_img-box"></div>
				</div>
			</div>
	</div>
	</section>
	
	<%@include file="../../views/includes/footer.jsp"%>

	<script type="text/javascript"
		src="../resources/js/jquery-3.4.1.min.js"></script>
	<script type="text/javascript" src="../resources/js/bootstrap.js"></script>


	<script
		src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
	<script>
	var code = "";                //이메일전송 인증번호 저장위한 코드
	
	/* 유효성 검사 통과유무 변수 */
	 var idCheck = false;            // 아이디
	 var idckCheck = false;            // 아이디 중복 검사
	 var pwCheck = false;            // 비번
	 var pwckCheck = false;            // 비번 확인
	 var pwckcorCheck = false;        // 비번 확인 일치 확인
	 var nameCheck = false;            // 이름
	 var mailCheck = false;            // 이메일
	 var mailnumCheck = false;        // 이메일 인증번호 확인
	 var addressCheck = false         // 주소
	 
		$(document).ready(function() {
			//회원가입 버튼(회원가입 기능 작동) 제이쿼리
			$(".join_button").click(function() { //class join_button 클릭시에
				var id = $('.id_input').val();                 // id 입력란
		        var pw = $('.pw_input').val();                // 비밀번호 입력란
		        var pwck = $('.pwck_input').val();            // 비밀번호 확인 입력란
		        var name = $('.user_input').val();            // 이름 입력란
		        var mail = $('.mail_input').val();            // 이메일 입력란
		        var addr = $('.address_input_3').val();        // 주소 입력란
		        

		        
		        /* 아이디 유효성검사 */
		        if(id == ""){ //id 입력란에 아무것도 입력하지 않으면 idCheck이 false 가되고 span태그가 보인다.(id를 입력해주세요)
		            $('.final_id_ck').css('display','block');
		            idCheck = false;
		        }else{
		            $('.final_id_ck').css('display', 'none');
		            idCheck = true;
		        }
		        
		        /* 비밀번호 유효성검사 */
		        
		        if(pw == ""){
		            $('.final_pw_ck').css('display','block');
		            pwCheck = false;
		        }else{
		            $('.final_pw_ck').css('display', 'none');
		            pwCheck = true;
		        }
		        
		        /* 비밀번호 확인 유효성 검사 */
		        if(pwck == ""){
		            $('.final_pwck_ck').css('display','block');
		            pwckCheck = false;
		        }else{
		            $('.final_pwck_ck').css('display', 'none');
		            pwckCheck = true;
		        }
		 
	        
		        /* 이름 유효성 검사 */
		        if(name == ""){
		            $('.final_name_ck').css('display','block');
		            nameCheck = false;
		        }else{
		            $('.final_name_ck').css('display', 'none'); //none 안보이게 처리
		            nameCheck = true;
		        }
		 
	        
		        /* 이메일 유효성 검사 */
		        if(mail == ""){
		            $('.final_mail_ck').css('display','block');
		            mailCheck = false;
		        }else{
		            $('.final_mail_ck').css('display', 'none');
		            mailCheck = true;
		        }
		        
		        /* 주소 유효성 검사 */
		        if(addr == ""){
		            $('.final_addr_ck').css('display','block');
		            addressCheck = false;
		        }else{
		            $('.final_addr_ck').css('display', 'none');
		            addressCheck = true;
		        }
		        
		        
		        /* 최종 유효성 검사 */
		        if(idCheck&&idckCheck&&pwCheck&&pwckCheck&&pwckcorCheck&&nameCheck&&mailCheck&&mailnumCheck&&addressCheck ){
		 				        	 
		            $("#join_form").attr("action", "/member/join"); // /member/join url,  id= join_form을 Controller로 전달 
		            //join_form에 는 memberVO가 담겨져 있다.
		            $("#join_form").submit();      
		        }    
		 

		        return false;    
		        
				// $("#join_form").attr("action", "/member/join"); // id=join_form 태그에 속성 url경로(url경로는 Cotroller에 명시)가 추가되고 
			   //  $("#join_form").submit(); // id=join_form 태그 서버(해당 url)로 전송
			});
		});

		// id중복검사 on은 input에 변화가 있을때 (제이쿼리)
		$('.id_input').on(
				"propertychange change keyup paste input",
				function() {
					var memberId = $('.id_input').val(); // .id_input에 입력되는 값
					var data = {
						memberId : memberId
					} // 컨트롤에 넘길 데이터 이름(memberId)

					$.ajax({
						type : "post", //post방식
						url : "/member/memberIdChk", //Controller의 url호출
						data : data, //memberId(data) 전달
						success : function(result) {
							// console.log("성공 여부" + result);
						if (result != 'fail') { //중복아이디 없음
							$('.id_input_re_1').css("display", "inline-block"); //사용가능하다는 span 을 보여줌
							$('.id_input_re_2').css("display", "none");
							idckCheck = true;
						} else {
							$('.id_input_re_2').css("display", "inline-block");
							$('.id_input_re_1').css("display", "none");ㄴ
							idckCheck = false;
						}

						}// success 종료
					}); // ajax 종료

				}); //function 종료
				
		$(".mail_check_button").click(function(){ //화면전환이 안되도록 하기 위해 ajax를 사용한다. 메일전송 번튼을 클릭할때 수행
		    var email = $(".mail_input").val();            // 입력한 이메일
		    var cehckBox = $(".mail_check_input");        // 인증번호 입력란
		    var boxWrap = $(".mail_check_input_box");    // 인증번호 입력란 박스
		    var warnMsg = $(".mail_input_box_warn");    // 이메일 입력 경고글
		    
		    /* 이메일 형식 유효성 검사 */
		    if(mailFormCheck(email)){
		        warnMsg.html("이메일이 전송 되었습니다. 이메일을 확인해주세요.");
		        warnMsg.css("display", "inline-block");
		    } else {
		        warnMsg.html("올바르지 못한 이메일 형식입니다.");
		        warnMsg.css("display", "inline-block");
		        return false;
		    } 
		    
		    $.ajax({
		        
		        type:"GET", 
		        url:"mailCheck?email=" + email, //url을 통해 데이터를 보낼 수 있도록 GET방식으로 하였고, url명을 "mailCheck" -> Controller에 구현
		        success:function(data){  //success는 ajax가 정상적으로 진행됐을때 마지막에 수행된다.
		        	   cehckBox.attr("disabled",false); //인증번호 입력이 가능하도록 변경
		               boxWrap.attr("id", "mail_check_input_box_true"); //인증번호 입력란 박스 id를 변경한다.(회색->흰색)
		               code = data; //Controller부터 전달받은 인증번호 저장
		        }
		                
		    });
			    });			

		 
		/* 인증번호 비교 */
		$(".mail_check_input").blur(function(){ //입력란에 데이터를 입력한 뒤 마우스로 다른 곳을 클릭 시에 실행
		    var inputCode = $(".mail_check_input").val();        // 입력코드    
		    var checkResult = $("#mail_check_input_box_warn");    // 비교 결과   	    
		    if(inputCode == code){                            // 일치할 경우  css의 correct적용
		        checkResult.html("인증번호가 일치합니다.");
		        checkResult.attr("class", "correct");   //css속성(그린)
		        mailnumCheck = true; 
		    } else {                                            // 일치하지 않을 경우 css의 incorrect 적용
		        checkResult.html("인증번호를 다시 확인해주세요.");
		        checkResult.attr("class", "incorrect");
		        mailnumCheck = false;   
		    }    
		    
		});
		
		/* 다음 주소 연동 */
		function execution_daum_address(){
		 
		    new daum.Postcode({
		        oncomplete: function(data) { //여기서 data는  선택한 주소에 대한 정보를 반환받는 객체 변
		            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분입니다.
		        	// 각 주소의 노출 규칙에 따라 주소를 조합한다.
	                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
	                var addr = ''; // 주소 변수
	                var extraAddr = ''; // 참고항목 변수
	 
	                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
	                if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
	                    addr = data.roadAddress;
	                } else { // 사용자가 지번 주소를 선택했을 경우(J)
	                    addr = data.jibunAddress;
	                }
	 
	                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
	                if(data.userSelectedType === 'R'){
	                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
	                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
	                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
	                        extraAddr += data.bname;
	                    }
	                    // 건물명이 있고, 공동주택일 경우 추가한다.
	                    if(data.buildingName !== '' && data.apartment === 'Y'){
	                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
	                    }
	                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
	                    if(extraAddr !== ''){
	                        extraAddr = ' (' + extraAddr + ')';
	                    }
	                 // 추가해야할 코드
	                    // 주소변수 문자열과 참고항목 문자열 합치기
	                      addr += extraAddr;
	                
	                } else {
	                	 addr += ' '; // 추가항목 필드 없음
	                }
	 
	                // 우편번호와 주소 정보를 해당 필드에 넣는다.
	                // 추가해야할 코드
          			  $(".address_input_1").val(data.zonecode); //제이쿼리에서는 \ $().val를 통해 해당요소의 값을 설정할 수 있다 (.)은 class의미
           				 //$("[name=memberAddr1]").val(data.zonecode);    // 대체가능
           			  $(".address_input_2").val(addr);
         				  //$("[name=memberAddr2]").val(addr);            // 대체가능
	                // 커서를 상세주소 필드로 이동한다.
           		// 상세주소 입력란 disabled 속성 변경 및 커서를 상세주소 필드로 이동한다.
                      $(".address_input_3").attr("readonly",false); //입력가능하게 readonly를 false로 한다.
                      $(".address_input_3").focus();
            
		            
		 
		        }
		    }).open();    
		 
		}
		
		/* 비밀번호 확인 일치 유효성 검사  (서버로 안보내고 자바스크립드로만 확인)*/
		 
		$('.pwck_input').on("propertychange change keyup paste input", function(){ //비밀번호 확인 입력란을 입력할때마다 수행
		 
		    var pw = $('.pw_input').val();
		    var pwck = $('.pwck_input').val();
		    $('.final_pwck_ck').css('display', 'none'); //입력되면 '비밀번호 확인을 입력해주세요' 경고글 사라짐
		    
		    if(pw == pwck){
		        $('.pwck_input_re_1').css('display','block');
		        $('.pwck_input_re_2').css('display','none');
		        pwckcorCheck = true;
		    }else{ //일치하지 않으면 
		        $('.pwck_input_re_1').css('display','none'); //일치합니다가 안보인다(none)
		        $('.pwck_input_re_2').css('display','block'); //일치하지 않는다가 보인다
		        pwckcorCheck = false;
		    }        
		        
		    
		});    

		 /* 입력 이메일 형식 유효성 검사 */	
		 function mailFormCheck(email){
			 var form = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			 return form.test(email); /* form에 저장된 정규표현식에 부합할 경우 true 부합하지 않으면 false retrun */
		 }
		  
		  

	
	</script>

</body>
</html>