import Const from "./Const";

interface CellPos {
    x: number;
    y: number;
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Cell extends cc.Component {

    @property(cc.Sprite)
    sp: cc.Sprite = null;

    pos: CellPos;
    // LIFE-CYCLE CALLBACKS:
    private isAlive: boolean = false;
    private willAlive: boolean = false;
    // onLoad () {}
    setAlive(isAlive: boolean) {
        this.isAlive = isAlive;
        this.node.opacity = isAlive ? 255 : 0;
    }
    setPos(x, y) {
        this.pos = {
            x: x,
            y: y
        }
    }
    randomAlive() {
        this.setAlive(Math.random() > 0.5)
    }
    start() {
        let scale = Const.BASE_SIZE / Const.WORLD_SIZE
        this.node.scale = scale;
        this.node.x = this.pos.x * this.node.width * scale;
        this.node.y = this.pos.y * this.node.width * scale;
        this.setAlive(false);
        this.node.on(cc.Node.EventType.TOUCH_END, e => {
            this.onClick();
        })
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, e => {
        //     if (!this.isAlive)
        //         this.onClick();
        // })
    }
    updateWillAlive(items: Array<Array<Cell>>) {
        let lifes = this.getLifesAround(items)
        if (lifes == Const.H_N) {
            this.willAlive = true;
            this.sp.node.color = Const.H_COLOR;
        } else if (lifes == Const.S_N) {
            this.willAlive = this.isAlive;
            this.sp.node.color = Const.S_COLOR;
        } else {
            this.willAlive = false;
            this.sp.node.color = Const.D_COLOR;
        }
    }
    applyAlive() {
        this.setAlive(this.willAlive)
    }
    updateState(items: Array<Array<Cell>>) {
        let lifes = this.getLifesAround(items)
        if (lifes == Const.H_N) {
            this.sp.node.color = Const.H_COLOR;
        } else if (lifes == Const.S_N) {
            this.sp.node.color = Const.S_COLOR;
        } else {
            this.sp.node.color = Const.D_COLOR;
        }
    }

    reset() {
        this.setAlive(false);
        this.sp.node.color = cc.Color.WHITE;
    }
    onClick() {
        this.setAlive(!this.isAlive)
    }
    //获取周围生命数量
    getLifesAround(items: Array<Array<Cell>>): number {
        let lifes = 0;
        for (let x = this.pos.x - 1; x <= this.pos.x + 1; x++)
            for (let y = this.pos.y - 1; y <= this.pos.y + 1; y++) {
                if (x >= 0 && x < Const.WORLD_SIZE && y >= 0 && y < Const.WORLD_SIZE) {
                    if (x != this.pos.x || y != this.pos.y) {
                        if (items[y][x].isAlive) {
                            lifes++;
                        }
                    }
                }
            }
        return lifes;
    }
    getLifesAroundWithWorker(items: Array<Array<Cell>>, callback) {

    }
    // update (dt) {}
}
