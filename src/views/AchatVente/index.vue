<template>
  <v-container
    fluid
    @keydown.107.prevent="openPieceComptable()"
    @keydown.page-up="nextPage()"
    @keydown.page-down="previousPage()"
  >
    <v-card>
      <v-form ref="form" v-model="searchIsValid">
        <v-row align="start" justify="start" class="pl-5 pr-5">
          <v-col cols="12" xs="12" md="4" lg="2">
            <v-select
              autofocus
              label="Sélection de la période"
              outlined
              persistent-hint
              required
              return-object
              item-text="typePeriodeComptableLibelle"
              v-model="periodeSelected"
              :items="periodes"
              :loading="periodeIsLoading"
              :hint="periodeSelected.libellePeriode"
              :rules="periodesRules"
              @change="loadPiecesComptables"
            ></v-select>
          </v-col>
          <v-col cols="12" xs="12" md="6" lg="3">
            <v-select
              v-model="journalSelected"
              :items="journaux"
              label="Sélection du journal"
              outlined
              :loading="journauxIsLoading"
              item-text="fullLibelle"
              item-value="numero"
              :hint="`Devise ${journalSelected.devise} - Dernière pièce ${journalSelected.numeroDernierePiece}`"
              return-object
              persistent-hint
              @change="loadPiecesComptables"
              :rules="journalRules"
              required
            >
            </v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
    <v-card class="mt-5">
      <v-card-title>
        Pièces comptables
        <v-tooltip top open-delay="500">
          <template v-slot:activator="{ on }">
            <v-btn
              ref="btnAdd"
              color="warning"
              small
              fab
              class="ml-5"
              :disabled="!searchIsValid"
              @click="openPieceComptable()"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>Créer une nouvelle pièce <span class="shortcutTooltip">+</span></span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Rechercher"
          single-line
          hide-details
          @keydown.enter="loadPiecesComptables()"
        ></v-text-field>
      </v-card-title>
      <v-data-table
        id="dataTable"
        :headers="headers"
        :items="piecesComptables"
        :search="search"
        :loading="isLoadingPieces"
        @click:row="openPieceComptable"
        :options.sync="options"
        :server-items-length="totalItems"
        :page.sync="currentPage"
        @page-count="pageCount = $event"
      >
        <template v-slot:[`item.isEquilibre`]="{ item }">
          <v-tooltip top open-delay="500">
            <template v-slot:activator="{ on }">
              <v-icon v-show="!item.isEquilibre" color="red" v-on="on">mdi-alert</v-icon>
            </template>
            <span>La pièce n'est pas équilibrée</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.datePieceDate`]="{ item }">
          <span>{{ item.datePieceDate.toString() }}</span>
        </template>
        <template v-slot:[`item.dateEcheanceDate`]="{ item }">
          <span>{{ item.dateEcheanceDate.toString() }}</span>
        </template>
        <template v-slot:[`item.montant`]="{ item }">
          <span>{{ item.montant | numberToString }}</span>
        </template>
      </v-data-table>
    </v-card>
    <AchatVentePieceVue ref="refDialogPiece"></AchatVentePieceVue>
    <PieceAddResultVue ref="PieceAddResultVue" :SkipDialog.sync="skipAddResult"></PieceAddResultVue>
    <v-snackbar v-model="snackbar" :timeout="snackbarTimeout" :color="snackbarColor">
      <v-icon dark class="mr-3">{{ snackbarColor == 'error' ? 'mdi-delete' : 'mdi-check' }}</v-icon>
      <span v-html="snackbarMessage"></span>
      <v-btn icon dark @click="snackbar = false"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref } from 'vue-property-decorator';
import { PeriodeComptable, EntetePieceComptable, Journal } from '@/models/AchatVente';
import AchatVentePieceVue from './components/AchatVentePiece.vue';
import PieceAddResultVue from './components/PieceAddResult.vue';
import AchatVenteApi from '../../api/AchatVenteApi';
import { Pagination } from '@/models/Pagination';
import { DialogActionResult } from '@/models/DialogResult';

@Component({
  name: 'AchatVente',
  components: { AchatVentePieceVue, PieceAddResultVue }
})
export default class extends Vue {
  @Ref() readonly refDialogPiece!: AchatVentePieceVue;
  @Ref() readonly PieceAddResultVue!: PieceAddResultVue;

  private skipAddResult = false;
  private searchIsValid = true;
  private isErrorPeriode = false;
  private libellePeriode = '';

  private periodeIsLoading = false;
  private periodes: PeriodeComptable[] = [];
  private periodeSelected: PeriodeComptable = new PeriodeComptable();
  private periodesRules: unknown = [
    () => !this.isErrorPeriode || 'Connexion impossible',
    (v: string) => !!v || 'La période est obligatoire'
  ];

  private isErrorJournaux = false;
  private journaux: Journal[] = [];
  private journauxIsLoading = false;
  private journalSelected: Journal = new Journal();
  private detailJournalSelected = '';
  private journalRules: unknown = [
    () => !this.isErrorJournaux || 'Connexion impossible',
    (v: Journal) => !!v || 'Sélection de journal obligatoire',
    (v: Journal) => v.numero != 0 || 'Sélection de journal obligatoire'
  ];

