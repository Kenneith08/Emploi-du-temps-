package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AgendaControler {

    private final List<Prof> profs = new ArrayList<>();
    private final List<UniteEnseignement> ues = new ArrayList<>();
    private final List<Cours> cours = new ArrayList<>();
    private final List<Seminaire> seminaires = new ArrayList<>();

    // ── PROFS ──────────────────────────────────────────────────────────────

    @GetMapping("/profs")
    public List<Prof> getProfs() { return profs; }

    @PostMapping("/profs")
    public Prof addProf(@RequestBody Prof prof) {
        profs.add(prof);
        return prof;
    }

    // FIX: route DELETE manquante
    @DeleteMapping("/profs/{id}")
    public void deleteProf(@PathVariable String id) {
        profs.removeIf(p -> id.equals(p.getId()));
    }

    // ── UEs ────────────────────────────────────────────────────────────────

    @GetMapping("/ues")
    public List<UniteEnseignement> getUes() { return ues; }

    @PostMapping("/ues")
    public UniteEnseignement addUE(@RequestBody UniteEnseignement ue) {
        ues.add(ue);
        return ue;
    }

    // FIX: route DELETE manquante
    @DeleteMapping("/ues/{id}")
    public void deleteUE(@PathVariable String id) {
        ues.removeIf(u -> id.equals(u.getId()));
    }

    // ── COURS ──────────────────────────────────────────────────────────────

    @GetMapping("/cours")
    public List<Cours> getCours() { return cours; }

    @PostMapping("/cours")
    public Cours addCours(@RequestBody Cours c) {
        cours.add(c);
        return c;
    }

    // FIX: route DELETE manquante
    @DeleteMapping("/cours/{id}")
    public void deleteCours(@PathVariable String id) {
        cours.removeIf(c -> id.equals(c.getId()));
    }

    // ── SÉMINAIRES ─────────────────────────────────────────────────────────

    @GetMapping("/seminaires")
    public List<Seminaire> getSeminaires() { return seminaires; }

    @PostMapping("/seminaires")
    public Seminaire addSeminaire(@RequestBody Seminaire s) {
        seminaires.add(s);
        return s;
    }

    // FIX: route DELETE manquante
    @DeleteMapping("/seminaires/{id}")
    public void deleteSeminaire(@PathVariable String id) {
        seminaires.removeIf(s -> id.equals(s.getId()));
    }
}
