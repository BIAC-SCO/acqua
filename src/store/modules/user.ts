import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import axios from 'axios'
import { Token } from '@/models/Token';
import store from '@/store/index';
import { Utilisateur } from '@/models/Utilisateur';

export interface IUserState {
  token: string
  username: string
  expire: string
  status: string
  hasLoadedOnce: boolean
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {

  public token: string = localStorage.getItem("user-token") || "";
  public expire: string = localStorage.getItem("token-expire") || "";
  public status: string = '';
  public username: string = '';
  public hasLoadedOnce: boolean = false;

  @Mutation
  private SET_TOKEN(resp: Token): void {
    var dateExpire: string = (((resp.expires_in * 1000) + Date.now()).toString());
    localStorage.setItem("user-token", resp.value);
    localStorage.setItem("token-expire", dateExpire);
    this.token = resp.value;
    this.expire = dateExpire;
    this.status = "success";
    this.hasLoadedOnce = true;
  };

  @Mutation
  private SET_USER(resp: Utilisateur): void {
    this.username = resp.NomPrenom;
  };

  @Mutation
  private LOGIN_FAIL(): void {
    this.status = "error";
    this.hasLoadedOnce = true;
  };

  @Mutation
  private RESET_TOKEN(): void {
    localStorage.removeItem("user-token");
    this.token = "";
    localStorage.removeItem("token-expire");
    this.expire = "";
  };

  @Action
  public Login(userInfo: { username: string, password: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      axios.post<Token>(process.env.VUE_APP_ApiAuth + "/Authentication/Login", userInfo)
        .then((resp) => {
          this.SET_TOKEN(resp.data);
          resolve(resp);
        })
        .catch((err) => {
          this.LOGIN_FAIL();
          let errorMessage: string = "Impossible de se connecter au serveur d'authentification";
          if (err.response && err.response.status === 400) {
            errorMessage = err.response.data.Message;
          }
          reject(errorMessage);
        });
    });
  }

  @Action
  public LoadUser() {
    return new Promise((resolve, reject) => {
      const header = `Bearer ${this.token}`;
      axios.get<Utilisateur>(`${process.env.VUE_APP_ApiGestionUser}/User/GetUserLog/ACQUA`, { withCredentials: false, headers: { Authorization: header } })
        .then((resp) => {
          this.SET_USER(resp.data)
          resolve(resp);
        })
        .catch((err) => {
          this.RESET_TOKEN();
          let errorMessage: string = "Impossible de se connecter au serveur de gestion des droits";
          if (err.response && err.response.status === 400) {
            errorMessage = err.response.data.Message;
          }
          reject(errorMessage);
        });
    });
  }

  @Action
  public Logout() {
    this.RESET_TOKEN();
  }
}

export const UserModule = getModule(User);