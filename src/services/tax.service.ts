import { ETaxType, ITax } from "@/interfaces/tax.interface";
import taxModel from "@/models/tax.model";

class TaxService {
    public async getTaxesList(year: number, trimester: number, userId: string): Promise<ITax[]> {
        const taxes = await taxModel.find({ year, trimester, userId })
        return taxes
    }

    public async generateTxt(type: ETaxType, year: number, trimester: number, userId: string): Promise<any> {
        const tax = await taxModel.findOne({ type, year, trimester, userId })
        if (tax.type === ETaxType.FORM130)
            this.getForm130TxtData(tax)
        return
    }

    private getForm130TxtData(tax: ITax): string {
        if (Object.values(data).length < 20) throw new Error("Invalid data")
        const nameSurname = getNameAndSurname(fullname)
        return "<T1300" + year + trimester + "T0000><AUX>"
            + "1.06".padStart(70 + 4, ' ') // 70 blank + 4 version string
            + "B88476437".padStart(9 + 4, ' ') // 9 NIF + 4 blanks
            + "</AUX>".padStart(213 + 6, ' ') // 213 blank space + </AUX>
            + "<T13001000> "//----- FIRST PAGE ------
            + (parseFloat(data['18']) && parseFloat(data['18']) < 0 ? "B" : (parseFloat(data['18']) && parseFloat(data['18']) === 0 ? "N" : "I"))
            + cifNif
            + nameSurname.surname.padEnd(60, ' ')
            + nameSurname.name.padEnd(20, ' ')
            + year
            + trimester + "T"
            + getStr(data['0']).padStart(17, '0')
            + getStr(data['1']).padStart(17, '0')
            + getStr(data['2']).padStart(17, '0')
            + getStr(data['3']).padStart(17, '0')
            + getStr(data['4']).padStart(17, '0')
            + getStr(data['5']).padStart(17, '0')
            + getStr(data['6']).padStart(17, '0')
            + getStr(data['7']).padStart(17, '0')
            + getStr(data['8']).padStart(17, '0')
            + getStr(data['9']).padStart(17, '0')
            + getStr(data['10']).padStart(17, '0')
            + getStr(data['11']).padStart(17, '0')
            + getStr(data['12']).padStart(17, '0')
            + getStr(data['13']).padStart(17, '0')
            + getStr(data['14']).padStart(17, '0')
            + getStr(data['15']).padStart(17, '0')
            + getStr(data['16']).padStart(17, '0')
            + getStr(data['17']).padStart(17, '0')
            + getStr(data['18']).padStart(17, '0')
            + " "
            + String(data['19']).padStart(13, ' ')
            + String(data['20']).padStart(34, ' ')
            + "</T13001000>".padStart(96 + 13 + 12, ' ')    // 590 spaces + 12 tag
            + "</T1300" + year + trimester + "T0000>"
    }
}

export default TaxService;
