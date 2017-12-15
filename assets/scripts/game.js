// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var Type = require('utils');        //Type中包含win, lock, start

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        videoPlayer: {
            default: null,
            type: cc.VideoPlayer,
        }, 

        guessAnim: {
            default: null,
            type: cc.Animation,
        },

        myGuess: {
            default: null,
            type: cc.Node,
        },

        spVS: {
            default: null,
            type: cc.Sprite,
        },

        spResult: {
            default: null,
            type: cc.Sprite,
        },

        spGuessMM: {
            default: null,
            type: cc.Sprite,
        }, 

        spGuessGG: {
            default: null, 
            type: cc.Sprite,
        }, 

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var self = this;
        this._final = -1;   //0代表输，1代表平局，2代表赢
        this._status = true;    //true代表开始，false代表结束
        this._level = 1;    //level从1开始，5为止
        this.playVideo(Type.Start);
    },

    // update (dt) {},

    onVideoPlayerEvent (sender, event) {
        if(event === cc.VideoPlayer.EventType.COMPLETED) {
            cc.log('debug00');
            cc.log('test_dev');
            this.playGuessAnim();
            this.showMyGuess();
            return;
        }

    },

    playGuessAnim () {
        var animation = this.guessAnim;
        animation.node.active = !animation.node.active;
        cc.log('debug0');
        
        cc.log(animation);
        cc.loader.loadRes("textures/guessAnim", cc.SpriteAtlas, (err, atlas) => {
            var spriteFrames = atlas.getSpriteFrames();
            var clip = cc.AnimationClip.createWithSpriteFrames(spriteFrames, 10);
            clip.name = 'guess';
            clip.wrapMode = cc.WrapMode.Loop;
       
            animation.addClip(clip);
            animation.play('guess');
        });
    },

    showMyGuess () {
        this.myGuess.active = !this.myGuess.active;
    },

    onbtnGuessClick (e) {
        cc.log("debug2");
        if(this._status != true) {
            return;
        }
        var self = this;
        var scissor = ["cloth", "scissor", "stone"];
        var stone = ["scissor", "stone", "cloth"];
        var cloth = ["stone", "cloth", "scissor"];

        switch(e.target.name) {
            case "btnScissor":
            this.generateResult(scissor);
            cc.loader.loadRes("icon_scissor_model_result", cc.SpriteFrame, (err, spriteFrame)=>{
                self.spGuessGG.node.active = !self.spGuessGG.node.active;
                self.spGuessGG.spriteFrame = spriteFrame;
                self.spGuessGG.node.runAction(cc.moveTo(1, cc.p(150, 0)));
            });
            break;

            case "btnStone":
            this.generateResult(stone);
            cc.loader.loadRes("icon_stone_model_result", cc.SpriteFrame, (err, spriteFrame)=>{
                self.spGuessGG.node.active = !self.spGuessGG.node.active;
                self.spGuessGG.spriteFrame = spriteFrame;
                self.spGuessGG.node.runAction(cc.moveTo(1, cc.p(150, 0)));
            });
            break;

            case "btnCloth":
            this.generateResult(cloth);
            cc.loader.loadRes("icon_cloth_model_result", cc.SpriteFrame, (err, spriteFrame)=>{
                self.spGuessGG.node.active = !self.spGuessGG.node.active;
                self.spGuessGG.spriteFrame = spriteFrame;
                self.spGuessGG.node.runAction(cc.moveTo(1, cc.p(150, 0)));
            });
            break;

            default:
            return;
        }
    },
        

    generateGuess () {
        var range = ['scissor', 'stone', 'cloth'];
        var index = Math.floor(cc.random0To1()*3+0);
        return range[index];
    },

    generateResult (arr) {
        var self = this;
        var guess = this.generateGuess();
        var path = "icon_"+guess+"_user_result"
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame)=>{
            self.spGuessMM.node.active = !self.spGuessMM.node.active;
            self.spGuessMM.spriteFrame = spriteFrame;
            self.spGuessMM.node.runAction(cc.moveTo(1, cc.p(-150, 0)));
        });

        if(arr.indexOf(guess) == -1) {
            return;
        }
        this._final = arr.indexOf(guess);
        this.showResult(this._final);
    },

    showResult (final) {
        var self = this;
        var result = ["lost", "draw", "win"];
        this.spVS.node.active = !this.spVS.node.active;
        if(final == -1) {
            return;
        }
        var path = "game_"+result[final]+"_icon";
        cc.log(path);
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame)=> {
            self.spResult.spriteFrame = spriteFrame;
            self.spResult.node.runAction(cc.moveTo(1, cc.p(0, -100)));
        });

        //停止guess动画
        this.guessAnim.stop();
        this.guessAnim.node.active = !this.guessAnim.node.active;

        this._status = !this._status;
    }, 

    playVideo (index) {
        var type = ["win", "start", "lock"];
        if(type[index]!=undefined) {
            var clip = "res/raw-assets/resources/video/"+this._level+ "_" + type[index]+".mp4";
            cc.log('clipdebug');
            cc.log(clip);
            this.videoPlayer.clip = clip;
            this.videoPlayer.play();
            return;
        }
        return;
    },



    restart () {
        this._status = !this._status;
        this.guessAnim.node.active = !this.guessAnim.node.active;
        this.guessAnim.play();

        cc.log('restart');
    }



});
