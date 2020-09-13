import { SearchFournisseur, SearchFournisseurDTO } from '@/models/Fournisseur/SearchFournisseur';
import { Pagination } from '@/models/Pagination';
import { PaginationResult } from '@/models/PaginationResult';
import api from './AxiosApi';
import { FournisseurDTO } from '@/models/Fournisseur/Get/Fournisseur';
import { UpdateFournisseurDTO } from '@/models/Fournisseur/UpdateFournisseur';

export abstract class FournisseurApi {
  static async getSearchFournisseurs(pagination: Pagination): Promise<PaginationResult<SearchFournisseurDTO>> {
    let sortString = '';
    if(pagination.sortBy) {
      sortString = `&sortBy=${pagination.sortBy.trim().replace(/^\w/, (c) => c.toUpperCase())}`;
      if(pagination.sortDesc) sortString = sortString + "&sortByAsc=true";
    }

    const response = await api.AcQuaCore.get<PaginationResult<SearchFournisseurDTO>>(`Fournisseur/GetSearchFournisseurs?Page=${pagination.page}&Limit=${pagination.limit}&Term=${pagination.terms}` + sortString);
    return response.data;
  }

  static async getFournisseurByNumero(numero: number): Promise<FournisseurDTO>{
    const response = await api.AcQuaCore.get<FournisseurDTO>(`Fournisseur/${numero}`);

    return response.data;
  }

  static async GetEntetePiecesComptables(pagination: Pagination): Promise<PaginationResult<SearchFournisseur>> {
    const response = await api.AcQuaCore.get<PaginationResult<SearchFournisseur>>(
      `/AchatVente/GetEntetePiecesComptables?Page=${pagination.page}&Limit=${pagination.limit}&Term=${pagination.terms}&SortBy=${pagination.sortBy}&SortByAsc=${pagination.sortDesc}`
    );
    return response.data;
  }

  static async UpdateFournisseur(numero: number, updatedFournisseur: UpdateFournisseurDTO): Promise<boolean> {
    const response = await api.AcQuaCore.put<UpdateFournisseurDTO>(`Fournisseur/${numero}`, updatedFournisseur);
    return true;
  }
}
