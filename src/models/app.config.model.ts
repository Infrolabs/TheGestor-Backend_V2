import { model, Schema, Document } from 'mongoose';
import { IAppConfig } from '@/interfaces/app.config.interface';

const appConfigSchema: Schema = new Schema({
    android: {
        type: {
            latestVersionCode: { type: Number, default: 1 },
            latestVersion: { type: Number, default: "1" },
            stableVersionCode: { type: Number, default: 1 },
            stableVersion: { type: Number, default: "1" }
        }
    },
    ios: {
        type: {
            latestVersionCode: { type: Number, default: 1 },
            latestVersion: { type: Number, default: "1" },
            stableVersionCode: { type: Number, default: 1 },
            stableVersion: { type: Number, default: "1" }
        }
    }
}, {
    timestamps: true
})
const appConfigModel = model<IAppConfig & Document>('AppConfig', appConfigSchema);

export default appConfigModel;
