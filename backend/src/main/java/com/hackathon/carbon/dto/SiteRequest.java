package com.hackathon.carbon.dto;

import com.hackathon.carbon.entity.SiteMaterial.MaterialType;
import jakarta.validation.constraints.*;
import java.util.List;

public class SiteRequest {

    @NotBlank(message = "Le nom du site est obligatoire")
    private String name;

    @NotNull @Positive
    private Double surfaceM2;

    @Min(0)
    private Integer parkingSpots = 0;

    @NotNull @Positive
    private Double energyConsumptionMwh;

    @Min(1)
    private Integer employees;

    @Min(0)
    private Integer workstations;

    private List<MaterialInput> materials;

    public String getName() { return name; }
    public Double getSurfaceM2() { return surfaceM2; }
    public Integer getParkingSpots() { return parkingSpots; }
    public Double getEnergyConsumptionMwh() { return energyConsumptionMwh; }
    public Integer getEmployees() { return employees; }
    public Integer getWorkstations() { return workstations; }
    public List<MaterialInput> getMaterials() { return materials; }

    public void setName(String name) { this.name = name; }
    public void setSurfaceM2(Double surfaceM2) { this.surfaceM2 = surfaceM2; }
    public void setParkingSpots(Integer parkingSpots) { this.parkingSpots = parkingSpots; }
    public void setEnergyConsumptionMwh(Double energyConsumptionMwh) { this.energyConsumptionMwh = energyConsumptionMwh; }
    public void setEmployees(Integer employees) { this.employees = employees; }
    public void setWorkstations(Integer workstations) { this.workstations = workstations; }
    public void setMaterials(List<MaterialInput> materials) { this.materials = materials; }

    public static class MaterialInput {
        @NotNull
        private MaterialType materialType;

        @NotNull @Positive
        private Double quantityTons;

        public MaterialType getMaterialType() { return materialType; }
        public Double getQuantityTons() { return quantityTons; }
        public void setMaterialType(MaterialType materialType) { this.materialType = materialType; }
        public void setQuantityTons(Double quantityTons) { this.quantityTons = quantityTons; }
    }
}
