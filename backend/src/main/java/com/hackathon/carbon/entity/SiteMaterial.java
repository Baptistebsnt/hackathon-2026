package com.hackathon.carbon.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "site_materials")
public class SiteMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false)
    private Site site;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaterialType materialType;

    @Column(nullable = false)
    private Double quantityTons;

    public enum MaterialType {
        CONCRETE, STEEL, GLASS, WOOD, ALUMINUM
    }

    public SiteMaterial() {}

    public Long getId() { return id; }
    public Site getSite() { return site; }
    public MaterialType getMaterialType() { return materialType; }
    public Double getQuantityTons() { return quantityTons; }

    public void setId(Long id) { this.id = id; }
    public void setSite(Site site) { this.site = site; }
    public void setMaterialType(MaterialType materialType) { this.materialType = materialType; }
    public void setQuantityTons(Double quantityTons) { this.quantityTons = quantityTons; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final SiteMaterial m = new SiteMaterial();
        public Builder site(Site v) { m.site = v; return this; }
        public Builder materialType(MaterialType v) { m.materialType = v; return this; }
        public Builder quantityTons(Double v) { m.quantityTons = v; return this; }
        public SiteMaterial build() { return m; }
    }
}
