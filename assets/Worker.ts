
interface WorkerCell {
    isAlive: boolean;
    willAlive: boolean;
}

function workerThread() {
    let items: Array<Array<WorkerCell>> = new Array<Array<WorkerCell>>();

    self.onmessage = function (e) {
        console.log(e.data)
        if (e.data.event == 'initItems') {
            console.log('init items ')
        }
    }
}

var blob = new Blob([workerThread.toString() + ';workerThread();'], {
    type: "text/javascript"
});
let worker = new Worker(window.URL.createObjectURL(blob));


export default worker;
