package com.bypx.filter;
import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

public class LoginFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request= (HttpServletRequest) servletRequest;
        HttpServletResponse response= (HttpServletResponse) servletResponse;
        HttpSession session=request.getSession();
        String account= (String) session.getAttribute("account");
        if(account!=null){
            filterChain.doFilter(request,response);
            return;
        }
        Cookie[] cookies=request.getCookies();
        if (cookies!=null){
            for (Cookie c:cookies){
                if(c.getName().equals("account")){
                    session.setAttribute("account",c.getValue());
                    filterChain.doFilter(request,response);
                    return;
                }
            }
        }
        String url=request.getRequestURI();
        if (url.contains("login.html")||url.contains("login.do")){
            filterChain.doFilter(request,response);
            return;
        }
        response.sendRedirect("login.html");
        return;
    }
    @Override
    public void destroy() {}
}
