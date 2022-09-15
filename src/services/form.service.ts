import { API_BASE_URL } from "@/config";
import { IForm } from "@/interfaces/form.interface";
import { ETaxStatus, ETaxType, ITax } from "@/interfaces/tax.interface";
import { IUser } from "@/interfaces/users.interface";
import taxModel from "@/models/tax.model";
import { logger } from "@/utils/logger";
import { getNameAndSurname } from "@/utils/util";

class FormService {
    public async getFormData(user: IUser, type: ETaxType, year: number, trimester: number): Promise<IForm> {
        // const taxData = await taxModel.findOne({ userId: user._id, type, year, trimester })
        // if (taxData)
        //     return {
        //         postUrl: API_BASE_URL + "/form/",
        //         modelBackgroundImage: API_BASE_URL + "/static/img/"+type+".jpeg",
        //         cssUrl: API_BASE_URL + "/static/css/"+type+".css",
        //         formType: type,
        //         year,
        //         trimester,
        //         cifNif: user.cifNif,
        //         name: getNameAndSurname(user.name).name,
        //         surname: getNameAndSurname(user.name).surname,
        //         data: taxData.data
        //     }
        // Set form with default data
        // return {
        //     postUrl: API_BASE_URL + "/form/",
        //     modelBackgroundImage: API_BASE_URL + "/static/img/"+type+".jpeg",
        //     cssUrl: API_BASE_URL + "/static/css/"+type+".css",
        //     formType: type,
        //     year,
        //     trimester,
        //     cifNif: user.cifNif,
        //     name: getNameAndSurname(user.name).name,
        //     surname: getNameAndSurname(user.name).surname,
        //     data: {}
        // }

        return {
            postUrl: API_BASE_URL + "/form/",
            modelBackgroundImage: API_BASE_URL + "/static/img/"+type+".jpeg",
            cssUrl: API_BASE_URL + "/static/css/"+type+".css",
            currencyformaterUrl: API_BASE_URL + "/static/js/jquery.formatCurrency.js",
            formType: type,
            year,
            trimester,
            cifNif: "Y1234561X",
            name: "test",
            surname: "test",
            data: {}
        }
    }

    public async saveFormData(data: any): Promise<void> {
        logger.info("Test form Data : " + JSON.stringify(data))
    }



}

export default FormService;
