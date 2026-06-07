package com.example.demo;

import java.time.LocalDateTime;

public class Cours extends Evenement {
    private UniteEnseignement ue;
    private Prof prof;

    public Cours() {
        super();
    }

    public Cours(LocalDateTime heureDebut, LocalDateTime heureFin, UniteEnseignement ue, Prof prof) {
        super(heureDebut, heureFin);
        this.ue = ue;
        this.prof = prof;
    }

    // Getters et Setters
    public UniteEnseignement getUe() {
        return ue;
    }

    public void setUe(UniteEnseignement ue) {
        this.ue = ue;
    }

    public Prof getProf() {
        return prof;
    }

    public void setProf(Prof prof) {
        this.prof = prof;
    }
}