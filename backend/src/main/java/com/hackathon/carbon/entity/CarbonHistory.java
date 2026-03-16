package com.hackathon.carbon.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_history")
public class CarbonHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    private Double constructionCo2Kg;
    private Double operationCo2KgPerYear;
    private Double totalCo2Kg;
    private Double co2PerM2;
    private Double co2PerEmployee;
    private LocalDateTime calculatedAt;

    public CarbonHistory() {}

    public Long getId() { return id; }
    public Site getSite() { return site; }
    public Double getConstructionCo2Kg() { return constructionCo2Kg; }
    public Double getOperationCo2KgPerYear() { return operationCo2KgPerYear; }
    public Double getTotalCo2Kg() { return totalCo2Kg; }
    public Double getCo2PerM2() { return co2PerM2; }
    public Double getCo2PerEmployee() { return co2PerEmployee; }
    public LocalDateTime getCalculatedAt() { return calculatedAt; }

    public void setId(Long id) { this.id = id; }
    public void setSite(Site site) { this.site = site; }
    public void setConstructionCo2Kg(Double v) { this.constructionCo2Kg = v; }
    public void setOperationCo2KgPerYear(Double v) { this.operationCo2KgPerYear = v; }
    public void setTotalCo2Kg(Double v) { this.totalCo2Kg = v; }
    public void setCo2PerM2(Double v) { this.co2PerM2 = v; }
    public void setCo2PerEmployee(Double v) { this.co2PerEmployee = v; }
    public void setCalculatedAt(LocalDateTime v) { this.calculatedAt = v; }

    @PrePersist
    protected void onCreate() { calculatedAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final CarbonHistory h = new CarbonHistory();
        public Builder site(Site v) { h.site = v; return this; }
        public Builder constructionCo2Kg(Double v) { h.constructionCo2Kg = v; return this; }
        public Builder operationCo2KgPerYear(Double v) { h.operationCo2KgPerYear = v; return this; }
        public Builder totalCo2Kg(Double v) { h.totalCo2Kg = v; return this; }
        public Builder co2PerM2(Double v) { h.co2PerM2 = v; return this; }
        public Builder co2PerEmployee(Double v) { h.co2PerEmployee = v; return this; }
        public CarbonHistory build() { return h; }
    }
}
