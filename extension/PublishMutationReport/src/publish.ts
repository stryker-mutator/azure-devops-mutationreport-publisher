import * as tl from 'azure-pipelines-task-lib';

function publish() {
    try {
        var reportPaths = findReports();
        for (let i = 0; i < reportPaths.length; i++) {
            const element = reportPaths[i];

            let currentReport = i+1;
            let progress = currentReport / reportPaths.length * 100
            tl.setProgress(progress, "Uploading reports");
            console.info("Uploading report " + currentReport + " of " + reportPaths.length);
            tl.addAttachment("stryker-mutator.mutation-report", "mutation-report-"+currentReport+".html", element);
        }
        
        tl.setResult(tl.TaskResult.Succeeded, "");
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

function findReports(): string[] {
    
    const reportPattern: string = tl.getInput('reportPattern', true) as string;

    if(reportPattern.length == 0) {
        tl.setResult(tl.TaskResult.Failed, "Report filepath cannot be empty. Please provide a path to the report.", true);
    }

    var reportPaths = tl.findMatch(tl.getVariable("System.DefaultWorkingDirectory") || process.cwd(), reportPattern);

    if (!reportPaths || !reportPaths.length) {
        tl.setResult(tl.TaskResult.Failed, "No reports found with filepath pattern " + reportPattern, true);
    }

    console.info("Found " + reportPaths.length + " reports.")
    return reportPaths;
}

publish();
