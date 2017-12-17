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

        spGuessGG: {
            default: null,
            type: cc.Sprite,
        }, 

        spGuessMM: {
            default: null, 
            type: cc.Sprite,
        }, 

        resultLayer: {
            default: null,
            type: cc.Node,
        },

        lblLevel: {
            default: null,
            type: cc.Label,
        },

        spBlood: {
            default: null,
            type: cc.Sprite,
        },

        alertLayer: {
            default: null,
            type: cc.Node,
        },

        lblTip: cc.Label,
        lblDesc: cc.Label,
        lblBtn: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initGame();
    },

    initGame () {
        var self = this;
        this.alertLayer.active = false;

        this._final = -1;   //0代表输，1代表平局，2代表赢
        this._status = 1;  //-1代表结束，0代表Win，1代表Start，2代表Lock
        this._level = 1;    //level从1开始，5为止
        if(cc.sys.localStorage.getItem("level") != null) {
            this._level = cc.sys.localStorage.getItem("level");
        }
        this._blood = 1;    //初始化为5个红心
        if(cc.sys.localStorage.getItem("blood") != null) {
            this._blood = cc.sys.localStorage.getItem("blood");
        }

        this.refreshGame();
    },

    refreshGame () {
        var self = this;
        this._status = 1;   //-1代表结束，0代表Win，1代表Start，2代表Lock
        this.lblLevel.string = "第"+this._level+"/5关";
        var path = "blood_"+this._blood;
        if(this._blood<=0) {
            path = "blood_none";
        }
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame)=>{
            self.spBlood.spriteFrame = spriteFrame;
        });
        if(this._blood <= 0) {
            cc.log('gameover');
            this.showBuyAlert();
            return;
        }
        if(this._level >=6) {
            cc.log('have passed');
            return;
        }
        this.playVideo(Type.Start);
    },

    // update (dt) {},

    onVideoPlayerEvent (sender, event) {
        if(event === cc.VideoPlayer.EventType.COMPLETED) {
            if(this._status == 1) {     //开始
                this.playGuessAnim();
                this.myGuess.active = true;
                return;
            }
            if(this._status == 2) {     //输
                this._blood--;
                if(this._blood <= 0) {
                    this._blood = 0;
                }
                cc.sys.localStorage.setItem("blood", this._blood);
                this.refreshGame();
                return;
            }
            if(this._status == 0) {     //赢
                this._level++;
                if(this._level >=6) {
                    this._level = 6;
                }
                cc.sys.localStorage.setItem("level", this._level);
                this.refreshGame();
                return;
            }
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


    onbtnGuessClick (e) {
        cc.log("debug2");
        // if(this._status != -1) {
        //     return;
        // }
        var self = this;
        var scissor = ["cloth", "scissor", "stone"];
        var stone = ["scissor", "stone", "cloth"];
        var cloth = ["stone", "cloth", "scissor"];

        function showSpGuessGG(path, sp) {
            cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame)=>{
                sp.node.active = true;
                sp.spriteFrame = spriteFrame;
                // sp.node.runAction(cc.moveTo(1, cc.p(150, 0)));
            });
        }
        this.myGuess.active = false;
        switch(e.target.name) {
            case "btnScissor":
            this.generateResult(scissor);
            showSpGuessGG("icon_scissor_user_result", this.spGuessGG);
            break;

            case "btnStone":
            this.generateResult(stone);
            showSpGuessGG("icon_stone_user_result", this.spGuessGG);
            break;

            case "btnCloth":
            this.generateResult(cloth);
            showSpGuessGG("icon_cloth_user_result", this.spGuessGG);
            break;

            default:
            return;
        }
    },
        
    generateGuess () {
        var range = ['scissor', 'stone', 'cloth'];
        var index = Math.floor(cc.random0To1()*3+0);    //取值范围【0-2】
        return range[index];
    },

    generateResult (arr) {      //对应电脑猜拳结果
        var self = this;
        var guess = this.generateGuess();
        var path = "icon_"+guess+"_model_result"
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame)=>{
            self.spGuessMM.node.active = true;
            self.spGuessMM.spriteFrame = spriteFrame;
            // self.spGuessMM.node.runAction(cc.moveTo(1, cc.p(-150, 0)));
        });

        if(arr.indexOf(guess) == -1) {
            cc.log('test000');
            return;
        }
        this._final = arr.indexOf(guess);
        this.showResult(this._final);
    },

    showResult (final) {
        if(final == -1) {
            return;
        }

        var self = this;
        var result = ["win", "draw", "lost"];
        this.spVS.node.active = true;
        
        var path = "game_"+result[final]+"_icon";
        cc.log(path);
        cc.loader.loadRes(path, cc.SpriteFrame, (err, spriteFrame)=> {
            self.spResult.spriteFrame = spriteFrame;
            self.spResult.node.runAction(cc.moveTo(1, cc.p(0, -60)));
        });

        //停止guess动画
        this.guessAnim.stop();
        this.guessAnim.node.active = !this.guessAnim.node.active;

        this._status = final;

        //播放对应结果的相关视频及相关生命值       
        this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function(target, data) {   //target必须带上，否则将把data看作是object
            if(!Object.values(Type).includes(data)) {
                return;
            }
           
            self.spVS.node.active = false;
            this.spResult.node.setPosition(cc.v2(0, 782));
            self.spGuessGG.node.active = false;
            self.spGuessMM.node.active = false;

            // self.playVideo(data);
            this.playVideo(data);
        }, this, this._status)));
    }, 

    playVideo (index) {
        if(!Object.values(Type).includes(index)) {
            return;
        }
        
        var type = ["lock", "start", "win"];    //lock是赢，win是输，start是重新开始
        if(type[index]!=undefined && type[index]!="win") {
            var clip = "res/raw-assets/resources/video/"+this._level+ "_" + type[index]+".mp4";
            cc.log('clipdebug');
            cc.log(clip);
            this.videoPlayer.clip = clip;
            this.videoPlayer.play();
            return;
        }
        if(type[index] == "win") {                  //输
            var randIndex = Math.floor(cc.random0To1()*3+0)+1;
            var clip = "res/raw-assets/resources/video/"+this._level+ "_" + type[index] + randIndex +".mp4";
            cc.log('clipdebug1');
            cc.log(clip);
            this.videoPlayer.clip = clip;
            this.videoPlayer.play();
            return;
        }
        return;
    },

    showBuyAlert () {
        this.videoPlayer.node.active = false;

        this.alertLayer.active = true;
        this.lblTip.string = "请确认您的购买";
        this.lblDesc.string = "您的爱心已用完，确定花5.0元原地复活吗？";
        this.lblBtn.string = "确定";
    },

    showShareAlert () {
        this.alertLayer.active = true;
        this.lblTip.string = "有爱提示";
        this.lblDesc.string = "恭喜已通关，是否现在分享给您的好友";
        this.lblBtn.string = "分享";
    },

    showRestartAlert () {
        this.alertLayer.active = true;
        this.lblTip.string = "有爱提示";
        this.lblDesc.string = "该美女您已通关，是否重新开始？";
        this.lblBtn.string = "确定";
    },

    onbtnClose (e) {
        cc.log('close');
        this.alertLayer.active = false;
        cc.director.loadScene("menuScene");
    }



});
