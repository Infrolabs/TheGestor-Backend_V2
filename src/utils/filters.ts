import { IBillingPlan } from "@/interfaces/plan.interface";
import { ELanguage, IUser } from "@/interfaces/users.interface";

export const filterCurrentUser = (user: IUser): IUser => {
    delete user.password
    return user
}

export const filterPlans = (plans: IBillingPlan[], language: ELanguage): IBillingPlan[] => {
    plans.forEach(plan => {
        plan.features = plan.features[language] ? plan.features[language] : plan.features[ELanguage.ES]
        plan.description = plan.description[language] ? plan.description[language] : plan.description[ELanguage.ES]
    })
    return plans
}