const promClient = require('prom-client');

class MetricsController {
    constructor() {
        this.register = new promClient.Registry();
        promClient.collectDefaultMetrics({ register: this.register });
        this.initializeMetrics();
    }

    initializeMetrics() {
        this.httpRequestDuration = new promClient.Histogram({
            name: 'http_request_duration_seconds',
            help: 'Duration of HTTP requests in seconds',
            labelNames: ['method', 'route', 'status_code'],
            buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
            registers: [this.register]
        });

        this.httpRequestTotal = new promClient.Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.register]
        });

        // Add student API specific metrics
        this.studentOperations = new promClient.Counter({
            name: 'student_operations_total',
            help: 'Total number of student operations',
            labelNames: ['operation', 'status'],
            registers: [this.register]
        });

        this.activeStudentRequests = new promClient.Gauge({
            name: 'active_student_requests',
            help: 'Number of active student API requests',
            registers: [this.register]
        });

        this.httpErrorTotal = new promClient.Counter({
            name: 'http_errors_total',
            help: 'Total number of HTTP errors',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.register]
        });
    }

    async getMetrics(req, res) {
        try {
            res.set('Content-Type', this.register.contentType);
            res.end(await this.register.metrics());
        } catch (err) {
            res.status(500).end(err);
        }
    }

    trackMetrics() {
        return async (req, res, next) => {
            const start = Date.now();
            
            res.on('finish', () => {
                const duration = Date.now() - start;
                const route = req.baseUrl + (req.route ? req.route.path : '');
                const labels = {
                    method: req.method,
                    route: route || req.path,
                    status_code: res.statusCode
                };
                
                this.httpRequestDuration.observe(labels, duration / 1000);
                this.httpRequestTotal.inc(labels);
                
                if (res.statusCode >= 400) {
                    this.httpErrorTotal.inc(labels);
                }
            });
            
            next();
        };
    }
}

module.exports = new MetricsController();
