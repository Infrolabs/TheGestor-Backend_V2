import { EUserType } from "@/interfaces/users.interface";
import { BillinPlans } from "@/utils/plans";

class PlanService {
    public async getPlanList(userType: EUserType): Promise<any[]> {
        return BillinPlans.filter(plan => plan.userType === userType)
    }
}

export default PlanService;
