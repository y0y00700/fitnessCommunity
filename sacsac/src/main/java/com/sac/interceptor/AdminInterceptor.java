package com.sac.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;

import com.sac.model.MemberVO;

public class AdminInterceptor implements HandlerInterceptor {
	 
	 @Override
	 public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
	            throws Exception {
		
		 HttpSession session = request.getSession(); //세션 정보를 가져온다음에
	        
	     MemberVO lvo = (MemberVO)session.getAttribute("member"); //memberController(lvo)에 있는 memberVo타입을 lvo변수에 저장
	     
	     if(lvo == null || lvo.getAdminCk() == 0) {    // 관리자 계정 아닌 경우
	            
	            response.sendRedirect("/main");    // 메인페이지로 리다이렉트
	            
	            return false;
	            
	        }
	        
	        return true;    // 관리자 계정 로그인 경우(lvo != null && lvo.getAdminCk() == 1)
	 }

}
