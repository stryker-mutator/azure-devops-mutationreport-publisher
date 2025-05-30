import * as tl from 'azure-pipelines-task-lib';
import * as path from 'path';

function publish() {
    try {
        var reportPaths = findReports();
        let reportName: string = tl.getInput('reportDisplayName', false) as string;
        let useOriginalReportName: boolean = tl.getBoolInput('useReportFileName', false);

        if (!reportName?.trim() && !useOriginalReportName) {
          reportName = 'mutation-report';
        }

        for (let i = 0; i < reportPaths.length; i++) {
            const element = reportPaths[i];

            let currentReport = i+1;
            let progress = currentReport / reportPaths.length * 100;
            tl.setProgress(progress, "Uploading reports");
            console.info("Uploading report " + currentReport + " of " + reportPaths.length);
            if (useOriginalReportName){
                reportName =  path.basename(element);
                tl.addAttachment("stryker-mutator.mutation-report", reportName, element);
                continue;
            }

            tl.addAttachment("stryker-mutator.mutation-report", reportName+"-"+currentReport+".html", element);
        }
        
        tl.setResult(tl.TaskResult.Succeeded, "");
    }
    catch (err: any) {
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
