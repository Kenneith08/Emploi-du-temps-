import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class GestionEtablissementTest {

    @Nested
    class PersonneTest {
        @Test
        void testConstructeurCompletEtGetters() {
            Personne personne = new Personne("Ranaivo", "Jean", 21, Genre.Homme);

            assertEquals("Ranaivo", personne.getNom());
            assertEquals("Jean", personne.getPrenom());
            assertEquals(21, personne.getAge());
            assertEquals(Genre.Homme, personne.getGenre());
        }

        @Test
        void testSetters() {
            Personne personne = new Personne();
            personne.setNom("Razafy");
            personne.setPrenom("Marie");
            personne.setAge(22);
            personne.setGenre(Genre.Femme);

            assertEquals("Razafy", personne.getNom());
            assertEquals("Marie", personne.getPrenom());
            assertEquals(22, personne.getAge());
            assertEquals(Genre.Femme, personne.getGenre());
        }
    }

    @Nested
    class IntervenantTest {
        @Test
        void testConstructeurHeritage() {
            Intervenant intervenant = new Intervenant("Rakoto", "Paul", 35, Genre.Homme);

            assertEquals("Rakoto", intervenant.getNom());
            assertEquals(Genre.Homme, intervenant.getGenre());
        }
    }

    @Nested
    class ProfTest {
        @Test
        void testInitialisationListeUes() {
            Prof profVide = new Prof();
            assertNotNull(profVide.getUes());
            assertTrue(profVide.getUes().isEmpty());
        }

        @Test
        void testAddUeValide() {
            Prof prof = new Prof("Randria", "Toky", 40, Genre.Homme);
            UniteEnseignement ue = new UniteEnseignement("Programmation Java", 6);

            prof.addUE(ue);

            assertEquals(1, prof.getUes().size());
            assertEquals("Programmation Java", prof.getUes().get(0).getMatiere());
        }

        @Test
        void testAddUeNullNeDoitPasAjouter() {
            Prof prof = new Prof();
            prof.addUE(null);

            assertTrue(prof.getUes().isEmpty(), "La liste devrait rester vide si l'UE est nulle.");
        }

        @Test
        void testSetUes() {
            Prof prof = new Prof();
            ArrayList<UniteEnseignement> liste = new ArrayList<>();
            liste.add(new UniteEnseignement("Réseaux", 4));

            prof.setUes(liste);
            assertEquals(1, prof.getUes().size());
        }
    }

    @Nested
    class UniteEnseignementTest {
        @Test
        void testConstructeurEtGetters() {
            UniteEnseignement ue = new UniteEnseignement("Architecture des Systèmes", 5);

            assertEquals("Architecture des Systèmes", ue.getMatiere());
            assertEquals(5, ue.getCredit());
        }

        @Test
        void testSetters() {
            UniteEnseignement ue = new UniteEnseignement();
            ue.setMatiere("Bases de Données");
            ue.setCredit(4);

            assertEquals("Bases de Données", ue.getMatiere());
            assertEquals(4, ue.getCredit());
        }
    }

    @Nested
    class EvenementTest {
        @Test
        void testGestionDesDates() {
            LocalDateTime debut = LocalDateTime.of(2026, 6, 8, 8, 30);
            LocalDateTime fin = LocalDateTime.of(2026, 6, 8, 11, 45);

            Evenement evenement = new Evenement(debut, fin);

            assertEquals(debut, evenement.getHeureDebut());
            assertEquals(fin, evenement.getHeureFin());
        }
    }

    @Nested
    class CoursTest {
        @Test
        void testConstructeurCompletCours() {
            LocalDateTime debut = LocalDateTime.of(2026, 6, 8, 14, 0);
            LocalDateTime fin = LocalDateTime.of(2026, 6, 8, 16, 0);
            UniteEnseignement ue = new UniteEnseignement("POO Java", 6);
            Prof prof = new Prof("Ramarozaka", "T.", 45, Genre.Homme);

            Cours cours = new Cours(debut, fin, ue, prof);

            assertEquals(debut, cours.getHeureDebut());
            assertEquals(fin, cours.getHeureFin());

            assertEquals(ue, cours.getUe());
            assertEquals(prof, cours.getProf());
        }

        @Test
        void testSettersCours() {
            Cours cours = new Cours();
            Prof prof = new Prof();
            UniteEnseignement ue = new UniteEnseignement();

            cours.setProf(prof);
            cours.setUe(ue);

            assertNotNull(cours.getProf());
            assertNotNull(cours.getUe());
        }
    }

    @Nested
    class SeminaireTest {
        @Test
        void testConstructeurEtResponsable() {
            LocalDateTime debut = LocalDateTime.of(2026, 7, 10, 9, 0);
            LocalDateTime fin = LocalDateTime.of(2026, 7, 10, 12, 0);
            Personne responsable = new Personne("Rakotonirainy", "H.", 50, Genre.Homme);

            Seminaire seminaire = new Seminaire(debut, fin, responsable);

            assertEquals(debut, seminaire.getHeureDebut());
            assertEquals(responsable, seminaire.getResponsable());
            assertEquals("Rakotonirainy", seminaire.getResponsable().getNom());
        }
    }
}