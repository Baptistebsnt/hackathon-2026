package com.hackathon.carbon.service;

import com.hackathon.carbon.entity.SiteMaterial;
import com.hackathon.carbon.entity.SiteMaterial.MaterialType;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class CarbonCalculationService {

    private static final Map<MaterialType, Double> MATERIAL_FACTORS = Map.of(
        MaterialType.CONCRETE,  150.0,
        MaterialType.STEEL,     1850.0,
        MaterialType.GLASS,     1400.0,
        MaterialType.WOOD,      -1600.0,
        MaterialType.ALUMINUM,  8000.0
    );

    private static final double ELECTRICITY_FACTOR_KG_PER_MWH = 57.0;
    private static final double PARKING_FACTOR_KG_PER_SPOT = 900.0;

    public double calculateConstructionCo2(List<SiteMaterial> materials, int parkingSpots) {
        double materialsCo2 = materials.stream()
            .mapToDouble(m -> MATERIAL_FACTORS.getOrDefault(m.getMaterialType(), 0.0) * m.getQuantityTons())
            .sum();
        return materialsCo2 + (parkingSpots * PARKING_FACTOR_KG_PER_SPOT);
    }

    public double calculateOperationCo2PerYear(double energyMwh) {
        return energyMwh * ELECTRICITY_FACTOR_KG_PER_MWH;
    }

    public double getMaterialFactor(MaterialType type) {
        return MATERIAL_FACTORS.getOrDefault(type, 0.0);
    }
}
