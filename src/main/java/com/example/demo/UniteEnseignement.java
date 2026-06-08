package com.example.demo;

import java.util.UUID;

public class UniteEnseignement {
    private String id;
    private String matiere;
    private int credit;

    public UniteEnseignement() {
        this.id = UUID.randomUUID().toString();
    }

    public UniteEnseignement(String matiere, int credit) {
        this.id = UUID.randomUUID().toString();
        this.matiere = matiere;
        this.credit = credit;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMatiere() { return matiere; }
    public void setMatiere(String matiere) { this.matiere = matiere; }

    public int getCredit() { return credit; }
    public void setCredit(int credit) { this.credit = credit; }
}
