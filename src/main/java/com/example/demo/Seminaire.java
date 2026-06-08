package com.example.demo;

public class Seminaire extends Evenement {
    private Personne responsable;
    private String titre;

    public Seminaire() {
        super();
    }

    public Seminaire(String heureDebut, String heureFin, Personne responsable, String titre) {
        super(heureDebut, heureFin);
        this.responsable = responsable;
        this.titre = titre;
    }

    public Personne getResponsable() { return responsable; }
    public void setResponsable(Personne responsable) { this.responsable = responsable; }

    public String getTitre() { return titre; }
    public void setTitre(String titre) { this.titre = titre; }
}