  private selectedPiece!: EntetePieceComptable;
  private headers = [
    { text: '', value: 'isEquilibre' },
    { text: 'Numéro pièce', value: 'codePieceDisplay' },
    { text: 'Numéro compte', value: 'numeroCompte' },
    { text: 'Nom compte', value: 'nomCompte' },
    { text: 'Date pièce', value: 'datePieceDate' },
    { text: 'Libelle', value: 'libelle' },
    { text: 'Date échéance', value: 'dateEcheanceDate' },
    { text: 'Montant', value: 'montant', align: 'end' },
    { text: 'Escompte', value: 'escompteDisplay', align: 'end' },
    { text: 'Devise', value: 'devise' },
    { text: 'Status', value: 'statusLibelle' }
  ];
  private search = '';
  private piecesComptables: EntetePieceComptable[] = [];
  private isLoadingPieces = false;
  private options: any = {};
  private totalItems = 0;
  private currentPage = 1;
  private pageCount = 0;

  mounted() {
    this.loadPeriodes();
    this.loadJournaux();
  }

  private async loadPeriodes() {
    try {
      this.periodeIsLoading = true;
      const periodes = await AchatVenteApi.getPeriodes();
      periodes.forEach((p) => this.periodes.push(p));
    } catch (err) {
      this.isErrorPeriode = true;
    } finally {
      this.periodeIsLoading = false;
    }
  }

  private async loadJournaux() {
    try {
      this.journauxIsLoading = true;
      const journaux = await AchatVenteApi.getJournaux();
      journaux.forEach((j) => this.journaux.push(j));
    } catch (err) {
      this.isErrorJournaux = true;
    } finally {
      this.journauxIsLoading = false;
    }
  }

  @Watch('options')
  @Watch('search')
  private async loadPiecesComptables() {
    try {
      if (this.periodeSelected && this.journalSelected.numero) {
        this.isLoadingPieces = true;
        const { sortBy, sortDesc, page, itemsPerPage } = this.options;

        const pagination = new Pagination();
        pagination.terms = this.search;
        pagination.sortBy = sortBy.length ? this.getSortColumnName(sortBy[0]) : '';
        pagination.sortDesc = sortDesc.length ? sortDesc : false;
        pagination.page = page;
        pagination.limit = itemsPerPage;

        const paginationResult = await AchatVenteApi.getEntetePiecesComptables(
          this.journalSelected.numero,
          this.periodeSelected.typePeriodeComptable,
          pagination
        );
        this.piecesComptables = paginationResult.items.map((i) => new EntetePieceComptable(i));
        this.totalItems = paginationResult.totalCount;
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoadingPieces = false;
    }
  }

  private getSortColumnName(column: string): string {
    if (!column) return '';

    switch (column) {
      case 'codePieceDisplay':
        return 'CodePiece';
      case 'datePieceDate':
        return 'DatePiece';
      case 'dateEcheanceDate':
        return 'DateEcheance';
      case 'escompteDisplay':
        return 'Escompte';
      default:
        return column.charAt(0).toUpperCase() + column.slice(1);
    }
  }

  private nextPage() {
    this.currentPage < this.pageCount ? this.currentPage++ : (this.currentPage = 1);
  }

  private previousPage() {
    this.currentPage > 1 ? this.currentPage-- : (this.currentPage = this.pageCount);
  }

  private openPieceComptable(entete?: EntetePieceComptable) {
    this.refDialogPiece
      .open(this.periodeSelected, this.journalSelected, entete)
      .then((resp) => {
        if (resp.action == DialogActionResult.Create) {
          if (!this.skipAddResult) this.displayAddResult(resp.data);
          this.piecesComptables.unshift(resp.data);
        } else if (resp.action == DialogActionResult.Update && entete) {
          Vue.set(
            this.piecesComptables,
            this.piecesComptables.findIndex((e) => e == entete),
            resp.data
          );
          this.notifier(`Pièce numéro <b>${resp.data.codePieceDisplay}</b> mise à jour.`, 'success');
        } else if (resp.action == DialogActionResult.Delete && entete) {
          this.piecesComptables.splice(this.piecesComptables.indexOf(entete), 1);
          this.notifier(`Pièce numéro <b>${resp.data.codePieceDisplay}</b> supprimer.`, 'error');
        }
      })
      .finally(() => {
        this.$nextTick(() => (this.$refs.btnAdd as any).$el.focus());
      });
  }

  private displayAddResult(piece: EntetePieceComptable) {
    (this.$refs.PieceAddResultVue as PieceAddResultVue)
      .open(piece.codeJournal, piece.codePiece, this.periodeSelected.typePeriodeComptable)
      .then((numero) => {
        if (piece.codePiece != numero) {
          piece.codePiece = numero;
          Vue.set(
            this.piecesComptables,
            this.piecesComptables.findIndex((e) => e == piece),
            piece
          );
        }
      })
      .finally(() => {
        this.$nextTick(() => (this.$refs.btnAdd as any)?.$el?.focus());
      });
  }

  private snackbar = false;
  private snackbarTimeout = 5000;
  private snackbarMessage = '';
  private snackbarColor = '';

  private notifier(message: string, color: string) {
    this.snackbarColor = color;
    this.snackbarMessage = message;
    this.snackbar = true;
  }
}
</script>

<style scopped>
#btn-acqua {
  height: 56px;
}

#dataTable tbody tr {
  cursor: pointer;
}
</style>
