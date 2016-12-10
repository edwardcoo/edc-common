package edc.common.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
@EnableAutoConfiguration
public class UserController {

    @ResponseBody
    @RequestMapping("/hello/user")
    public String getUserInfo() {
        return "this is userInfo !!!";
    }

    @RequestMapping("/test/view")
    public ModelAndView getlist() {
        return new ModelAndView("test/list");
    }

}
