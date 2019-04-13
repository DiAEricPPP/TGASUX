// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property(cc.RigidBody)
    player:cc.RigidBody=null

    @property(cc.Integer)
    hp=1;
    @property(cc.Label)
    showPlayerMove:cc.Label=null
    @property(cc.Integer)
    Force:number=4000//给定的标准力度

    realForce:number=0//根据按压时间计算的实际力度
    isMoving:boolean=false//判断player是否运动
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.getCollisionManager().enabled=true;//碰撞检测开启
        //cc.director.getCollisionManager().enabledDebugDraw=true;//debug用，绘制碰撞体外形
        //cc.director.getCollisionManager().enabledDrawBoundingBox=true;//debug用，绘制碰撞盒
        cc.director.getPhysicsManager().enabled = true;//物理系统开启
        cc.director.getPhysicsManager().gravity = cc.v2(0,-320);//设置重力，此处为默认的-320像素/秒^2
        
        this.node.on('mousedown',(event)=>{
            this.onMouseDown(event)
        })
        this.node.on('mouseup',(event)=>{
            this.onMouseUp(event)
        })//在当前结点下注册鼠标按下和抬起两个事件，稍后在onDestroy注销
    }
    //onEnable(){}

    start() {}

    onMouseDown(event:cc.Event.EventMouse){//鼠标按下改变实际力度，主要决定冲量大小
        this.realForce=this.Force//中间参数realforce 
        this.schedule(()=>{this.realForce+=1000},0.5,4)//每过0.5秒，实际力度增加1000单位,最大增加1+4次
        
    }
    onMouseUp(event:cc.Event.EventMouse){//鼠标抬起时计算冲量，主要决定了方向
        
        let Impulse:cc.Vec2=cc.v2(0,0)//真正使物体运动的冲量
        let subX=event.getLocationX()-this.player.node.x//根据鼠标坐标和player位置差距，
        let subY=event.getLocationY()-this.player.node.y//
        let subR=Math.sqrt(subX*subX+subY*subY)//////////
        Impulse.x=subX*this.realForce/subR///////////////
        Impulse.y=subY*this.realForce/subR///////////////由相似三角形计算实际冲量
        this.player.applyLinearImpulse(Impulse,this.player.getWorldCenter(),true)
        //this.player.applyForce(this.force,this.player.getWorldCenter(),true)
    }
    //onBeginContact(){}
    update (dt) {this.showPlayerMove.string=this.realForce.toString()}
    onDestroy(){
        this.node.off('mousedown',(event)=>{
            this.onMouseDown(event)
        })
        this.node.off('mouseup',(event)=>{
            this.onMouseUp(event)
        })
    }
}
