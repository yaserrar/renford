/*
  Mission + Diplôme enum migration
  - Expands TypeMission to generated mission keys.
  - Introduces Diplome enum and converts text columns.
  - Applies best-effort mapping from legacy values.
*/

BEGIN;

CREATE TYPE "TypeMission_new" AS ENUM (
  'matwork',
  'reformer',
  'hot_pilates',
  'cadillac',
  'chair_wunda_chair',
  'petits_materiels',
  'pilates_prenatal_postnatal',
  'lagree_fitness',
  'hatha_yoga',
  'vinyasa_yoga',
  'ashtanga_yoga',
  'yin_yoga',
  'hot_yoga',
  'kundalini_yoga',
  'yoga_prenatal_postnatal',
  'yoga_nidra',
  'yoga_flow',
  'qi_gong_tai_chi',
  'caf_cuisses_abdos_fessiers',
  'lia_low_impact_aerobic',
  'step',
  'hiit',
  'circuit_training',
  'cross_training_crossfit',
  'trx',
  'biking_spinning',
  'body_barre',
  'stretching_mobilite',
  'cardio_boxing',
  'bootcamp',
  'gym_posturale_dos',
  'ems_electrostimulation',
  'preparation_physique_generale',
  'body_pump',
  'body_attack',
  'body_combat',
  'body_step',
  'body_balance',
  'body_jam',
  'rpm',
  'zumba_classique',
  'zumba_kids',
  'strong_toning',
  'zumba_step',
  'zumba_gold',
  'zumba_sentoa',
  'zumba_in_the_circuit',
  'zumba_strong',
  'aqua_zumba',
  'educateur_sportif_multisport',
  'animateur_sportif_enfants_ados',
  'intervenant_scolaire_eps',
  'animateur_sport_sante_seniors_apa',
  'animateur_aquatique',
  'hote_hotesse_d_accueil_sportif',
  'encadrement_en_salle_bloc_voie',
  'encadrement_en_milieu_naturel',
  'ouvreur_de_voies_blocs',
  'encadrement_escalade_performance',
  'cours_enfants_ados',
  'initiation_loisirs_adultes',
  'boxe_anglaise',
  'boxe_francaise_savate',
  'kickboxing',
  'karate',
  'judo',
  'mma',
  'muay_thai',
  'boxe_educative_enfants_ados',
  'cardio_boxe_boxe_fitness',
  'coaching_boxe_loisir_ou_competiteur',
  'danse_classique',
  'danse_contemporaine',
  'jazz_modern_jazz',
  'hip_hop_street_dance',
  'ragga_dancehall',
  'danses_latines_salsa_bachata',
  'danse_africaine',
  'danse_enfants',
  'barre_au_sol',
  'massages_bien_etre_sportifs',
  'kinesitherapie_sportive_hors_acte_medical',
  'massage_deep_tissue_recuperation',
  'reflexologie',
  'relaxation_coherence_cardiaque',
  'sonotherapie_bains_sonores',
  'sophrologie',
  'meditation_pleine_conscience',
  'stretch_and_mobilite_douce',
  'cryotherapie_pressotherapie',
  'nutrition_dietetique',
  'preparation_mentale'
);

CREATE TYPE "Diplome_new" AS ENUM (
  'bpjeps_af_mention_cours_collectifs',
  'bpjeps_af_mention_halterophilie_musculation',
  'bpjeps_mapst',
  'bpjeps_apt',
  'bpjeps_ltp',
  'bpjeps_agff_ancienne_appellation',
  'dejeps_option_force_athletique_musculation',
  'dejeps_perfectionnement_sportif',
  'dejeps_specialite_sportive',
  'desjeps_performance_sportives',
  'licence_staps_management_du_sport',
  'licence_staps_education_et_motricite',
  'licence_staps_entrainement_sportif',
  'licence_staps_apa',
  'master_staps_apa',
  'master_staps_entrainement_sportif',
  'master_staps_preparation_physique',
  'master_staps_management_du_sport',
  'cqp_if_option_cours_collectifs',
  'cqp_if_option_musculation_and_personal_training',
  'cqp_als_option_agee',
  'bees_metiers_de_la_forme',
  'du_preparation_physique',
  'certification_yoga',
  'certification_pilates',
  'certification_zumba',
  'bpjeps_escalade',
  'dejeps_escalade',
  'cqp_escalade',
  'bees_escalade',
  'desjeps_escalade'
);

ALTER TABLE "profils_renford"
ADD COLUMN "typeMission_tmp" "TypeMission_new"[] NOT NULL DEFAULT ARRAY[]::"TypeMission_new"[],
ADD COLUMN "diplomes_tmp" "Diplome_new"[] NOT NULL DEFAULT ARRAY[]::"Diplome_new"[];

