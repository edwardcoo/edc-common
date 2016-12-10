package edc.common.controller;

import java.time.Year;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@EnableAutoConfiguration
public class IndexController {

    @RequestMapping("/index")
    public ModelAndView index() {
        return new ModelAndView("index");
    }

    @RequestMapping("/week/list")
    public ModelAndView weekList() {
        ModelAndView view = new ModelAndView("week/list");
        List<Integer> years = new ArrayList<>();
        int now = Year.now().getValue();
        for (int i = now; i > now - 10; i--) {
            years.add(i);
        }
        view.addObject("years", years);
        return view;
    }

}
