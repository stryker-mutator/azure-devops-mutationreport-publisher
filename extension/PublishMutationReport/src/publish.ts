import * as tl from 'azure-pipelines-task-lib';

function publish() {
    try {
        var reportPath = findReport();
        for (let i = 0; i < reportPath.length; i++) {
            const element = reportPath[i];

            tl.addAttachment("stryker-mutator.mutation-report", "mutation-report-"+ (i+1)+".html", element);
        }
        tl.setResult(tl.TaskResult.Succeeded, "Mutation report uploaded: " + reportPath);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

function findReport(): string[] {
    
    const reportPattern: string = tl.getInput('reportPattern', true) as string;

    if(reportPattern.length == 0) {
        tl.setResult(tl.TaskResult.Failed, "Report filepath cannot be empty. Please provide a path to the report.", true);
    }

    var reportPaths = tl.findMatch(tl.getVariable("System.DefaultWorkingDirectory") || process.cwd(), reportPattern);

    if (!reportPaths || !reportPaths.length) {
        tl.setResult(tl.TaskResult.Failed, "No report found with filepath pattern " + reportPattern, true);
    }

    return reportPaths;
}

publish();
