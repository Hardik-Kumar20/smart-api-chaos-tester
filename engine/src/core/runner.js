const {sendRequest} = require('../transport/httpClient');
const MetricsCollector = require('../metrics/collector');
const { analyze } = require("../metrics/analyzer");

const { shouldDelay, applyLatency } = require('../chaos/latency');
const { shouldFail } = require('../chaos/error');
const { shouldDrop } = require('../chaos/drop');


async function runTests(testCases = [], concurrency = 5) {  
    const collector = new MetricsCollector();
    
    let index = 0;

    async function worker(){
        while(index < testCases.length){
            const currentIndex = index++;
            const test = testCases[currentIndex];

            //Chaos Starts
            
            // Drop request
            if(shouldDrop(0.05)){
                collector.record({
                    success: false,
                    status: 0,
                    latency: 0,
                    error: "Request Dropped"
                });
                continue;
            }

            // Add Delay
            if(shouldDelay(0.12)){
                await applyLatency( 200, 1000 );
            }

            // Inject error
            if( shouldFail(0.1) ){
                collector.record({
                    success: false,
                    status: 500,
                    latency: 0,
                    error: "Injected Error"
                });
                continue;
            }

            const result = await sendRequest({
                method: test.method,
                url: test.url,
                headers: test.headers,
                data: test.body,
                timeout: test.timeout
            });
            collector.record(result);
        }
    }
    
    // create workers 
    const workers = [];
    for( let i = 0; i < concurrency; i++) {
        workers.push(worker());
    }

    await Promise.all(workers);

    const results = collector.gotResults();
    const summary = analyze(results);

    return{
        results,
        summary
    };
}

module.exports = { runTests };

