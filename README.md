# Mutation Report Publisher

Have you been trying out mutation testing using [Stryker](https://stryker-mutator.io) or any of the other mutation testing frameworks? Have you noticed that you forget to check the mutation results? Then this extension is for you.

## Contributing

Don't change any version numbers when you submit a pull request. The version number will be bumped when a new version of the extension is released.
You can compile the pipeline task and web contribution by running the `lerna run compile:dev` command from the root directory.

### Web contribution

You can compile the web contribution by running the `npm run compile:dev` command from the `extension/DisplayBuildResultReport` directory.
You can test changes to the web extension by running the `npm run start:dev` command from the `extension/DisplayBuildResultReport` directory.

### Azure pipelines task

You can compile the web contribution by running the `npm run compile:dev` command from the `extension/PublishMutationReport` directory.
You can test changes to the azure pipelines task by running the `node main.js` command from the `extension/PublishMutationReport/dist` folder after compilation.

For a successful run you need to set the environment variable `$Env:reportPattern` to a filepath
