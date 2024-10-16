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
                {duration: '1m', target: 15000},
                {duration: '10m', target: 15000}
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
