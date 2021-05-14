/**
 * @file Responsible for handling the chart builder APIs.
 * @author Ava Thorn
 */

import ChartJsImage from 'chartjs-to-image';

/**
 * The chart superclass.
 */
export class Chart {
    /**
     * The chart object itself which holds the low-level library chart.
     */
    private readonly CHART: IChartJsImage = new ChartJsImage();
    /* eslint-disable @typescript-eslint/no-magic-numbers */

    /**
     * The width of the chart.
     */
    private readonly WIDTH = 400;

    /**
     * The height of the chart.
     */
    private readonly HEIGHT = 400;
    /* eslint-enable @typescript-eslint/no-magic-numbers */

    /**
     * The constructor for building the superclass for the chart.
     * 
     * @param config - The configuration for the chart.
     */
    public constructor (config: any) { //eslint-disable-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
        this.CHART.setConfig(config).setWidth(this.WIDTH).setHeight(this.HEIGHT);
    }

    /**
     * Gets the short url for the generated chart.
     * 
     * @returns The short URL.
     */
    public get url (): string {
        return this.CHART.getShortUrl();
    }

    /**
     * Gets the binary image data from the chart.
     * 
     * @returns The binary image data.
     */
    public get image (): string {
        return this.CHART.toBinary();
    }

    /**
     * Get the chart variable. This is mainly used for testing.
     * 
     * @returns The chart for this object.
     */
    public get chart (): IChartJsImage {
        return this.CHART;
    }
}

export const QUEUE_LENGTH_CONFIG: any = { //eslint-disable-line @typescript-eslint/no-explicit-any
    'type': 'line',
    'data': {
        'datasets': [{
            'label': 'Queue Length',
            'backgroundColor': 'rgba(75, 192, 192, 0.5)',
            'borderColor': 'rgb(75, 192, 192)',
            'fill': false,
            'data': []
        }]
    },
    'options': {
        'title': {
            'text': 'Queue Length History'
        },
        'scales': {
            'xAxes': [{
                'type': 'time',
                'time': {
                    'parser': 'MM/DD/YYYY, HH:mm:ss ZZ',
                    timezone: 'America/New_York'
                },
                'scaleLabel': {
                    'display': true,
                    'labelString': 'Time'
                }
            }],
            'yAxes': [{
                ticks: {
                    beginAtZero: true,
                    /**
                     * Formats ticks into integers rather than real numbers.
                     * 
                     * @param value - The tick value.
                     * @returns The formatted tick value.
                     */
                    callback: function (value: number): number | null {
                        if (value % 1 === 0) {
                            return value;
                        } else {
                            return null;
                        }
                    }
                },
                'scaleLabel': {
                    'display': true,
                    'labelString': 'Queue Length'
                }
            }]
        }
    }
};

/**
 * The class which handles the queue length charts.
 */
export class QueueLength extends Chart {
    /**
     * The constructor for building queue length charts.
     * 
     * @param queue - The queue for which to build the chart.
     */
    public constructor (queue: IQueue) {
        const history = queue.history.map(i => ({ y: i.members.length, x: i.time.toLocaleString() }));
        // Building the configuration
        const config = { ...QUEUE_LENGTH_CONFIG };
        config.data.datasets[0].data = history;
        super(config);
    }
}