UPDATE "profils_renford"
SET "typeMission_tmp" = COALESCE(
  (
    SELECT array_agg(mapped_key::"TypeMission_new" ORDER BY ord)
    FROM (
      SELECT CASE old_value
        WHEN 'coaching_individuel' THEN 'preparation_physique_generale'
        WHEN 'sessions_en_groupe' THEN 'circuit_training'
        WHEN 'ateliers_workshops' THEN 'educateur_sportif_multisport'
        WHEN 'evenements_speciaux' THEN 'bootcamp'
        WHEN 'consultation_accompagnement' THEN 'nutrition_dietetique'
        WHEN 'programmes_specifiques' THEN 'preparation_physique_generale'
        WHEN 'encadrement_enfants_adolescents' THEN 'animateur_sportif_enfants_ados'
        WHEN 'formation_certification' THEN 'educateur_sportif_multisport'
        WHEN 'suivi_evaluation_clients' THEN 'preparation_mentale'
        WHEN 'encadrement_competitions' THEN 'coaching_boxe_loisir_ou_competiteur'
        WHEN 'animation_activites_loisirs' THEN 'initiation_loisirs_adultes'
        WHEN 'seances_initiation' THEN 'initiation_loisirs_adultes'
        WHEN 'consulting_amelioration_performances' THEN 'preparation_mentale'
        ELSE NULL
      END AS mapped_key,
      ord
      FROM unnest(COALESCE("typeMission"::text[], ARRAY[]::text[])) WITH ORDINALITY AS t(old_value, ord)
    ) mapped
    WHERE mapped_key IS NOT NULL
  ),
  ARRAY[]::"TypeMission_new"[]
);

UPDATE "profils_renford"
SET "diplomes_tmp" = COALESCE(
  (
    SELECT array_agg(mapped_key::"Diplome_new" ORDER BY ord)
    FROM (
      SELECT CASE old_value
        WHEN 'licence_sciences_et_techniques_des_activites_physiques_et_sportives' THEN 'licence_staps_entrainement_sportif'
        WHEN 'master_sciences_et_techniques_des_activites_physiques_et_sportives' THEN 'master_staps_entrainement_sportif'
        WHEN 'doctorat_en_sciences_du_sport' THEN 'master_staps_preparation_physique'
        WHEN 'brevet_professionnel_de_la_jeunesse_de_l_education_populaire_et_du_sport' THEN 'bpjeps_af_mention_cours_collectifs'
        WHEN 'diplome_d_etat_de_la_jeunesse_de_l_education_populaire_et_du_sport' THEN 'dejeps_perfectionnement_sportif'
        WHEN 'diplome_d_etat_superieur_de_la_jeunesse_de_l_education_populaire_et_du_sport' THEN 'desjeps_performance_sportives'
        WHEN 'certificat_de_qualification_professionnelle' THEN 'cqp_if_option_cours_collectifs'
        WHEN 'brevet_federal' THEN 'bees_metiers_de_la_forme'
        WHEN 'brevet_d_etat_d_educateur_sportif' THEN 'bees_metiers_de_la_forme'
        WHEN 'certificat_d_aptitude_a_l_enseignement_de_la_danse' THEN 'cqp_als_option_agee'
        WHEN 'diplome_d_etat_de_masseur_kinesitherapeute' THEN 'du_preparation_physique'
        WHEN 'diplome_de_preparateur_physique' THEN 'du_preparation_physique'
        ELSE old_value
      END AS mapped_key,
      ord
      FROM unnest(COALESCE("diplomes", ARRAY[]::text[])) WITH ORDINALITY AS t(old_value, ord)
    ) mapped
    WHERE mapped_key = ANY (ARRAY[
      'bpjeps_af_mention_cours_collectifs',
      'bpjeps_af_mention_halterophilie_musculation',
      'bpjeps_mapst',
      'bpjeps_apt',
      'bpjeps_ltp',
      'bpjeps_agff_ancienne_appellation',
      'dejeps_option_force_athletique_musculation',
      'dejeps_perfectionnement_sportif',
      'dejeps_specialite_sportive',
      'desjeps_performance_sportives',
      'licence_staps_management_du_sport',
      'licence_staps_education_et_motricite',
      'licence_staps_entrainement_sportif',
      'licence_staps_apa',
      'master_staps_apa',
      'master_staps_entrainement_sportif',
      'master_staps_preparation_physique',
      'master_staps_management_du_sport',
      'cqp_if_option_cours_collectifs',
      'cqp_if_option_musculation_and_personal_training',
      'cqp_als_option_agee',
      'bees_metiers_de_la_forme',
      'du_preparation_physique',
      'certification_yoga',
      'certification_pilates',
      'certification_zumba',
      'bpjeps_escalade',
      'dejeps_escalade',
      'cqp_escalade',
      'bees_escalade',
      'desjeps_escalade'
    ]::text[])
  ),
  ARRAY[]::"Diplome_new"[]
);

ALTER TABLE "renford_diplomes"
ADD COLUMN "typeDiplome_tmp" "Diplome_new";

