import grpc from 'k6/net/grpc';
import exec from 'k6/execution';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        max_performance_point: {
            executor: 'ramping-arrival-rate',
            startRate: 500,
            timeUnit: '1m',
            preAllocatedVUs: 15,
            stages: [
                {duration: '20s', target: 3000},
                {duration: '10s', target: 3000},
                {duration: '20s', target: 6000},
                {duration: '10s', target: 6000},
                {duration: '20s', target: 9000},
                {duration: '10s', target: 9000},
                {duration: '20s', target: 12000},
                {duration: '10s', target: 12000},
                {duration: '20s', target: 15000},
                {duration: '10s', target: 15000},
                {duration: '20s', target: 18000},
                {duration: '10s', target: 18000},
                {duration: '20s', target: 21000},
                {duration: '10s', target: 21000},
                {duration: '20s', target: 24000},
                {duration: '10s', target: 24000},
                {duration: '20s', target: 27000},
                {duration: '10s', target: 27000},
                {duration: '20s', target: 30000},
                {duration: '10s', target: 30000},
                {duration: '20s', target: 33000},
                {duration: '10s', target: 33000},
                {duration: '20s', target: 36000},
                {duration: '10s', target: 36000}
            ]
        }
    }
};
let startTS = Date.now();
const client = new grpc.Client();
client.load(['../proto'], 'helloworld.proto');
console.log('gRPC client creation time: ' + (Date.now() - startTS));

export default function () {
    const myIteration = exec.scenario.iterationInTest;
    client.connect('127.0.0.1:50051', {plaintext: true});

    const response = client.invoke('helloworld.Greeter/SayHello', {name: `K6_VU_${myIteration}`});
    check(response, {
        'status is OK': r => r && r.status === grpc.StatusOK
    });

    client.close();
}
