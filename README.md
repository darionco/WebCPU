<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## WebCPU

Utility to estimate the number of usable cores to perform data processing in node.js and the browser.

In node.js, it uses the code from [this gist][1] to
query the number of CPUs on the system. It can be configured to run the same estimation as in the browser.

In the browser, takes ~2 seconds to estimate the number of CPUs, uses WASM (when available) to perform the estimation.

Returns a [Promise][2] that resolves to a [WebCPUResult][3].

### Installation

    yarn add webcpu

or

    npm install webcpu

### Usage

In Web:

    import {WebCPU} from 'webcpu';

    WebCPU.detectCPU().then(result => {
        console.log(`Reported Cores: ${result.reportedCores}`);
        console.log(`Estimated Idle Cores: ${result.estimatedIdleCores}`);
        console.log(`Estimated Physical Cores: ${result.estimatedPhysicalCores}`);
    });

In Node:

    const WebCPU = require('webcpu/dist/umd/webcpu').WebCPU;

    WebCPU.detectCPU().then(result => {
        console.log(`Reported Cores: ${result.reportedCores}`);
        console.log(`Estimated Idle Cores: ${result.estimatedIdleCores}`);
        console.log(`Estimated Physical Cores: ${result.estimatedPhysicalCores}`);
    });

### Description

The core estimation is affected by other tasks in the system, usually the OS scheduler is efficient enough that
light tasks (playing music, idle programs, background updates, etc) are evenly distributed across cores and so they
will not affect the result of this estimation. Heavy tasks do have an effect in the results of the estimation, it is
recommended that you avoid performing heavy tasks while the estimation is running, it is considered good practice to
run the estimation periodically to compensate for user's CPU workloads and always keep an optimal number of
operational cores.

The estimation is performed by running a mathematical operation in a loop for a predefined amount of time. Modern
CPUs run this task simultaneously across physical cores and usually each core completes a very similar number of
operations, once hyper threading (or task scheduling) kicks in, a few cores must share their cycles among
threads running. By detecting the changes in operations completed by each thread, it is possible to estimate the
number of cores in the system.

The current algorithm returns bad estimations for CPUs with asymmetric cores (usually mobile ARM chips) because, as
explained above, it detects the changes in number of operations between threads. Asymmetric cores will complete
a different number of operations depending on the power of the core the task is scheduled on. Although the returned
estimations will be incorrect, they are safe to use to spawn threads.

This utility DOES NOT estimate logical cores, instead it uses `navigator.hardwareConcurrency` (if available) or simply
returns the same number as the estimated physical cores.

## Methods

### detectCPU

Estimates the number of CPUs in this machine.

#### Parameters

-   `hardcore` **[boolean][4]?** Engages hardcore mode, which kills all the workers after every test. (optional, default `false`)
-   `estimateInNode` **[boolean][4]?** If `true`, forces core estimation in Node.js rather than querying the system. (optional, default `false`)

Returns **[Promise][5]&lt;[WebCPUResult][6]>** Result of the estimation.

## WebCPUResult

Type: [Object][7]

### Properties

-   `reportedCores` **([number][8] | null)** The result of `navigator.hardwareConcurrency` or `null` if not supported. `navigator.hardwareConcurrency` returns the
    total number of cores in the system, physical and logical. This is not particularly useful for data computations
    because logical cores do no improve and, in some cases, even hinder performance in repetitive tasks.
-   `estimatedIdleCores` **[number][8]** This number represents the estimated number of cores that can be used to compute a repetitive task, like data
    computations, in parallel. The result of the estimation is affected by system workload at the time of the detection,
    if this number is used to spawn threads, it is recommended to re-run the detection algorithm periodically to always
    use an optimal number of cores when computing data.
-   `estimatedPhysicalCores` **[number][8]** Given the reported number of cores and the result of estimated idle cores, this number represents the "best guess"
    for the total number of physical cores in the system. This number of threads is safe to use on all platforms.

[1]: https://gist.github.com/brandon93s/a46fb07b0dd589dc34e987c33d775679

[2]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[3]: #webcpuresult

[4]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[5]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise

[6]: #webcpuresult

[7]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[8]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
