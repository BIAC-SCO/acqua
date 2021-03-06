import { JsonObject, JsonProperty } from 'json2typescript';
// import { Permission } from "./Permission";

@JsonObject('Utilisateur')
export class Utilisateur {
  @JsonProperty('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name', String)
  public ID = '';
  @JsonProperty('Name', String)
  public NomPrenom = '';
  @JsonProperty('Roles', [String])
  public Permissions: string[] = [];
}
