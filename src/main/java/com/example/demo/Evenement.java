package com.example.demo;

import java.util.UUID;

public class Evenement {
    private String id;
    // On utilise String pour éviter les problèmes de désérialisation
    // de LocalDateTime avec Jackson (format datetime-local HTML = "2025-06-08T14:30")
    private String heureDebut;
    private String heureFin;

    public Evenement() {
        this.id = UUID.randomUUID().toString();
    }

    public Evenement(String heureDebut, String heureFin) {
        this.id = UUID.randomUUID().toString();
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getHeureDebut() { return heureDebut; }
    public void setHeureDebut(String heureDebut) { this.heureDebut = heureDebut; }

    public String getHeureFin() { return heureFin; }
    public void setHeureFin(String heureFin) { this.heureFin = heureFin; }
}
