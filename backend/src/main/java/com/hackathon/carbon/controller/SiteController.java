package com.hackathon.carbon.controller;

import com.hackathon.carbon.dto.SiteRequest;
import com.hackathon.carbon.dto.SiteResponse;
import com.hackathon.carbon.service.SiteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sites")
@CrossOrigin(origins = "*")
public class SiteController {

    private final SiteService siteService;

    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    @PostMapping
    public ResponseEntity<SiteResponse> createSite(@Valid @RequestBody SiteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(siteService.createSite(request));
    }

    @GetMapping
    public ResponseEntity<List<SiteResponse>> getAllSites() {
        return ResponseEntity.ok(siteService.getAllSites());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiteResponse> getSite(@PathVariable Long id) {
        return ResponseEntity.ok(siteService.getSiteById(id));
    }
}
