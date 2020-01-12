import * as tl from 'azure-pipelines-task-lib';

function publish() {
    try {
        var reportPath = findReport();
        tl.addAttachment("stryker-mutator.mutation-report", "mutation-report-"+ tl.getVariable("Build.BuildId")+".html", reportPath);
        tl.setResult(tl.TaskResult.Succeeded, "Mutation report uploaded: " + reportPath);
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

function findReport(): string {
    
    const reportPattern: string = tl.getInput('reportPattern', true);

    if(reportPattern.length == 0) {
        tl.setResult(tl.TaskResult.Failed, "Report filepath cannot be empty. Please provide a path to the report.", true);
    }

    var reportPaths = tl.findMatch(tl.getVariable("System.DefaultWorkingDirectory") || process.cwd(), reportPattern);

    if (!reportPaths || !reportPaths.length) {
        tl.setResult(tl.TaskResult.Failed, "No report found with filepath pattern " + reportPattern, true);
    }

    if(reportPaths.length > 1) {
        tl.setResult(tl.TaskResult.SucceededWithIssues, "Multiple reports were found using pattern " + reportPattern + ". Using report " + reportPaths[0])
    }

    return reportPaths[0];
}

publish();
