import { CarFieldSearch } from "../enums/car-field-search.enum";
import { ComparingType } from "../enums/comparing-type.enum";

export class SearchAttribute
{
    carField: CarFieldSearch;
    comparingType: ComparingType;
    data: any;
}