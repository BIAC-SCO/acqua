<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Connexion</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Utilisateur"
                    ref="loginElement"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="username"
                    @keypress.enter="login"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    label="Mot de passe"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    @keypress.enter="login"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :loading="loading" @click="login">Se connecter</v-btn>
              </v-card-actions>
              <v-card-text v-if="errorMessage != ''">
                <v-alert type="warning">{{ errorMessage }}</v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { UserLogin } from '@/models/Login/UserLogin';

@Component({
  name: 'Login'
})
export default class extends Vue {
  public username = '';
  public password = '';
  public loading = false;
  public errorMessage = '';

  public login() {
    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this;
    const userLogin = new UserLogin();
    userLogin.userName = username;
    userLogin.password = password;
    UserModule.login(userLogin)
      .then(() => {
        this.username = '';
        this.password = '';
        this.$router.push('/');
      })
      .catch((reason) => {
        this.errorMessage = reason;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
