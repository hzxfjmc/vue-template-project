const { exec } = require('child_process')
const projects = process.argv.slice(2)

projects.forEach(project => {
    // maxBuffer <number> stdout 或 stderr 允许的最大字节数。如果超过限制，则子进程会终止。参见 maxBuffer与Unicode。默认为 200*1024
    let workerProcess = exec('vue-cli-service serve --project=' + project, {
        maxBuffer: 1024 * 1024 * 10
    }, (err) => {
        if (err) {
            console.error(err)
        }
    })
    workerProcess.stdout.on('data', function (data) {
        console.log(data)
    })
})
