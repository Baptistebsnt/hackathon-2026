package com.hackathon.carbon.service;

import com.hackathon.carbon.dto.SiteRequest;
import com.hackathon.carbon.dto.SiteResponse;
import com.hackathon.carbon.entity.*;
import com.hackathon.carbon.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SiteService {

    private final SiteRepository siteRepository;
    private final CarbonHistoryRepository historyRepository;
    private final CarbonCalculationService calculationService;

    public SiteService(SiteRepository siteRepository,
                       CarbonHistoryRepository historyRepository,
                       CarbonCalculationService calculationService) {
        this.siteRepository = siteRepository;
        this.historyRepository = historyRepository;
        this.calculationService = calculationService;
    }

    public SiteResponse createSite(SiteRequest req) {
        Site site = Site.builder()
            .name(req.getName())
            .surfaceM2(req.getSurfaceM2())
            .parkingSpots(req.getParkingSpots())
            .energyConsumptionMwh(req.getEnergyConsumptionMwh())
            .employees(req.getEmployees())
            .workstations(req.getWorkstations())
            .build();

        if (req.getMaterials() != null) {
            List<SiteMaterial> materials = req.getMaterials().stream()
                .map(m -> SiteMaterial.builder()
                    .site(site)
                    .materialType(m.getMaterialType())
                    .quantityTons(m.getQuantityTons())
                    .build())
                .collect(Collectors.toList());
            site.setMaterials(materials);
        }

        Site saved = siteRepository.save(site);
        return computeAndSave(saved);
    }

    @Transactional(readOnly = true)
    public List<SiteResponse> getAllSites() {
        return siteRepository.findAll().stream()
            .map(this::computeAndSave)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SiteResponse getSiteById(Long id) {
        Site site = siteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Site introuvable : " + id));
        return computeAndSave(site);
    }

    private SiteResponse computeAndSave(Site site) {
        List<SiteMaterial> mats = site.getMaterials() != null ? site.getMaterials() : List.of();
        int parking = site.getParkingSpots() != null ? site.getParkingSpots() : 0;
        double constr = calculationService.calculateConstructionCo2(mats, parking);
        double oper   = calculationService.calculateOperationCo2PerYear(site.getEnergyConsumptionMwh());
        double total  = constr + oper;
        double perM2  = site.getSurfaceM2() > 0 ? total / site.getSurfaceM2() : 0;
        double perEmp = (site.getEmployees() != null && site.getEmployees() > 0) ? total / site.getEmployees() : 0;

        List<SiteResponse.MaterialBreakdown> breakdown = mats.stream().map(m -> {
            double co2 = calculationService.getMaterialFactor(m.getMaterialType()) * m.getQuantityTons();
            return SiteResponse.MaterialBreakdown.builder()
                .materialType(m.getMaterialType().name())
                .quantityTons(m.getQuantityTons())
                .co2Kg(co2)
                .percentageOfTotal(total > 0 ? (co2 / total) * 100 : 0)
                .build();
        }).collect(Collectors.toList());

        return SiteResponse.builder()
            .id(site.getId()).name(site.getName())
            .surfaceM2(site.getSurfaceM2()).parkingSpots(site.getParkingSpots())
            .energyConsumptionMwh(site.getEnergyConsumptionMwh())
            .employees(site.getEmployees()).workstations(site.getWorkstations())
            .createdAt(site.getCreatedAt())
            .constructionCo2Kg(constr).operationCo2KgPerYear(oper)
            .totalCo2Kg(total).co2PerM2(perM2).co2PerEmployee(perEmp)
            .materialBreakdown(breakdown)
            .build();
    }
}
