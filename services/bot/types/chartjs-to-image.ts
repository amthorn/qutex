/**
 * @file Necessary for the chartjs-to-image types to be recognized by typescript.
 * @author Ava Thorn
 */

declare module 'chartjs-to-image';

/**
 * An interface for modelling the chart js models.
 */
interface IChartJsImage {
    setConfig: (config: any) => IChartJsImage; //eslint-disable-line @typescript-eslint/no-explicit-any
    setWidth: (width: number) => IChartJsImage; //eslint-disable-line @typescript-eslint/no-unused-vars
    setHeight: (height: number) => undefined;
    getShortUrl: () => string;
    toBinary: () => string;
}