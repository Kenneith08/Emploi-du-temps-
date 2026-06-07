package com.example.demo;

import java.time.LocalDateTime;

public class Evenement {
    private LocalDateTime heureDebut;
    private LocalDateTime heureFin;

    public Evenement() {
    }

    public Evenement(LocalDateTime heureDebut, LocalDateTime heureFin) {
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
    }

    // Getters et Setters
    public LocalDateTime getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(LocalDateTime heureDebut) {
        this.heureDebut = heureDebut;
    }

    public LocalDateTime getHeureFin() {
        return heureFin;
    }

    public void setHeureFin(LocalDateTime heureFin) {
        this.heureFin = heureFin;
    }
}