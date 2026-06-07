package com.example.demo;

public class UniteEnseignement {
    private String matiere;
    private int credit;

    public UniteEnseignement() {
    }

    public UniteEnseignement(String matiere, int credit) {
        this.matiere = matiere;
        this.credit = credit;
    }

    // Getters et Setters
    public String getMatiere() {
        return matiere;
    }

    public void setMatiere(String matiere) {
        this.matiere = matiere;
    }

    public int getCredit() {
        return credit;
    }

    public void setCredit(int credit) {
        this.credit = credit;
    }
}