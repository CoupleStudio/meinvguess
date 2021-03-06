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

        videoLayer: cc.Node,
        pf_1_lock: cc.Prefab,
        pf_1_start: cc.Prefab,
        pf_1_win1: cc.Prefab,
        pf_1_win2: cc.Prefab,
        pf_1_win3: cc.Prefab,
        pf_2_lock: cc.Prefab,
        pf_2_start: cc.Prefab,
        pf_2_win1: cc.Prefab,
        pf_2_win2: cc.Prefab,
        pf_2_win3: cc.Prefab,
        pf_3_lock: cc.Prefab,
        pf_3_start: cc.Prefab,
        pf_3_win1: cc.Prefab,
        pf_3_win2: cc.Prefab,
        pf_3_win3: cc.Prefab,
        pf_4_lock: cc.Prefab,
        pf_4_start: cc.Prefab,
        pf_4_win1: cc.Prefab,
        pf_4_win2: cc.Prefab,
        pf_4_win3: cc.Prefab,
        pf_5_lock: cc.Prefab,
        pf_5_start: cc.Prefab,
        pf_5_win1: cc.Prefab,
        pf_5_win2: cc.Prefab,
        pf_5_win3: cc.Prefab,



    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.initGame();
    },

    initGame () {
        var self = this;
        this.alertLayer.active = false;
        this._btnType = -1;  //-1代表首次初始化，0代表购买确定，1代表分享，2代表重新开始确定
        this._final = -1;   //0代表输，1代表平局，2代表赢
        this._level = 1;    //level从1开始，5为止
        if(cc.sys.localStorage.getItem("level") != null) {
            this._level = cc.sys.localStorage.getItem("level");
        }
        this._blood = 5;    //初始化为5个红心
        if(cc.sys.localStorage.getItem("blood") != null) {
            this._blood = cc.sys.localStorage.getItem("blood");
        }

        this.refreshGame();
    },

    // update (dt) {},

    // onVideoPlayerEvent (sender, event) {
        
    //     if(event === cc.VideoPlayer.EventType.COMPLETED) {
    //         if(this._status == 1) {     //开始
    //             this.playGuessAnim();
    //             this.myGuess.active = true;
    //             return;
    //         }
    //         if(this._status == 2) {     //输
    //             this._blood--;
    //             if(this._blood <= 0) {
    //                 this._blood = 0;
    //             }
    //             cc.sys.localStorage.setItem("blood", this._blood);
    //             this.refreshGame();
    //             return;
    //         }
    //         if(this._status == 0) {     //赢
    //             this._level++;
    //             if(this._level >=6) {
    //                 this._level = 6;
    //             }
    //             cc.sys.localStorage.setItem("level", this._level);
    //             this.refreshGame();
    //             return;
    //         }
    //     }
    // },

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
            this.showBuyAlert();
            return;
        }
        if(this._level >=6) {
            this.showRestartAlert();
            return;
        }
        this.playVideo(Type.Start);
    },

    playVideo (index) {
        if(!Object.values(Type).includes(index)) {
            return;
        }
        this.videoLayer.removeAllChildren();
        var type = ["lock", "start", "win"];    //lock是赢，win是输，start是重新开始
        if(type[index]!=undefined && type[index]!="win") {
            // var clip = "res/raw-assets/resources/video/"+this._level+ "_" + type[index]+".mp4";
            // cc.log('clipdebug');
            // cc.log(clip);
            // this.videoPlayer.clip = clip;
            // this.videoPlayer.play();
            
            
            var newNode = cc.instantiate(this["pf_"+this._level+"_"+type[index]]);
            newNode.parent = this.videoLayer;
            return;
        }
        if(type[index] == "win") {                  //输
            var randIndex = Math.floor(cc.random0To1()*3+0)+1;
            // var clip = "res/raw-assets/resources/video/"+this._level+ "_" + type[index] + randIndex +".mp4";
            // cc.log('clipdebug1');
            // cc.log(clip);
            // this.videoPlayer.clip = clip;
            // this.videoPlayer.play();
            var newNode = cc.instantiate(this["pf_"+this._level+"_"+type[index]+randIndex]);
            newNode.parent = this.videoLayer;
            return;
        }
        return;
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
        
        var self = this;
        var scissor = ["cloth", "scissor", "stone"];
        var stone = ["scissor", "stone", "cloth"];
        var cloth = ["stone", "cloth", "scissor"];

        this.playAudio("guessChoice");

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

        if(this._status == 0) {     //-1代表结束，0代表Win，1代表Start，2代表Lost
            this.playAudio("choiceSuccess");
        } else if(this._status == 2) {
            this.playAudio("choiceFail");
        }        

        //播放对应结果的相关视频及相关生命值       
        this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function(target, data) {   //target必须带上，否则将把data看作是object
            if(!Object.values(Type).includes(data)) {
                return;
            }
           
            self.spVS.node.active = false;
            self.spResult.node.setPosition(cc.v2(0, 782));
            self.spGuessGG.node.active = false;
            self.spGuessMM.node.active = false;

            // self.playVideo(data);
            self.playVideo(data);
        }, this, this._status)));
    }, 

    showBuyAlert () {
        this.videoPlayer.node.active = false;
        this._btnType = 0;

        this.alertLayer.active = true;
        this.lblTip.string = "请确认您的购买";
        this.lblDesc.string = "您的爱心已用完，确定花5.0元原地复活吗？";
        this.lblBtn.string = "确定";
    },

    showShareAlert () {
        this._btnType = 1;
        this.alertLayer.active = true;
        this.lblTip.string = "有爱提示";
        this.lblDesc.string = "恭喜已通关，是否现在分享给您的好友";
        this.lblBtn.string = "分享";
    },

    showRestartAlert () {
        cc.log('restart');
        this.videoPlayer.node.active = false;
        this._btnType = 2;
        this.alertLayer.active = true;
        this.lblTip.string = "有爱提示";
        this.lblDesc.string = "该美女您已通关，是否重新开始？";
        this.lblBtn.string = "确定";
    },

    onbtnClose (e) {
        cc.log('close');
        this.alertLayer.active = false;
        cc.director.loadScene("menuScene");
    },

    onbtnOK (e) {
        switch(this._btnType) {
            case 0:                                 //购买
            this._btnType = -1;
            this._blood = 1;
            cc.sys.localStorage.setItem("blood", this._blood);
            cc.director.loadScene("gameScene");
            break;

            case 1:                                 //分享
            this._btnType = -1;
            cc.log("shareshare");
            break;

            case 2:                                 //重新开始
            this._btnType = -1;
            this._level = 1;
            cc.sys.localStorage.setItem("level", this._level);
            cc.director.loadScene("menuScene");;
            break;

            default:
            break;
        }
    },

    playAudio (type) {      //type为choiceFail，choiceSuccess， guess_choice，lock
        var arr = ["choiceFail", "choiceSuccess", "guessChoice", "lock"];
        if(!arr.includes(type)) {
            return;
        }

        this.node.getComponent("audioMgr").play(arr.indexOf(type));
    }


});
