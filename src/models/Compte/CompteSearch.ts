export class CompteSearchDTO {
  numero = 0;
  nom = '';
  raisonSocial = '';
  adresse = '';
  codeTVAIntracommunautaire = '';
  compteBloque = false;
}

export class CompteSearch extends CompteSearchDTO {
  constructor(dto: CompteSearchDTO) {
    super();
    Object.assign(this, dto);
  }

  get fullName(): string {
    return `${this.numero} - ${this.nom}`;
  }

  get numeroNom(): string {
    return `${this.numero ? this.numero : ''} ${this.nom}`.trim();
  }

  get compteBloqueDisplay() {
    return this.compteBloque ? 'Bloqué' : '';
  }
}
