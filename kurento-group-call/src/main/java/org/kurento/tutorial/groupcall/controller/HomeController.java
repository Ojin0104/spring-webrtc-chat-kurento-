package org.kurento.tutorial.groupcall.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
    @RequestMapping("/meeting")
    public String HomePage(){return "index.html";}

}