UPDATE "renford_diplomes"
SET "typeDiplome_tmp" = (
  CASE
    WHEN "typeDiplome" = ANY (ARRAY[
      'bpjeps_af_mention_cours_collectifs',
      'bpjeps_af_mention_halterophilie_musculation',
      'bpjeps_mapst',
      'bpjeps_apt',
      'bpjeps_ltp',
      'bpjeps_agff_ancienne_appellation',
      'dejeps_option_force_athletique_musculation',
      'dejeps_perfectionnement_sportif',
      'dejeps_specialite_sportive',
      'desjeps_performance_sportives',
      'licence_staps_management_du_sport',
      'licence_staps_education_et_motricite',
      'licence_staps_entrainement_sportif',
      'licence_staps_apa',
      'master_staps_apa',
      'master_staps_entrainement_sportif',
      'master_staps_preparation_physique',
      'master_staps_management_du_sport',
      'cqp_if_option_cours_collectifs',
      'cqp_if_option_musculation_and_personal_training',
      'cqp_als_option_agee',
      'bees_metiers_de_la_forme',
      'du_preparation_physique',
      'certification_yoga',
      'certification_pilates',
      'certification_zumba',
      'bpjeps_escalade',
      'dejeps_escalade',
      'cqp_escalade',
      'bees_escalade',
      'desjeps_escalade'
    ]::text[]) THEN "typeDiplome"::"Diplome_new"
    WHEN "typeDiplome" = 'licence_sciences_et_techniques_des_activites_physiques_et_sportives' THEN 'licence_staps_entrainement_sportif'::"Diplome_new"
    WHEN "typeDiplome" = 'master_sciences_et_techniques_des_activites_physiques_et_sportives' THEN 'master_staps_entrainement_sportif'::"Diplome_new"
    WHEN "typeDiplome" = 'doctorat_en_sciences_du_sport' THEN 'master_staps_preparation_physique'::"Diplome_new"
    WHEN "typeDiplome" = 'brevet_professionnel_de_la_jeunesse_de_l_education_populaire_et_du_sport' THEN 'bpjeps_af_mention_cours_collectifs'::"Diplome_new"
    WHEN "typeDiplome" = 'diplome_d_etat_de_la_jeunesse_de_l_education_populaire_et_du_sport' THEN 'dejeps_perfectionnement_sportif'::"Diplome_new"
    WHEN "typeDiplome" = 'diplome_d_etat_superieur_de_la_jeunesse_de_l_education_populaire_et_du_sport' THEN 'desjeps_performance_sportives'::"Diplome_new"
    WHEN "typeDiplome" = 'certificat_de_qualification_professionnelle' THEN 'cqp_if_option_cours_collectifs'::"Diplome_new"
    WHEN "typeDiplome" = 'brevet_federal' THEN 'bees_metiers_de_la_forme'::"Diplome_new"
    WHEN "typeDiplome" = 'brevet_d_etat_d_educateur_sportif' THEN 'bees_metiers_de_la_forme'::"Diplome_new"
    WHEN "typeDiplome" = 'certificat_d_aptitude_a_l_enseignement_de_la_danse' THEN 'cqp_als_option_agee'::"Diplome_new"
    WHEN "typeDiplome" = 'diplome_d_etat_de_masseur_kinesitherapeute' THEN 'du_preparation_physique'::"Diplome_new"
    WHEN "typeDiplome" = 'diplome_de_preparateur_physique' THEN 'du_preparation_physique'::"Diplome_new"
    ELSE NULL
  END
);

DELETE FROM "renford_diplomes" WHERE "typeDiplome_tmp" IS NULL;

ALTER TABLE "renford_diplomes" DROP COLUMN "typeDiplome";
ALTER TABLE "renford_diplomes" RENAME COLUMN "typeDiplome_tmp" TO "typeDiplome";
ALTER TABLE "renford_diplomes" ALTER COLUMN "typeDiplome" SET NOT NULL;
CREATE INDEX IF NOT EXISTS "renford_diplomes_typeDiplome_idx" ON "renford_diplomes"("typeDiplome");

ALTER TABLE "profils_renford" DROP COLUMN "typeMission", DROP COLUMN "diplomes";
ALTER TABLE "profils_renford" RENAME COLUMN "typeMission_tmp" TO "typeMission";
ALTER TABLE "profils_renford" RENAME COLUMN "diplomes_tmp" TO "diplomes";

ALTER TYPE "TypeMission" RENAME TO "TypeMission_old";
ALTER TYPE "TypeMission_new" RENAME TO "TypeMission";
DROP TYPE "public"."TypeMission_old";

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Diplome') THEN
    EXECUTE 'ALTER TYPE "Diplome" RENAME TO "Diplome_old"';
  END IF;
END $$;

ALTER TYPE "Diplome_new" RENAME TO "Diplome";
DROP TYPE IF EXISTS "public"."Diplome_old";

COMMIT;
