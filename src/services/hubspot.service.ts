import { HUBSPOT_API_KEY, NODE_ENV } from '@/config';
import Hubspot from 'hubspot'

class HubspotService {
    private hubspot = new Hubspot({
        apiKey: HUBSPOT_API_KEY
    })
    public async createContact(firstname: string, lastname: string, email: string, countryCode: string, phone: string, companyName: string): Promise<void> {
        // return if development env
        if (NODE_ENV === "development")
            return
        const contactObj = {
            "properties": [
                { "property": "firstname", "value": firstname },
                { "property": "lastname", "value": lastname },
                { "property": "email", "value": email },
                { "property": "phone", "value": countryCode + "" + phone },
                { "property": "company", "value": (companyName || "") }
            ]
        }
        await this.hubspot.contacts.create(contactObj)
    }
}

export default HubspotService;
