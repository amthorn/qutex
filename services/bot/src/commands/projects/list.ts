import { CommandBase } from '../base';
import { PROJECT_MODEL } from '../../models/project';
import { Auth } from '../../enum';
import { LOGGER } from '../../logger';

@CommandBase.authorized
export class List extends CommandBase implements ICommand {
    public readonly AUTHORIZATION: Auth = Auth.NONE;
    public readonly COMMAND_TYPE: CommandType = CommandType.LIST;
    public readonly COMMAND_BASE: string = 'projects';
    public readonly DESCRIPTION: string = 'Lists all available projects';
    // Thus needs to exist, even tho it's not used, so that it's fed to the authorizor decorator
    public async relax (initiative: IInitiative): Promise<string> {
        LOGGER.verbose(`Listing projects for user: ${initiative.user.id}`);
        const projects = await PROJECT_MODEL.find({}).exec();
        if (projects.length > 0) {
            const collectionString = projects.map((v, i) => `${i + 1}. ${v.name}`).join('\n');

            return `List of projects are:\n\n${collectionString}`;
        } else {
            return 'There are no projects configured.';
        }
    }
}