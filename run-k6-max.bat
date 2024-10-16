set K6_WEB_DASHBOARD=true
set K6_WEB_DASHBOARD_EXPORT=html-report-max.html
k6 run --out influxdb=http://perfuser:perfuser12345@localhost:8086/k6 ./scenarios/grpc-test-max.js