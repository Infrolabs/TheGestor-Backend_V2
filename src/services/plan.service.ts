import { ELanguage, EUserType } from "@/interfaces/users.interface";
import { BillinPlans } from "@/interfaces/plan.interface";
import { filterPlans } from "@/utils/filters";

class PlanService {
    public async getPlanList(userType: EUserType, language: ELanguage): Promise<any[]> {
        return filterPlans(BillinPlans.filter(plan => plan.userType === userType), language)
    }
}

export default PlanService;
