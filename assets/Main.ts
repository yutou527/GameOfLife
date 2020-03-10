import Cell from "./cell";
import Const from "./Const";
import worker from './Worker'
const { ccclass, property } = cc._decorator;

@ccclass
export default class World extends cc.Component {

    @property(cc.Node)
    world: cc.Node = null;

    @property(cc.Prefab)
    cell: cc.Prefab = null;

    items: Array<Array<Cell>> = new Array<Array<Cell>>();

    running = false;
    paused = false;

    start() {
        worker.onmessage = this.onWorkerMessage;
        for (let y = 0; y < Const.WORLD_SIZE; y++) {
            for (let x = 0; x < Const.WORLD_SIZE; x++) {
                let cell = cc.instantiate(this.cell).getComponent(Cell)
                cell.setPos(x, y)

                this.world.addChild(cell.node)
                if (!this.items[y]) {
                    this.items[y] = [];
                }
                this.items[y].push(cell)
            }
        }
        this.initWorkerItems()
    }
    doStart() {
        if (this.running)
            return;
        this.schedule(this.tick, 0.1);
    }
    doReset() {

        this.unschedule(this.tick);
        for (let y = 0; y < Const.WORLD_SIZE; y++) {
            for (let x = 0; x < Const.WORLD_SIZE; x++) {
                let cell = this.items[y][x];
                cell.reset();
            }
        }
        this.running = false;

    }
    doPause() {
        this.paused = !this.paused;
    }

    doRandom() {
        for (let y = 0; y < Const.WORLD_SIZE; y++) {
            for (let x = 0; x < Const.WORLD_SIZE; x++) {
                let cell = this.items[y][x];
                cell.reset();
                cell.randomAlive();
            }
        }
    }
    nextTick() {
        this.tick(null, true)
    }
    tick(event, ignorePause) {
        if (this.paused && !ignorePause)
            return;
        for (let y = 0; y < Const.WORLD_SIZE; y++) {
            for (let x = 0; x < Const.WORLD_SIZE; x++) {
                let cell = this.items[y][x];
                cell.updateWillAlive(this.items);
            }
        }
        for (let y = 0; y < Const.WORLD_SIZE; y++) {
            for (let x = 0; x < Const.WORLD_SIZE; x++) {
                let cell = this.items[y][x];
                cell.applyAlive();
            }
        }
        for (let y = 0; y < Const.WORLD_SIZE; y++) {
            for (let x = 0; x < Const.WORLD_SIZE; x++) {
                let cell = this.items[y][x];
                cell.updateState(this.items);
            }
        }
    }
    tickWithWorker(event, ignorePause) {

    }
    initWorkerItems() {
        worker.postMessage({
            event: 'initItems',
            const: Const
        })
    }
    onWorkerMessage(event: MessageEvent) {
        console.log(event)
    }
    // update (dt) {}
}
