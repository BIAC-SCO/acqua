<template>
  <v-dialog v-model="dialog" :width="1750" @keydown.f2="ModifierUtilisateur">
    <v-form ref="form" v-model="isValid" lazy-validation autocomplete="off">
      <v-card>
        <v-toolbar color="primary" dark flat>
          <v-card-title class="d-flex justify-start">
            <div v-if="utilisateur.ID" class="font-weight-light mr-2">Code</div>
            <div v-if="utilisateur.ID" class="font-weight-medium mr-5">{{ utilisateur.ID }}</div>

            <div v-if="utilisateur.ID" class="font-weight-light mr-2">Nom</div>
            <div v-if="utilisateur.ID" class="font-weight-medium mr-5">{{ utilisateur.NomPrenom }}</div>

            <div v-if="!utilisateur.ID" class="font-weight-light mr-2">Nouveau utilisateur</div>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn class="mr-5" color="success" @click="ModifierUtilisateur" v-if="utilisateurReadonly">
            <v-icon left>mdi-pencil</v-icon>Modifier
          </v-btn>
          <v-btn ref="buttonClose" class="ml-10" icon color="white" @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col cols="8">
              <v-row class="ma-0 pa-0">
                <v-card-title class="font-weight-medium ma-0 pa-0 ml-2">Informations générales</v-card-title>
              </v-row>
              <v-row class="mt-5">
                <v-col>
                  <v-text-field
                    label="Id"
                    ref="code"
                    v-model="code"
                    :value="code"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    :rules="codeRules"
                    :error-messages="codeErrorMessage"
                    autofocus
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Nom prénom"
                    ref="nomPrenom"
                    v-model="nomPrenom"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    :rules="nomRules"
                    validate-on-blur
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                  <!-- <v-text-field
                    v-else
                    label="Nom prénom"
                    ref="nomPrenom"
                    v-model="nomPrenom"
                    :value="nomPrenom"
                    :rules="nomRules"
                    validate-on-blur
                    autofocus
                    prepend-inner-icon="mdi-account-box"
                  ></v-text-field> -->
                  <!-- <v-text-field
                    v-else
                    label="Code"
                    ref="code"
                    v-model="code"
                    :value="code"
                    readonly
                    tabindex="-1"
                    validate-on-blur
                    prepend-inner-icon="mdi-account"
                  ></v-text-field> -->
                  <v-text-field
                    label="Mot de passe"
                    ref="motDePasse"
                    v-model="motDePasse"
                    type="password"
                    :value="motDePasse"
                    :readonly="utilisateurReadonly"
                    :filled="utilisateurReadonly"
                    :rules="nomRules"
                    validate-on-blur
                    prepend-inner-icon="mdi-lock"
                    autocomplete="off"
                  ></v-text-field>
                  <!-- <v-text-field
                    v-else
                    label="Mot de passe"
                    ref="motDePasse"
                    v-model="motDePasse"
                    type="password"
                    :value="motDePasse"
                    :rules="nomRules"
                    validate-on-blur
                    prepend-inner-icon="mdi-lock"
                    autocomplete="off"
                  ></v-text-field> -->
                  <v-text-field
                    label="ID active directory"
                    ref="idActiveDirectory"
                    v-model="idActiveDirectory"
                    :value="idActiveDirectory"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Fonction"
                    ref="fonction"
                    v-model="fonction"
                    :value="fonction"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    validate-on-blur
                    prepend-inner-icon="mdi-briefcase"
                  ></v-text-field>
                  <v-select
                    label="Département"
                    persistent-hint
                    v-model="departement"
                    :filled="utilisateurReadonly"
                    :items="departements"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-sitemap"
                  ></v-select>
                  <v-select
                    label="Langue"
                    persistent-hint
                    :items="langues"
                    v-model="langue"
                    :readonly="utilisateurReadonly"
                    :filled="utilisateurReadonly"
                    prepend-inner-icon="mdi-translate"
                  ></v-select>
                </v-col>
                <v-col>
                  <v-text-field
                    label="Adresse 1"
                    ref="adresseLigne1"
                    v-model="adresseLigne1"
                    :value="adresseLigne1"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-map-marker"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Adresse 2"
                    ref="adresseLigne2"
                    v-model="adresseLigne2"
                    :value="adresseLigne2"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-map-marker"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Adresse 3"
                    ref="adresseLigne3"
                    v-model="adresseLigne3"
                    :value="adresseLigne3"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-map-marker"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Téléphone"
                    ref="telephone"
                    v-model="telephone"
                    :value="telephone"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-phone"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Numéro interne"
                    ref="numeroInterne"
                    v-model="numeroInterne"
                    :value="numeroInterne"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-phone"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Fax"
                    ref="fax"
                    v-model="fax"
                    :value="fax"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-fax"
                    validate-on-blur
                  ></v-text-field>
                  <v-text-field
                    label="Email"
                    ref="email"
                    v-model="email"
                    :value="email"
                    :filled="utilisateurReadonly"
                    :readonly="utilisateurReadonly"
                    prepend-inner-icon="mdi-email"
                    validate-on-blur
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="auto">
              <v-divider vertical> </v-divider>
            </v-col>
            <v-col cols="auto">
              <v-row class="ma-0 pa-0">
                <v-card-title class="font-weight-medium ma-0 pa-0 ml-2">Permissions</v-card-title>
              </v-row>
              <v-row fill-height>
                <GridApplications
                  ref="gridApplications"
                  :Applications.sync="applications"
                  :Permissions.sync="permissions"
                  :IsReadOnly.sync="utilisateurReadonly"
                  :Utilisateur.sync="utilisateur"
                ></GridApplications>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider v-if="!utilisateurReadonly"></v-divider>
        <v-card-actions v-if="!utilisateurReadonly" class="d-flex">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            class="ma-2 mt-0 pr-4 align-self-start"
            tile
            outlined
            @click="cancelEdit()"
            tabindex="-1"
          >
            <v-icon left>mdi-close</v-icon>Annuler
          </v-btn>
          <v-btn
            ref="btnValidate"
            class="ma-2 mt-0 pr-4 align-self-start"
            tile
            color="success"
            :loading="saveLoading"
            :disabled="!isValid"
            @click="save()"
          >
            <v-icon left>mdi-content-save</v-icon>Sauvegarder
          </v-btn>
        </v-card-actions>
        <v-alert type="error" border="left" v-if="errorMessage" class="ml-4 mr-4">{{ errorMessage }}</v-alert>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Utilisateur } from '@/models/GestionUtilisateur/Utilisateur';
