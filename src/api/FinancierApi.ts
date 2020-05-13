import Axios from "axios";
import {JournalDTO, Journal, PeriodeComptable, PeriodeComptableDTO, EntetePieceComptable, EntetePieceComptableDTO, Piece, PieceDTO} from "@/models/Financier";
import { UserModule } from "@/store/modules/user";
import { Pagination } from '@/models/Pagination';
import { PaginationResult } from '@/models/PaginationResult';
import { Reglement, ReglementDTO } from '@/models/Financier/Get/Reglement';

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

  static async getPieceComptable( numeroJournal: string | number, numeroPiece: string | number): Promise<Piece> {
    let response = await this.axios.get<PieceDTO>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetPieceComptable?journal=${numeroJournal}&piece=${numeroPiece}`);
    return new Piece(response.data);
  }

  static async getReglements(): Promise<Reglement[]> {
    let response = await this.axios.get<ReglementDTO[]>(`${process.env.VUE_APP_ApiAcQuaCore}/Financier/GetAllReglements`);
    return response.data.map(reglement => new Reglement(reglement));
  }
}