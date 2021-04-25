import { Get as GetStatus } from './status/get';

export default [
    new GetStatus()
] as unknown as Command[];