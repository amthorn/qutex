/**
 * @file Test file for the Chart file, which generates charts..
 * @author Ava Thorn
 */
import { Chart, QueueLength, QUEUE_LENGTH_CONFIG } from '../src/chart';
import { STANDARD_USER } from './util';


describe('The Chart superclass works appropriately', () => {
    test('Chart class can be created with shortUrl and image binary can be retrieved', async () => {
        const chart = new Chart({});
        expect(chart.chart.setConfig).toBeCalledWith({});
        expect(chart.url).toEqual('myShortUrl');
        expect(chart.image).toEqual('myBinaryImage');

    });
    test('Chart class can be created with non-empty configuration', async () => {
        expect(new Chart({ 'foo': 'bar' }).chart.setConfig).toBeCalledWith({ 'foo': 'bar' });
    });
});
describe('The Queue Length History subclass works appropriately', () => {
    test('QueueLength class can be created with shortUrl and image binary can be retrieved and configuration is valid', async () => {
        const history = [{
            name: 'foo',
            members: [],
            time: new Date('01-02-2021 00:00:00')
        }];
        const queue = {
            name: 'foo',
            members: [],
            history: history
        };
        const chart = new QueueLength(queue);
        const config = { ...QUEUE_LENGTH_CONFIG };
        config.data.datasets[0].data = history.map(i => ({ y: i.members.length, x: i.time.toLocaleString() }));

        expect(chart.chart.setConfig).toBeCalledWith(config);
        expect(chart.url).toEqual('myShortUrl');
        expect(chart.image).toEqual('myBinaryImage');

    });
    test('QueueLength class can be created with shortUrl and image binary can be retrieved and configuration is valid with a valid history', async () => {
        const history = [{
            name: 'foo',
            members: [],
            time: new Date('01-02-2021 00:00:00')
        }, {
            name: 'foo',
            members: [{
                person: {
                    ...STANDARD_USER,
                    atHeadSeconds: 0,
                    atHeadCount: 0,
                    inQueueSeconds: 0,
                    inQueueCount: 0
                },
                enqueuedAt: new Date('2020-01-01'),
                atHeadTime: null
            }],
            time: new Date('01-03-2021 00:00:00')
        }, {
            name: 'foo',
            members: [{
                person: {
                    ...STANDARD_USER,
                    atHeadSeconds: 0,
                    atHeadCount: 0,
                    inQueueSeconds: 0,
                    inQueueCount: 0
                },
                enqueuedAt: new Date('2020-01-01'),
                atHeadTime: null
            }, {
                person: {
                    ...STANDARD_USER,
                    atHeadSeconds: 0,
                    atHeadCount: 0,
                    inQueueSeconds: 0,
                    inQueueCount: 0
                },
                enqueuedAt: new Date('2020-01-01'),
                atHeadTime: null
            }],
            time: new Date('01-04-2021 00:00:00')
        }, {
            name: 'foo',
            members: [{
                person: {
                    ...STANDARD_USER,
                    atHeadSeconds: 0,
                    atHeadCount: 0,
                    inQueueSeconds: 0,
                    inQueueCount: 0
                },
                enqueuedAt: new Date('2020-01-01'),
                atHeadTime: null
            }],
            time: new Date('01-05-2021 00:00:00')
        }];
        const queue = {
            name: 'foo',
            members: [],
            history: history
        };
        const chart = new QueueLength(queue);
        const config = { ...QUEUE_LENGTH_CONFIG };
        config.data.datasets[0].data = history.map(i => ({ y: i.members.length, x: i.time.toLocaleString() }));

        expect(chart.chart.setConfig).toBeCalledWith(config);
        expect(chart.url).toEqual('myShortUrl');
        expect(chart.image).toEqual('myBinaryImage');

    });
});
