<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

	<%@include file="../../views/includes/header.jsp"%>

	<!-- contact section -->
	<style>
	.container * {
      font-size: 2rem; /* 모든 글자 크기 설정 */
    }
    .login_fail {
      color: red;
      font-size: 2rem; /* 글자 크기 설정 (1.25rem은 20px에 해당) */
      margin-top: 2rem;  /* 위쪽에 약간의 마진 추가 */
    }
  </style>

	<div class="container mt-5">
        <div class="row">
            <div class="col-md-6">
             <h2 class="mb-4">SAC맛집 LOGIN</h2>
                <form id="login_form" method="post">
                    <div class="form-group">
                    		<label for="userId">아이디</label>
                            <input class="form-control" placeholder="ID" name="memberId">
                    </div>     
                    <div class="form-group">   
                    		<label for="password">패스워드</label>
                            <input type="password" class="form-control" placeholder="PASSWORD" name="memberPw">
                    </div>
                    <button type="submit" class="login_button btn-primary btn-block">로그인</button>
                     <a id="register_button" href="/member/join" class="btn btn-secondary btn-block mt-2">회원가입</a>
                        <c:if test="${result == 0 }">
                            <!-- form을 통해서 Controller 에서 0을 반환하면 거짓 -->
                            <div class="login_fail">사용자 ID 또는 비밀번호를 잘못 입력하셨습니다.</div>
                        </c:if>
                </form>
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-center">
                    <img src="../resources/images/students.jpg" alt="Placeholder Image" class="img-fluid">
                </div>
            </div>
        </div>
	<%@include file="../../views/includes/footer.jsp"%>
	<script>
		/* 로그인 버튼 클릭 메서드 */

		$(".login_button").click(function() {

			/* 로그인 메서드 서버 요청 */
			$("#login_form").attr("action", "/member/login.do"); // login_form을 Controller의 member/login.do url로 전송
			$("#login_form").submit();

		});
	</script>
</body>

</html>
