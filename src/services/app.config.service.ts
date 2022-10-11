import { IAppConfig } from "@/interfaces/app.config.interface";
import appConfigModel from "@/models/app.config.model";

class AppConfigService {

    public async getConfig(): Promise<IAppConfig> {
        let appConfig = await appConfigModel.findOne()
        if (!appConfig) {
            appConfig = new appConfigModel({
                android: {
                    latestVersionCode: 1,
                    latestVersion: '1',
                    stableVersion: '1',
                    stableVersionCode: 1
                },
                ios: {
                    latestVersionCode: 1,
                    latestVersion: '1',
                    stableVersion: '1',
                    stableVersionCode: 1
                }
            })
            await appConfig.save()
        }
        return appConfig
    }
}
export default AppConfigService;