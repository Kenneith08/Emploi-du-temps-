package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Permet à ton app.js de lui parler librement
public class AgendaControler {

    private final List<Prof> profs = new ArrayList<>();
    private final List<UniteEnseignement> ues = new ArrayList<>();
    private final List<Cours> cours = new ArrayList<>();
    private final List<Seminaire> seminaires = new ArrayList<>();
    @RequestMapping("/api")
    @GetMapping("/profs")
    public List<Prof> getProfs() { return profs; }

    @PostMapping("/profs")
    public Prof addProf(@RequestBody Prof prof) {
        profs.add(prof);
        return prof;
    }

    @GetMapping("/ues")
    public List<UniteEnseignement> getUes() { return ues; }

    @PostMapping("/ues")
    public UniteEnseignement addUE(@RequestBody UniteEnseignement ue) {
        ues.add(ue);
        return ue;
    }

    @GetMapping("/cours")
    public List<Cours> getCours() { return cours; }

    @PostMapping("/cours")
    public Cours addCours(@RequestBody Cours c) {
        cours.add(c);
        return c;
    }

    @GetMapping("/seminaires")
    public List<Seminaire> getSeminaires() { return seminaires; }

    @PostMapping("/seminaires")
    public Seminaire addSeminaire(@RequestBody Seminaire s) {
        seminaires.add(s);
        return s;
    }
}
