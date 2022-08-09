import { EUserType } from "@/interfaces/users.interface";

export const BillinPlans = [
    {
        id: "freelancers",
        name: "Premium",
        userType: EUserType.FREELANCER,
        description: {
            es: "¡Olvidate de tus gestiones! El plan ideal para gestionar tu negocio de forma automática y sencilla",
            en: "Forget about the paper work! The ideal plan to manage your business automatically and easy "
        },
        features: {
            en: [
                "All included in Freemium",
                "Until 3 users",
                "Tax statement throughout the app"
            ],
            es: [
                "Todo lo que incluye el Plan Freemium",
                "Hasta 3 usuarios",
                "Presentacion de impuestos a través de la app"
            ]
        },
        amount: {
            month: 6,
            year: 60
        }
    },
    {
        id: "freelancers_plus",
        name: "Premium+",
        userType: EUserType.FREELANCER,
        description: {
            en: "Forget about the paper work! The ideal plan to manage your business automatically and easy and  ¡with your tax advisor on line!",
            es: "¡Olvidate de tus gestiones! El plan ideal para gestionar tu negocio de forma automática y sencilla y ¡con tu gestor en línea!",
        },
        features: {
            en: [
                "All included in Freemium and Premium",
                "Personal accountant",
                "Limited inquiries to the accountant",
                "Accounting book review",
                "Tax preparation and statement with a Tax advisor",
                "Tax direct debit"
            ],
            es: [
                "Todo lo que incluye el Plan Freemium y Premium",
                "Gestor personal",
                "Consultas ilimitadas al gestor",
                "Revisión de tus libros contables",
                "Preparación y presentación de tus impuestos con un gestor",
                "Domiciliación del pago de tus impuestos"
            ]
        },
        amount: {
            month: 39,
            year: 390
        }
    },
    {
        id: "companies",
        name: "Premium",
        userType: EUserType.COMPANY,
        description: {
            en: "¡Forget about the paper work! The ideal plan to manage your business automatically and easy",
            es: "¡Olvidate de tus gestiones! El plan ideal para gestionar tu empresa de forma automática y sencilla",
        },
        features: {
            en: [
                "All included in Freemium",
                "Until 5 users",
                "Tax statement throughout the app"
            ],
            es: [
                "Todo lo que incluye el Plan Freemium",
                "Hasta 5 usuarios",
                "Presentacion de impuestos a través de la app"
            ]
        },
        amount: {
            month: 20,
            year: 200
        }
    },
    {
        id: "companies_plus",
        name: "Premium+",
        userType: EUserType.COMPANY,
        description: {
            en: "¡Forget about the paper work! The ideal plan to manage your business automatically and easy",
            es: "¡Olvidate de tus gestiones! El plan ideal para gestionar tu empresa de forma automática y sencilla y ¡con tu gestor en línea!",
        },
        features: {
            en: [
                "All included in Freemium and Premium",
                "Personal accountant",
                "Limited inquiries to the accountant",
                "Accounting book review",
                "Tax preparation and statement with a Tax advisor",
                "Tax direct debit"
            ],
            es: [
                "Todo lo que incluye el Plan Freemium y Premium",
                "Gestor personal",
                "Consultas ilimitadas al gestor",
                "Revisión de tus libros contables",
                "Preparación y presentación de tus impuestos con un gestor",
                "Domiciliación del pago de tus impuestos"
            ]
        },
        amount: {
            month: 99,
            year: 999
        }
    },
]