<template>
  <v-dialog v-model="dialog" width="900" scrollable @click:outside="closeDialog" @keydown.esc="closeDialog()">
    <v-form ref="form" v-model="isValid">
      <v-card>
        <v-card-title class="d-flex justify-start">
          <div class="font-weight-light mr-2">Permissions de</div>
          <div class="font-weight-medium mr-2">{{ applicationNom }}</div>
          <div v-if="utilisateur.ID" class="font-weight-light mr-2">pour</div>
          <div v-if="utilisateur.ID" class="font-weight-medium mr-5">{{ utilisateur.NomPrenom }}</div>
          <v-spacer></v-spacer>
          <v-btn ref="buttonClose" class="ml-10" icon @click="closeDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="ml-0 mr-0 pl-0 pr-0">
          <v-data-table
            :headers="headersPermissions"
            :items="permissions"
            disable-pagination
            hide-default-footer
            dense
            sort-by="Nom"
            :loading="loading"
            :show-select="!isReadOnly"
            item-key="Id"
            v-model="selected"
          ></v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions v-if="!isReadOnly" class="d-flex">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            class="ma-2 mt-0 pr-4 align-self-start"
            tile
            outlined
            @click="closeDialog()"
            tabindex="-1"
          >
            <v-icon left>mdi-close</v-icon>Fermer
          </v-btn>
          <v-btn
            ref="btnValidate"
            class="ma-2 mt-0 pr-4 align-self-start"
            tile
            color="success"
            :disabled="!isValid"
            @click="save()"
          >
            <v-icon left>mdi-checkbox-marked-circle</v-icon>Valider
          </v-btn>
        </v-card-actions>
        <v-alert type="error" border="left" v-if="errorMessage" class="ml-4 mr-4">{{ errorMessage }}</v-alert>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Permission } from '@/models/GestionUtilisateur/Permission';
import { Application } from '@/models/GestionUtilisateur/Application';
import { GestionUtilisateurApi } from '../../../api/GestionUtilisateurApi';
import { Utilisateur } from '../../../models/Login/Utilisateur';

@Component({
  name: 'GridPermissions'
})
export default class extends Vue {
  private applicationId = '';
  private applicationNom = '';
  private permissions: Permission[] = [];
  private permissionsUtilisateur: Permission[] = [];
  private utilisateur: Utilisateur = new Utilisateur();
  private loading = false;
  private errorMessage = '';

  private selected: Permission[] = [];

  private isReadOnly = false;
  public isValid = false;
  public dialog = false;
  private resolve!: any;
  private reject!: any;

  private headersPermissions = [
    { text: 'Nom', value: 'Nom', width: 150 },
    { text: 'Description', value: 'Description', width: 300 }
  ];

  public open(
    application: Application,
    utilisateur: Utilisateur,
    permissions: Permission[],
    readOnly: boolean
  ): Promise<Permission[]> {
    this.dialog = true;
    this.isReadOnly = readOnly;
    this.permissionsUtilisateur = permissions ? Array.from(permissions) : [];
    this.applicationId = application.Id;
    this.applicationNom = application.Nom;
    this.utilisateur = utilisateur;
    this.loadPermissions();

    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  private loadPermissions() {
    try {
      this.permissions = [];
      this.selected = [];
      this.loading = true;
      GestionUtilisateurApi.getPermissionsForApplication(this.applicationId).then((resp) => {
        if (this.isReadOnly) {
          resp.forEach((permission) => {
            if (this.permissionsUtilisateur.find((e) => e.Id === permission.Id)) {
              this.permissions.push(permission);
            }
          });
        } else {
          this.permissions = resp;
          this.givePermissions();
        }
      });
    } catch (err) {
      this.errorMessage = err;
    } finally {
      this.loading = false;
    }
  }

  private givePermissions() {
    this.permissions.forEach((permission) => {
      if (this.permissionsUtilisateur.find((e) => e.Id === permission.Id)) this.selected.push(permission);
    });
  }

  private closeDialog() {
    this.dialog = false;
    this.reject();
  }

  private save() {
    (this.$refs.form as any).validate();
    if (this.isValid) {
      this.dialog = false;
      this.resolve(this.getModel());
    }
  }

  private getModel(): Permission[] {
    this.permissionsUtilisateur = this.permissionsUtilisateur.filter((e) => e.ApplicationId !== this.applicationId);
    this.selected.forEach((element) => {
      this.permissionsUtilisateur.push(element);
    });
    return this.permissionsUtilisateur;
  }
}
</script>

<style scopped>
#dataTable tbody tr {
  cursor: pointer;
}
</style>