import { Permission } from '@/models/GestionUtilisateur/Permission';
import ImageUploader from '@/components/imageUploader/imageUploader.vue';
import { GestionUtilisateurApi } from '@/api/GestionUtilisateurApi';
import DepartementApi from '@/api/DepartementApi';
import GridApplications from './GridApplications.vue';
import { displayAxiosError } from '@/utils/ErrorMethods';
import { Application } from '../../../models/GestionUtilisateur/Application';

@Component({
  name: 'UtilisateurEdition',
  components: { GridApplications, ImageUploader }
})
export default class extends Vue {
  public utilisateurReadonly = true;
  private errorMessage = '';
  private isValid = true;

  private Avatar: any = null;
  private nomRules: any = [(v: string) => !!v || !this.utilisateurReadonly || 'Valeur obligatoire'];

  //Statiques
  private departements: string[] = [];
  private langues: string[] = ['Français', 'Deutsch', 'English'];

  //Titre
  private utilisateur: Utilisateur = new Utilisateur();
  private numeroUtilisateur = '';

  //Edition Pemissions
  private permissions: Permission[] = [];
  private applications: Application[] = [];

  //Encodage
  private nomPrenom = '';
  private code = '';
  private codeRules: any = [(v: string) => !!v || !this.utilisateurReadonly || 'Valeur obligatoire'];
  private codeErrorMessage = '';

  private motDePasse = '';
  private idActiveDirectory = '';
  private fonction = '';
  private departement = '';
  private langue = '';
  private adresseLigne1 = '';
  private adresseLigne2 = '';
  private adresseLigne3 = '';
  private telephone = '';
  private numeroInterne = '';
  private fax = '';
  private email = '';

  private isEdit = false;
  public dialog = false;
  private resolve!: any;
  private reject!: any;

  private isErrorLoading = false;
  mounted() {
    this.loadDepartements();
  }

