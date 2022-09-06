import { logger } from "@/utils/logger";

class FormService {
    public async getTestFormData(): Promise<any> {
        return {
            name: "Nilkanth",
            address: "Test address",
            city: "SURAT",
            state: "GUJARAT",
            country: "INDIA"
        }
    }

    public async saveTestFormData(data: any): Promise<void> {
        logger.info("Test form Data : "+ JSON.stringify(data))
    }

}

export default FormService;
