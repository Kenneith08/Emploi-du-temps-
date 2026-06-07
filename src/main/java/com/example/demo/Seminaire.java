package com.example.demo;

import java.time.LocalDateTime;

public class Seminaire extends Evenement {
    private Personne responsable;

    public Seminaire() {
        super();
    }

    public Seminaire(LocalDateTime heureDebut, LocalDateTime heureFin, Personne responsable) {
        super(heureDebut, heureFin);
        this.responsable = responsable;
    }

    // Getters et Setters
    public Personne getResponsable() {
        return responsable;
    }

    public void setResponsable(Personne responsable) {
        this.responsable = responsable;
    }
}