  private async loadDepartements() {
    try {
      const departements = await DepartementApi.getDepartements();
      this.departements = departements.map((e) => e.Nom);
      this.departements.unshift('');
    } catch (err) {
      this.isErrorLoading = true;
    }
  }

  public open(utilisateur: Utilisateur, apps: Application[]): Promise<Utilisateur> {
    this.dialog = true;
    this.utilisateurReadonly = !!utilisateur;
    this.applications = apps;
    this.setUtilisateur(utilisateur);
    // this.$nextTick(() => (this.$refs.numeroCompteTier as any)?.focus());
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  private setUtilisateur(utilisateur: Utilisateur) {
    this.utilisateur = utilisateur ? utilisateur : new Utilisateur();
    this.numeroUtilisateur = utilisateur?.ID;

    this.permissions = utilisateur?.Permissions;
    this.nomPrenom = utilisateur?.NomPrenom;
    this.code = utilisateur?.ID;
    //this.motDePasse = !!utilisateur ? "xxxxxxx" : "";
    this.idActiveDirectory = utilisateur?.IdActiveDirectory;
    this.fonction = utilisateur?.Fonction;
    this.departement = utilisateur?.Departement;
    this.langue = utilisateur?.Langue;
    this.adresseLigne1 = utilisateur?.AdresseLigne1;
    this.adresseLigne2 = utilisateur?.AdresseLigne2;
    this.adresseLigne3 = utilisateur?.AdresseLigne3;
    this.telephone = utilisateur?.Telephone;
    this.numeroInterne = utilisateur?.TelephoneInterne;
    this.fax = utilisateur?.Fax;
    this.email = utilisateur?.Email;
  }

  @Watch('code')
  private async validateId() {
    if (this.utilisateur.ID !== this.code && (await GestionUtilisateurApi.idExist(this.code)))
      this.codeErrorMessage = "L'id est déjà utilisé";
    else this.codeErrorMessage = '';
  }

  private async ModifierUtilisateur() {
    this.utilisateurReadonly = false;
    this.$nextTick(() => (this.$refs.nomPrenom as any)?.focus());
  }

  private saveLoading = false;
  private saveUtilisateur() {
    (this.$refs.form as any).validate();
    this.$nextTick(() => {
      if (this.isValid) {
        this.save();
      }
    });
  }

  private save() {
    this.saveLoading = true;
    this.errorMessage = '';
    const model = this.getModelToSave();
    this.utilisateurReadonly = true;
    GestionUtilisateurApi.save(model)
      .then((resp) => {
        this.resolve(resp);
        this.dialog = false;
      })
      .catch((err) => {
        this.errorMessage = displayAxiosError(err);
        this.utilisateurReadonly = false;
      })
      .finally(() => {
        this.saveLoading = false;
      });
  }

  private getModelToSave(): Utilisateur {
    this.utilisateur.ID = this.code;
    this.utilisateur.NomPrenom = this.nomPrenom;
    this.utilisateur.MotDePasseApollo = this.motDePasse;
    this.utilisateur.IdActiveDirectory = this.idActiveDirectory;
    this.utilisateur.Fonction = this.fonction;
    this.utilisateur.Departement = this.departement;
    this.utilisateur.Langue = this.langue;
    this.utilisateur.AdresseLigne1 = this.adresseLigne1;
    this.utilisateur.AdresseLigne2 = this.adresseLigne2;
    this.utilisateur.AdresseLigne3 = this.adresseLigne3;
    this.utilisateur.Telephone = this.telephone;
    this.utilisateur.TelephoneInterne = this.numeroInterne;
    this.utilisateur.Fax = this.fax;
    this.utilisateur.Email = this.email;
    this.utilisateur.Permissions = this.permissions;
    return this.utilisateur;
  }

  private cancelEdit() {
    if (this.utilisateur.ID) {
      this.utilisateurReadonly = true;
      this.setUtilisateur(this.utilisateur);
    } else this.closeDialog();
  }

  private closeDialog() {
    this.dialog = false;
    this.reject();
  }
}
</script>

<style>
.textMini {
  font-size: 12px;
}

.warningMessage {
  color: #fb8c00;
  font-weight: 500;
}
</style>
