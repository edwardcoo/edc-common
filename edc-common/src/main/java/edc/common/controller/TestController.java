package edc.common.controller;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Hello world!
 *
 */
@Controller
@EnableAutoConfiguration
@ComponentScan
public class TestController {


    @RequestMapping("/hello")
    @ResponseBody
    public String hello() {
        return "Hello World !!";
    }

}
