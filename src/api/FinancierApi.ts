import Axios from "axios";
import {JournalDTO, Journal, PeriodeComptable, PeriodeComptableDTO, EntetePieceComptable, EntetePieceComptableDTO, Piece, PieceDTO, TypeCompte, TypeCompteDTO, PieceAchatVente} from "@/models/Financier";
import { UserModule } from "@/store/modules/user";
import { Pagination } from '@/models/Pagination';
import { PaginationResult } from '@/models/PaginationResult';
import { Reglement, ReglementDTO } from '@/models/Financier/Get/Reglement';
import { PieceComptable, PieceComptableDTO } from '@/models/AchatVente';
import { PieceSaveDTO } from '@/models/Financier/Save/PieceSave';

export abstract class FinancierApi {
  private static axios = Axios.create({headers: { Authorization: `Bearer ${UserModule.token}` }});
  
  static async getPeriodes(): Promise<PeriodeComptable[]>{
    let responseCourante = await this.axios.get<PeriodeComptableDTO>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetPeriodeCourante`);
    let responsePrecedente = await this.axios.get<PeriodeComptableDTO>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetPeriodePrecedente`);
    let periodes: PeriodeComptable[] = [];
    periodes.push(new PeriodeComptable(responseCourante.data));
    periodes.push(new PeriodeComptable(responsePrecedente.data));
    return periodes;
  }

  static async getJournaux(): Promise<Journal[]>{
    let response = await this.axios.get<JournalDTO[]>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetJournaux`);
    return response.data.map(journal => new Journal(journal));
  }

  static async getEntetePiecesComptables(numeroJournal: number, periode: string, pagination: Pagination): Promise<PaginationResult<EntetePieceComptableDTO>>{
    let response = await this.axios.get<PaginationResult<EntetePieceComptableDTO>>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetEntetePiecesComptables?Page=${pagination.page}&Limit=${pagination.limit}&Term=${pagination.terms}&SortBy=${pagination.sortBy}&NumeroJournal=${numeroJournal}&Periode=${periode}`);
    return response.data;
  }

  static async getPieceComptable(numeroJournal: string | number, numeroPiece: string | number): Promise<Piece> {
      let response = await this.axios.get<PieceDTO>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetPieceComptable?journal=${numeroJournal}&piece=${numeroPiece}`);
      return new Piece(response.data);
  }

  static async getReglements(): Promise<Reglement[]> {
    let response = await this.axios.get<ReglementDTO[]>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetAllReglements`);
    return response.data.map(reglement => new Reglement(reglement));
  }

  static async getTypesComptes(): Promise<TypeCompte[]> {
    let response = await this.axios.get<TypeCompteDTO[]>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetTypesCompteVentilation`);
    return response.data.map(TypeCompteDTO => new TypeCompte(TypeCompteDTO));
  }

  static async getSoldeCompte(numeroCompte: number): Promise<number> {
    let response = await this.axios.get<number>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetSolde?numeroCompte=${numeroCompte}`);
    return response.data;
  }

  static async getPieceAchatVente(numeroJournal: number, numeroPiece: number): Promise<PieceAchatVente> {
    let response = await this.axios.get<PieceAchatVente>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetPieceComptableAchatVente?journal=${numeroJournal}&numeroPiece=${numeroPiece}`);
    return response.data;
  }

  static async deletePieceComptable(periode:string, numeroJournal: number, numeroPiece: number): Promise<boolean> {
    await this.axios.delete<any>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/DeletePieceComptable?periode=${periode}&journal=${numeroJournal}&piece=${numeroPiece}`);
    return true;
  }

  static async AddPieceComptable(piece: PieceSaveDTO): Promise<number> {
    let response = await this.axios.post<number>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/AddPieceComptable`, piece);
    return response.data;
  }

  static async UpdatePieceComptable(piece: PieceSaveDTO): Promise<number> {
    let response = await this.axios.put<number>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/UpdatePieceComptable`, piece);
    return response.data;
  }

  static async ChangeNumero(periode: string, journal: number, oldNumero: number, newNumero: number): Promise<boolean>{
    await this.axios.put(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/ChangementNumero?periode=${periode}&numeroJournal=${journal}&ancienNumeroPiece=${oldNumero}&nouveauNumeroPiece=${newNumero}`);
    return true;
  }
}