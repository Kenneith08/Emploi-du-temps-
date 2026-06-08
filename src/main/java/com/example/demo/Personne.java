package com.example.demo;

import java.util.UUID;

public class Personne {
    private String id;
    private String nom;
    private String prenom;
    private int age;
    private Genre genre;

    public Personne() {
        this.id = UUID.randomUUID().toString();
    }

    public Personne(String nom, String prenom, int age, Genre genre) {
        this.id = UUID.randomUUID().toString();
        this.nom = nom;
        this.prenom = prenom;
        this.age = age;
        this.genre = genre;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPrenom() { return prenom; }
    public void setPrenom(String prenom) { this.prenom = prenom; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public Genre getGenre() { return genre; }
    public void setGenre(Genre genre) { this.genre = genre; }
}
