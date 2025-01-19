package com.sac.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;

public class LoginInterceptor implements HandlerInterceptor{
	
	 @Override
	 public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) //Controller에 전입전에 작업을 원하는 preHandl()메서드를 오버라이딩
	            throws Exception {
		 	
	        System.out.println("LoginInterceptor preHandle 작동");
	        
	        HttpSession session = request.getSession();
	        
	        session.invalidate(); //세션을 제거
	 	 
	        return true;
	    }	
}
