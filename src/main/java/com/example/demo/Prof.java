package com.example.demo;

import java.util.List;
import java.util.ArrayList;

public class Prof extends Personne {
    private List<UniteEnseignement> ues;

    public Prof() {
        super();
        this.ues = new ArrayList<>();
    }

    public Prof(String nom, String prenom, int age, Genre genre) {
        super(nom, prenom, age, genre);
        this.ues = new ArrayList<>();
    }

    public List<UniteEnseignement> getUes() {
        return ues;
    }

    public void setUes(List<UniteEnseignement> ues) {
        this.ues = ues;
    }

    public void addUE(UniteEnseignement ue) {
        if (ue != null) {
            this.ues.add(ue);
        }
    }
}