package com.ecomove.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HealthController {

  @GetMapping("/")
  public String root() {
    return "redirect:/index.html";
  }

  @GetMapping("/health")
  @ResponseBody
  public String health() {
    return "EcoMove Backend is running";
  }
}

