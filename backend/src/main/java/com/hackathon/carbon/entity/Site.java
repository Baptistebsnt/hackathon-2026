package com.hackathon.carbon.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "sites")
public class Site {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double surfaceM2;

    private Integer parkingSpots;

    private Double energyConsumptionMwh;

    private Integer employees;

    private Integer workstations;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SiteMaterial> materials;

    @OneToMany(mappedBy = "site", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<CarbonHistory> history;

    public Site() {}

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getSurfaceM2() { return surfaceM2; }
    public Integer getParkingSpots() { return parkingSpots; }
    public Double getEnergyConsumptionMwh() { return energyConsumptionMwh; }
    public Integer getEmployees() { return employees; }
    public Integer getWorkstations() { return workstations; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<SiteMaterial> getMaterials() { return materials; }
    public List<CarbonHistory> getHistory() { return history; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSurfaceM2(Double surfaceM2) { this.surfaceM2 = surfaceM2; }
    public void setParkingSpots(Integer parkingSpots) { this.parkingSpots = parkingSpots; }
    public void setEnergyConsumptionMwh(Double energyConsumptionMwh) { this.energyConsumptionMwh = energyConsumptionMwh; }
    public void setEmployees(Integer employees) { this.employees = employees; }
    public void setWorkstations(Integer workstations) { this.workstations = workstations; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setMaterials(List<SiteMaterial> materials) { this.materials = materials; }
    public void setHistory(List<CarbonHistory> history) { this.history = history; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Site site = new Site();
        public Builder name(String v) { site.name = v; return this; }
        public Builder surfaceM2(Double v) { site.surfaceM2 = v; return this; }
        public Builder parkingSpots(Integer v) { site.parkingSpots = v; return this; }
        public Builder energyConsumptionMwh(Double v) { site.energyConsumptionMwh = v; return this; }
        public Builder employees(Integer v) { site.employees = v; return this; }
        public Builder workstations(Integer v) { site.workstations = v; return this; }
        public Site build() { return site; }
    }
}
