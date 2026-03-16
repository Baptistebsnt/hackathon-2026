package com.hackathon.carbon.dto;

import java.time.LocalDateTime;
import java.util.List;

public class SiteResponse {

    private Long id;
    private String name;
    private Double surfaceM2;
    private Integer parkingSpots;
    private Double energyConsumptionMwh;
    private Integer employees;
    private Integer workstations;
    private LocalDateTime createdAt;
    private Double constructionCo2Kg;
    private Double operationCo2KgPerYear;
    private Double totalCo2Kg;
    private Double co2PerM2;
    private Double co2PerEmployee;
    private List<MaterialBreakdown> materialBreakdown;

    public SiteResponse() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getSurfaceM2() { return surfaceM2; }
    public Integer getParkingSpots() { return parkingSpots; }
    public Double getEnergyConsumptionMwh() { return energyConsumptionMwh; }
    public Integer getEmployees() { return employees; }
    public Integer getWorkstations() { return workstations; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Double getConstructionCo2Kg() { return constructionCo2Kg; }
    public Double getOperationCo2KgPerYear() { return operationCo2KgPerYear; }
    public Double getTotalCo2Kg() { return totalCo2Kg; }
    public Double getCo2PerM2() { return co2PerM2; }
    public Double getCo2PerEmployee() { return co2PerEmployee; }
    public List<MaterialBreakdown> getMaterialBreakdown() { return materialBreakdown; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSurfaceM2(Double surfaceM2) { this.surfaceM2 = surfaceM2; }
    public void setParkingSpots(Integer parkingSpots) { this.parkingSpots = parkingSpots; }
    public void setEnergyConsumptionMwh(Double energyConsumptionMwh) { this.energyConsumptionMwh = energyConsumptionMwh; }
    public void setEmployees(Integer employees) { this.employees = employees; }
    public void setWorkstations(Integer workstations) { this.workstations = workstations; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setConstructionCo2Kg(Double v) { this.constructionCo2Kg = v; }
    public void setOperationCo2KgPerYear(Double v) { this.operationCo2KgPerYear = v; }
    public void setTotalCo2Kg(Double v) { this.totalCo2Kg = v; }
    public void setCo2PerM2(Double v) { this.co2PerM2 = v; }
    public void setCo2PerEmployee(Double v) { this.co2PerEmployee = v; }
    public void setMaterialBreakdown(List<MaterialBreakdown> materialBreakdown) { this.materialBreakdown = materialBreakdown; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final SiteResponse r = new SiteResponse();
        public Builder id(Long v) { r.id = v; return this; }
        public Builder name(String v) { r.name = v; return this; }
        public Builder surfaceM2(Double v) { r.surfaceM2 = v; return this; }
        public Builder parkingSpots(Integer v) { r.parkingSpots = v; return this; }
        public Builder energyConsumptionMwh(Double v) { r.energyConsumptionMwh = v; return this; }
        public Builder employees(Integer v) { r.employees = v; return this; }
        public Builder workstations(Integer v) { r.workstations = v; return this; }
        public Builder createdAt(java.time.LocalDateTime v) { r.createdAt = v; return this; }
        public Builder constructionCo2Kg(Double v) { r.constructionCo2Kg = v; return this; }
        public Builder operationCo2KgPerYear(Double v) { r.operationCo2KgPerYear = v; return this; }
        public Builder totalCo2Kg(Double v) { r.totalCo2Kg = v; return this; }
        public Builder co2PerM2(Double v) { r.co2PerM2 = v; return this; }
        public Builder co2PerEmployee(Double v) { r.co2PerEmployee = v; return this; }
        public Builder materialBreakdown(List<MaterialBreakdown> v) { r.materialBreakdown = v; return this; }
        public SiteResponse build() { return r; }
    }

    public static class MaterialBreakdown {
        private String materialType;
        private Double quantityTons;
        private Double co2Kg;
        private Double percentageOfTotal;

        public MaterialBreakdown() {}

        public String getMaterialType() { return materialType; }
        public Double getQuantityTons() { return quantityTons; }
        public Double getCo2Kg() { return co2Kg; }
        public Double getPercentageOfTotal() { return percentageOfTotal; }

        public void setMaterialType(String materialType) { this.materialType = materialType; }
        public void setQuantityTons(Double quantityTons) { this.quantityTons = quantityTons; }
        public void setCo2Kg(Double co2Kg) { this.co2Kg = co2Kg; }
        public void setPercentageOfTotal(Double percentageOfTotal) { this.percentageOfTotal = percentageOfTotal; }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private final MaterialBreakdown mb = new MaterialBreakdown();
            public Builder materialType(String v) { mb.materialType = v; return this; }
            public Builder quantityTons(Double v) { mb.quantityTons = v; return this; }
            public Builder co2Kg(Double v) { mb.co2Kg = v; return this; }
            public Builder percentageOfTotal(Double v) { mb.percentageOfTotal = v; return this; }
            public MaterialBreakdown build() { return mb; }
        }
    }
}
